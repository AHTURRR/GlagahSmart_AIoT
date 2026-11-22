/*
  PROTOTIPE SIMULASI (Wokwi) - Probe Pemantau Limbah Bunga Glagah
  ----------------------------------------------------------------
  Alur data:  ALAT (ESP32) --Wi-Fi--> SERVER (broker MQTT) --> DASHBOARD WEB

  Komponen: ESP32, DS18B20 (suhu tumpukan), DHT22 (suhu & kelembapan udara
            di kepala alat), 3 LED, buzzer.

  Fungsi:
  1. Membaca sensor, memvalidasi, lalu menghitung kelas kondisi limbah
     (cenderung kering / tidak pasti / aktif-lembap).
  2. Menampilkan hasil secara lokal (LED + buzzer), tetap jalan walau
     internet putus.
  3. Mengirim data + hasil ke server (MQTT) secara berkala dan saat
     kelas berubah.

  PENTING:
  - Di Wokwi semua pembacaan adalah DATA TIRUAN. Simulasi hanya membuktikan
    LOGIKA dan ALUR DATA, bukan akurasi sensor atau kinerja di lapangan.
  - Semua angka ambang adalah ASUMSI AWAL. Ganti dengan nilai dari
    penyuluh/dosen/literatur sebelum dipakai di proposal.
  - Broker MQTT publik tidak aman: siapa pun yang tahu topiknya bisa
    membaca data. Jangan kirim data sensitif. Ganti ID_ALAT dengan ID unik.
*/

#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// ===================== JARINGAN =====================
const char* WIFI_SSID   = "Wokwi-GUEST";   // jaringan Wi-Fi simulasi Wokwi
const char* WIFI_PASS   = "";
const char* MQTT_SERVER = "broker.hivemq.com";  // broker publik (hanya untuk simulasi)
const int   MQTT_PORT   = 1883;
const char* ID_ALAT     = "GANTI_ID_UNIK";      // ganti, contoh: "glagah-andi-01"

// ===================== PIN =====================
const int PIN_DHT        = 15;
const int PIN_DS18B20    = 4;
const int PIN_LED_HIJAU  = 25;  // cenderung kering -> benih / briket
const int PIN_LED_KUNING = 26;  // tidak pasti -> tahan, cek ulang
const int PIN_LED_MERAH  = 27;  // aktif / lembap -> pupuk / kompos
const int PIN_BUZZER     = 14;

// ===================== PARAMETER KEPUTUSAN (ASUMSI - GANTI!) =====================
const float AMBANG_DELTA_AKTIF   = 5.0;   // C : tumpukan lebih hangat dari udara
const float AMBANG_DELTA_KECIL   = 2.0;   // C : selisih kecil = belum aktif
const float AMBANG_HUM_TINGGI    = 80.0;  // % kelembapan udara tinggi
const float AMBANG_HUM_RENDAH    = 55.0;  // % kelembapan udara rendah
const float AMBANG_TREN_NAIK     = 1.0;   // C per siklus: selisih suhu naik
const float AMBANG_SUHU_TINGGI   = 60.0;  // C : peringatan suhu tumpukan tinggi

const int   JUMLAH_SAMPEL        = 5;
const int   JUMLAH_KONFIRMASI    = 3;
const unsigned long INTERVAL_BACA  = 1500;   // ms : baca sensor
const unsigned long INTERVAL_KIRIM = 5000;   // ms : kirim data berkala
const unsigned long INTERVAL_RECONNECT = 5000; // ms : coba sambung ulang MQTT

// ===================== OBJEK & TIPE =====================
DHT dht(PIN_DHT, DHT22);
OneWire oneWire(PIN_DS18B20);
DallasTemperature sensorSuhu(&oneWire);
WiFiClient wifiClient;
PubSubClient mqtt(wifiClient);

enum Kelas { KELAS_KERING, KELAS_CEK, KELAS_AKTIF };

struct RataRata {
  float data[JUMLAH_SAMPEL];
  int idx = 0;
  int jumlah = 0;
  void tambah(float v) {
    data[idx] = v;
    idx = (idx + 1) % JUMLAH_SAMPEL;
    if (jumlah < JUMLAH_SAMPEL) jumlah++;
  }
  float nilai() const {
    if (jumlah == 0) return 0;
    float total = 0;
    for (int i = 0; i < jumlah; i++) total += data[i];
    return total / jumlah;
  }
};

RataRata rrDelta;
RataRata rrHum;

// ===================== STATE =====================
Kelas kelasAktif = KELAS_CEK;
Kelas kandidat = KELAS_CEK;
int hitungKonfirmasi = 0;
float deltaSebelumnya = -999;
bool suhuTinggiSebelumnya = false;
unsigned long waktuBaca = 0;
unsigned long waktuKirim = 0;
unsigned long waktuReconnect = 0;
char topicData[80];
char clientId[40];

// ===================== FUNGSI DASAR =====================
const char* namaKelas(Kelas k) {
  switch (k) {
    case KELAS_KERING: return "CENDERUNG KERING";
    case KELAS_AKTIF:  return "AKTIF/LEMBAP";
    default:           return "TIDAK PASTI";
  }
}

const char* rekomendasi(Kelas k) {
  switch (k) {
    case KELAS_KERING: return "BENIH / BRIKET";
    case KELAS_AKTIF:  return "PUPUK / KOMPOS";
    default:           return "TAHAN, CEK ULANG";
  }
}

void bunyi(int kali, int durasi) {
  for (int i = 0; i < kali; i++) {
    tone(PIN_BUZZER, 2000, durasi);
    delay(durasi + 80);
  }
}

void setLED(bool hijau, bool kuning, bool merah) {
  digitalWrite(PIN_LED_HIJAU,  hijau  ? HIGH : LOW);
  digitalWrite(PIN_LED_KUNING, kuning ? HIGH : LOW);
  digitalWrite(PIN_LED_MERAH,  merah  ? HIGH : LOW);
}

// Aturan inferensi: skor dari 3 indikator
Kelas klasifikasi(float delta, float hum, float tren, int &skor) {
  skor = 0;
  if (delta >= AMBANG_DELTA_AKTIF) skor++;
  if (hum >= AMBANG_HUM_TINGGI)    skor++;
  if (tren >= AMBANG_TREN_NAIK)    skor++;

  if (skor >= 2) return KELAS_AKTIF;
  if (skor == 0 && delta <= AMBANG_DELTA_KECIL && hum <= AMBANG_HUM_RENDAH)
    return KELAS_KERING;
  return KELAS_CEK;
}

// Tampilan lokal (tetap bekerja walau internet putus)
void terapkanKelas(Kelas k) {
  switch (k) {
    case KELAS_KERING: setLED(true, false, false); bunyi(1, 120); break;
    case KELAS_AKTIF:  setLED(false, false, true); bunyi(3, 120); break;
    default:           setLED(false, true, false); bunyi(2, 120); break;
  }
}

// ===================== JARINGAN =====================
void kirimPesan(const char* payload) {
  if (!mqtt.connected()) {
    Serial.println("[MQTT] belum tersambung, data hanya tampil lokal");
    return;
  }
  bool ok = mqtt.publish(topicData, payload);
  Serial.printf("[MQTT] kirim %s: %s\n", ok ? "OK" : "GAGAL", payload);
}

void kirimData(float tumpuk, float udara, float hum, float delta,
               float tren, int skor, bool suhuTinggi) {
  char payload[400];
  snprintf(payload, sizeof(payload),
    "{\"id\":\"%s\",\"tumpuk\":%.1f,\"udara\":%.1f,\"hum\":%.0f,"
    "\"delta\":%.1f,\"tren\":%.1f,\"skor\":%d,\"kelas\":\"%s\","
    "\"rekomendasi\":\"%s\",\"suhu_tinggi\":%s,\"error\":\"\"}",
    ID_ALAT, tumpuk, udara, hum, delta, tren, skor,
    namaKelas(kelasAktif), rekomendasi(kelasAktif),
    suhuTinggi ? "true" : "false");
  kirimPesan(payload);
}

void kirimError(const char* sumber) {
  char payload[200];
  snprintf(payload, sizeof(payload),
    "{\"id\":\"%s\",\"error\":\"%s\"}", ID_ALAT, sumber);
  kirimPesan(payload);
}

void jagaKoneksi() {
  if (WiFi.status() != WL_CONNECTED) return;           // menunggu Wi-Fi
  if (mqtt.connected()) { mqtt.loop(); return; }
  if (millis() - waktuReconnect < INTERVAL_RECONNECT) return;
  waktuReconnect = millis();
  Serial.print("[MQTT] menyambung ke broker... ");
  if (mqtt.connect(clientId)) Serial.println("tersambung");
  else Serial.printf("gagal (kode %d), coba lagi nanti\n", mqtt.state());
}

void modeAman(const char* pesan) {
  Serial.printf("ERROR: %s. Mode aman: LED kuning.\n", pesan);
  setLED(false, true, false);
  kirimError(pesan);
  bunyi(5, 60);
}

// ===================== SETUP =====================
void setup() {
  Serial.begin(115200);
  pinMode(PIN_LED_HIJAU, OUTPUT);
  pinMode(PIN_LED_KUNING, OUTPUT);
  pinMode(PIN_LED_MERAH, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  setLED(false, true, false);

  dht.begin();
  sensorSuhu.begin();

  snprintf(topicData, sizeof(topicData), "idtc2026/glagah/%s/data", ID_ALAT);
  snprintf(clientId, sizeof(clientId), "esp32-%s-%04X", ID_ALAT, (unsigned)random(0xFFFF));

  WiFi.begin(WIFI_SSID, WIFI_PASS, 6);   // kanal 6 untuk Wokwi-GUEST
  mqtt.setServer(MQTT_SERVER, MQTT_PORT);
  mqtt.setBufferSize(512);

  Serial.println("=== Simulasi dimulai (data tiruan) ===");
  Serial.printf("Topik data: %s\n", topicData);
}

// ===================== LOOP =====================
void loop() {
  jagaKoneksi();

  if (millis() - waktuBaca < INTERVAL_BACA) return;
  waktuBaca = millis();

  // 1) BACA SENSOR
  float suhuUdara = dht.readTemperature();
  float humUdara  = dht.readHumidity();
  sensorSuhu.requestTemperatures();
  float suhuTumpuk = sensorSuhu.getTempCByIndex(0);

  // 2) VALIDASI SENSOR
  if (isnan(suhuUdara) || isnan(humUdara)) { modeAman("DHT22 gagal dibaca"); return; }
  if (suhuTumpuk == DEVICE_DISCONNECTED_C) { modeAman("DS18B20 terputus"); return; }

  // 3) RATA-RATA BERGERAK & TREN
  rrDelta.tambah(suhuTumpuk - suhuUdara);
  rrHum.tambah(humUdara);
  float delta = rrDelta.nilai();
  float hum   = rrHum.nilai();
  float tren  = (deltaSebelumnya > -900) ? (delta - deltaSebelumnya) : 0;
  deltaSebelumnya = delta;

  // 4) PERINGATAN SUHU TINGGI (sekali saat baru terlampaui)
  bool suhuTinggi = suhuTumpuk >= AMBANG_SUHU_TINGGI;
  if (suhuTinggi && !suhuTinggiSebelumnya) {
    Serial.println("PERINGATAN: suhu tumpukan tinggi, periksa tumpukan!");
    bunyi(2, 400);
  }
  suhuTinggiSebelumnya = suhuTinggi;

  // 5) KLASIFIKASI + KONFIRMASI
  int skor = 0;
  Kelas hasil = klasifikasi(delta, hum, tren, skor);
  bool kelasBerubah = false;

  if (hasil == kandidat) {
    if (hitungKonfirmasi < JUMLAH_KONFIRMASI) hitungKonfirmasi++;
  } else {
    kandidat = hasil;
    hitungKonfirmasi = 1;
  }
  if (hitungKonfirmasi >= JUMLAH_KONFIRMASI && kandidat != kelasAktif) {
    kelasAktif = kandidat;
    kelasBerubah = true;
    terapkanKelas(kelasAktif);
    Serial.printf(">> REKOMENDASI BERUBAH: %s\n", rekomendasi(kelasAktif));
  }

  // 6) LOG LOKAL
  Serial.printf("Tumpuk=%.1fC Udara=%.1fC Hum=%.0f%% Delta=%.1f Tren=%+.1f "
                "Skor=%d Kelas=%s | Wi-Fi:%s MQTT:%s\n",
                suhuTumpuk, suhuUdara, humUdara, delta, tren, skor,
                namaKelas(kelasAktif),
                WiFi.status() == WL_CONNECTED ? "ya" : "tidak",
                mqtt.connected() ? "ya" : "tidak");

  // 7) KIRIM KE SERVER: berkala, atau segera saat kelas berubah
  if (kelasBerubah || millis() - waktuKirim >= INTERVAL_KIRIM) {
    waktuKirim = millis();
    kirimData(suhuTumpuk, suhuUdara, humUdara, delta, tren, skor, suhuTinggi);
  }
}
