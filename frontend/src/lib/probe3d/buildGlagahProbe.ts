import * as THREE from "three";
import {
  ProbePartId,
  PROBE_PART_ORDER,
  PROBE_PART_SPECS,
  ProbeLiveVisualState,
} from "./probeSpecs";

export interface GlagahProbeRig {
  root: THREE.Group;
  parts: Record<ProbePartId, THREE.Group>;
  basePositions: Record<ProbePartId, THREE.Vector3>;
  housingShellMaterials: THREE.MeshStandardMaterial[];
  leds: {
    green: THREE.MeshStandardMaterial;
    yellow: THREE.MeshStandardMaterial;
    red: THREE.MeshStandardMaterial;
  };
  buzzerRings: THREE.Group;
  thermalRingMaterial: THREE.MeshStandardMaterial;
}

function createRoundedRectShape(
  width: number,
  height: number,
  radius: number
): THREE.Shape {
  const s = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  s.moveTo(x + radius, y);
  s.lineTo(x + width - radius, y);
  s.quadraticCurveTo(x + width, y, x + width, y + radius);
  s.lineTo(x + width, y + height - radius);
  s.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  s.lineTo(x + radius, y + height);
  s.quadraticCurveTo(x, y + height, x, y + height - radius);
  s.lineTo(x, y + radius);
  s.quadraticCurveTo(x, y, x + radius, y);
  return s;
}

function tagPartTree(group: THREE.Group, partId: ProbePartId): void {
  group.name = `probe-part-${partId}`;
  group.userData.partId = partId;
  group.traverse((obj) => {
    obj.userData.partId = partId;
    if (obj instanceof THREE.Mesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const mat of mats) {
        if (
          mat instanceof THREE.MeshStandardMaterial &&
          mat.userData.baseEmissiveHex === undefined
        ) {
          mat.userData.baseEmissiveHex = mat.emissive.getHex();
          mat.userData.baseEmissiveIntensity = mat.emissiveIntensity;
        }
      }
    }
  });
}

function buildAxialResistor(
  bands: [number, number, number, number],
  scale = 1
): THREE.Group {
  const g = new THREE.Group();
  const leadMat = new THREE.MeshStandardMaterial({
    color: 0xb9c2bb,
    metalness: 0.85,
    roughness: 0.25,
  });
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xd2b486,
    roughness: 0.65,
    metalness: 0.05,
  });

  const lead = new THREE.Mesh(
    new THREE.CylinderGeometry(0.008 * scale, 0.008 * scale, 0.3 * scale, 10),
    leadMat
  );
  g.add(lead);

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.024 * scale, 0.024 * scale, 0.14 * scale, 14),
    bodyMat
  );
  g.add(body);

  const bandYs = [0.042, 0.015, -0.012, -0.045];
  bands.forEach((hex, idx) => {
    const band = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.0252 * scale,
        0.0252 * scale,
        0.014 * scale,
        14
      ),
      new THREE.MeshStandardMaterial({ color: hex, roughness: 0.5 })
    );
    band.position.y = bandYs[idx] * scale;
    g.add(band);
  });

  return g;
}

export function buildGlagahProbe(): GlagahProbeRig {
  const root = new THREE.Group();
  root.name = "GlagahSmart_IoT_Probe";

  // ==================== 1. HOUSING (ENCLOSURE KEPALA & GRIP) ====================
  const housing = new THREE.Group();
  housing.position.set(0, 1.38, 0);

  const shellOliveMat = new THREE.MeshStandardMaterial({
    color: 0x24523a,
    roughness: 0.62,
    metalness: 0.08,
  });
  const shellCharcoalMat = new THREE.MeshStandardMaterial({
    color: 0x1e2a21,
    roughness: 0.76,
    metalness: 0.12,
  });
  const makeSteelMat = () =>
    new THREE.MeshStandardMaterial({
      color: 0xc2cbc3,
      metalness: 0.82,
      roughness: 0.28,
    });
  const makeBrassMat = () =>
    new THREE.MeshStandardMaterial({
      color: 0xc99a3b,
      metalness: 0.78,
      roughness: 0.32,
    });
  const housingSteelMat = makeSteelMat();
  const panelSteelMat = makeSteelMat();
  const panelBrassMat = makeBrassMat();
  const dhtSteelMat = makeSteelMat();
  const espSteelMat = makeSteelMat();
  const espBrassMat = makeBrassMat();

  const housingShellMaterials = [shellOliveMat, shellCharcoalMat];

  // Upper beveled head enclosure body
  const headShape = createRoundedRectShape(1.24, 1.38, 0.14);
  const headExtrude = new THREE.ExtrudeGeometry(headShape, {
    depth: 0.66,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.045,
    bevelThickness: 0.045,
  });
  headExtrude.center();
  const mainBody = new THREE.Mesh(headExtrude, shellOliveMat);
  mainBody.position.set(0, 0.12, -0.02);
  housing.add(mainBody);

  // Protective top cap lip
  const capShape = createRoundedRectShape(1.28, 0.72, 0.12);
  const capGeom = new THREE.ExtrudeGeometry(capShape, {
    depth: 0.09,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  });
  capGeom.rotateX(Math.PI / 2);
  capGeom.center();
  const topCap = new THREE.Mesh(capGeom, shellCharcoalMat);
  topCap.position.set(0, 0.84, -0.02);
  housing.add(topCap);

  // 4 stainless corner hex bolts on top cap
  const boltOffsets: [number, number][] = [
    [-0.5, -0.24],
    [0.5, -0.24],
    [-0.5, 0.2],
    [0.5, 0.2],
  ];
  for (const [bx, bz] of boltOffsets) {
    const bolt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.036, 0.036, 0.04, 6),
      housingSteelMat
    );
    bolt.position.set(bx, 0.9, bz);
    housing.add(bolt);
  }

  // Ergonomic lower tapered grip collar + ribbed bands
  const gripCollar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.24, 0.44, 24),
    shellCharcoalMat
  );
  gripCollar.position.set(0, -0.68, -0.02);
  housing.add(gripCollar);

  for (let i = 0; i < 3; i += 1) {
    const rib = new THREE.Mesh(
      new THREE.TorusGeometry(0.32 - i * 0.032, 0.016, 10, 28),
      shellOliveMat
    );
    rib.rotation.x = Math.PI / 2;
    rib.position.set(0, -0.56 - i * 0.11, -0.02);
    housing.add(rib);
  }

  // Side elastomer grip strip on left flank
  const leftGrip = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.96, 0.42),
    shellCharcoalMat
  );
  leftGrip.position.set(-0.66, 0.1, -0.02);
  housing.add(leftGrip);

  // Sealed USB-C charging / serial port on lower rear
  const usbGasket = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.11, 0.06),
    shellCharcoalMat
  );
  usbGasket.position.set(0, -0.44, -0.37);
  housing.add(usbGasket);

  const usbRim = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.055, 0.05),
    housingSteelMat
  );
  usbRim.position.set(0, -0.44, -0.39);
  housing.add(usbRim);

  // ==================== 2. PANEL (3x LED STATUS & PIEZO BUZZER) ====================
  const panel = new THREE.Group();
  panel.position.set(0, 1.48, 0.37);

  const bezelMat = new THREE.MeshStandardMaterial({
    color: 0x151d17,
    roughness: 0.46,
    metalness: 0.32,
  });
  const clayAccentMat = new THREE.MeshStandardMaterial({
    color: 0xb9673a,
    roughness: 0.52,
    metalness: 0.15,
  });

  const panelPlate = new THREE.Mesh(
    new THREE.BoxGeometry(1.06, 1.12, 0.07),
    bezelMat
  );
  panelPlate.rotation.x = -0.09;
  panel.add(panelPlate);

  // Thin terracotta divider rule across panel
  const dividerRule = new THREE.Mesh(
    new THREE.BoxGeometry(0.86, 0.016, 0.025),
    clayAccentMat
  );
  dividerRule.position.set(0, -0.06, 0.036);
  dividerRule.rotation.x = -0.09;
  panel.add(dividerRule);

  // 3 Status LEDs (Green GPIO25, Yellow GPIO26, Red GPIO27)
  const ledGreenMat = new THREE.MeshStandardMaterial({
    color: 0x389e62,
    emissive: new THREE.Color(0x46b871),
    emissiveIntensity: 0.08,
    roughness: 0.22,
    metalness: 0.05,
  });
  ledGreenMat.userData.isDynamicIndicator = true;

  const ledYellowMat = new THREE.MeshStandardMaterial({
    color: 0xc9962c,
    emissive: new THREE.Color(0xe0ae3b),
    emissiveIntensity: 0.08,
    roughness: 0.22,
    metalness: 0.05,
  });
  ledYellowMat.userData.isDynamicIndicator = true;

  const ledRedMat = new THREE.MeshStandardMaterial({
    color: 0xc2463a,
    emissive: new THREE.Color(0xdc5548),
    emissiveIntensity: 0.08,
    roughness: 0.22,
    metalness: 0.05,
  });
  ledRedMat.userData.isDynamicIndicator = true;

  const ledSpecs: Array<{ x: number; mat: THREE.MeshStandardMaterial }> = [
    { x: -0.29, mat: ledGreenMat },
    { x: 0, mat: ledYellowMat },
    { x: 0.29, mat: ledRedMat },
  ];

  for (const spec of ledSpecs) {
    const holder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.11, 0.04, 24),
      panelSteelMat
    );
    holder.rotation.x = Math.PI / 2 - 0.09;
    holder.position.set(spec.x, 0.24, 0.03);
    panel.add(holder);

    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.076, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.6),
      spec.mat
    );
    dome.rotation.x = Math.PI / 2 - 0.09;
    dome.position.set(spec.x, 0.24, 0.045);
    panel.add(dome);

    // Subtle matte keycap label bar beneath each LED
    const tagBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.028, 0.015),
      new THREE.MeshStandardMaterial({ color: 0x3b493f, roughness: 0.7 })
    );
    tagBar.position.set(spec.x, 0.07, 0.046);
    tagBar.rotation.x = -0.09;
    panel.add(tagBar);
  }

  // Piezo Buzzer recessed acoustic grille (GPIO 14)
  const buzzerHousing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.19, 0.2, 0.045, 28),
    new THREE.MeshStandardMaterial({
      color: 0x101612,
      roughness: 0.65,
      metalness: 0.2,
    })
  );
  buzzerHousing.rotation.x = Math.PI / 2 - 0.09;
  buzzerHousing.position.set(0, -0.31, 0.056);
  panel.add(buzzerHousing);

  const buzzerInner = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.055, 0.052, 20),
    panelBrassMat
  );
  buzzerInner.rotation.x = Math.PI / 2 - 0.09;
  buzzerInner.position.set(0, -0.31, 0.06);
  panel.add(buzzerInner);

  for (let r = 0; r < 6; r += 1) {
    const angle = (r / 6) * Math.PI * 2;
    const ventDot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.05, 10),
      new THREE.MeshStandardMaterial({ color: 0x2a362d, roughness: 0.8 })
    );
    ventDot.rotation.x = Math.PI / 2 - 0.09;
    ventDot.position.set(
      Math.cos(angle) * 0.12,
      -0.31 + Math.sin(angle) * 0.12,
      0.062
    );
    panel.add(ventDot);
  }

  // Concentric alert rings shown only when coreTemp >= 60°C
  const buzzerRings = new THREE.Group();
  buzzerRings.position.set(0, -0.31, 0.09);
  buzzerRings.rotation.x = -0.09;
  buzzerRings.visible = false;

  const alertRingMat = new THREE.MeshStandardMaterial({
    color: 0xe48d6d,
    emissive: new THREE.Color(0xdc5548),
    emissiveIntensity: 0.9,
    roughness: 0.4,
  });
  alertRingMat.userData.isDynamicIndicator = true;

  for (const rad of [0.245, 0.31]) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(rad, 0.01, 10, 36),
      alertRingMat
    );
    buzzerRings.add(ring);
  }
  panel.add(buzzerRings);

  // ==================== 3. DHT22 (VENTED SIDE AMBIENT HOOD) ====================
  const dht22 = new THREE.Group();
  dht22.position.set(0.76, 1.48, -0.02);

  const hoodMat = new THREE.MeshStandardMaterial({
    color: 0x1e2a21,
    roughness: 0.72,
    metalness: 0.12,
  });
  const dhtBodyMat = new THREE.MeshStandardMaterial({
    color: 0xf4f0e8,
    roughness: 0.55,
    metalness: 0.02,
  });
  const dhtGrilleMat = new THREE.MeshStandardMaterial({
    color: 0xbcb5a4,
    roughness: 0.7,
  });

  // Mounting flange joining hood to head housing
  const flange = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.64, 0.44),
    hoodMat
  );
  flange.position.set(-0.1, 0, 0);
  dht22.add(flange);

  // Top & bottom rain/dust protective plates
  const hoodTop = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.055, 0.44),
    shellOliveMat.clone()
  );
  hoodTop.position.set(0.06, 0.31, 0);
  dht22.add(hoodTop);

  const hoodBottom = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.055, 0.44),
    hoodMat
  );
  hoodBottom.position.set(0.06, -0.31, 0);
  dht22.add(hoodBottom);

  // Louvered side slats (air flows in, glagah dust deflected out)
  for (let i = 0; i < 5; i += 1) {
    const slat = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.045, 0.42),
      hoodMat
    );
    slat.position.set(0.21, -0.2 + i * 0.1, 0);
    slat.rotation.z = 0.35;
    dht22.add(slat);
  }

  // Actual white AM2302 / DHT22 module housed inside vented hood
  const dhtModule = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.4, 0.3),
    dhtBodyMat
  );
  dhtModule.position.set(0.04, 0.02, 0);
  dht22.add(dhtModule);

  for (let row = 0; row < 4; row += 1) {
    const slot = new THREE.Mesh(
      new THREE.BoxGeometry(0.148, 0.038, 0.2),
      dhtGrilleMat
    );
    slot.position.set(0.04, -0.09 + row * 0.075, 0);
    dht22.add(slot);
  }

  // 4 metallic sensor pins pointing inward to ESP32
  for (let p = 0; p < 4; p += 1) {
    const pin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.14, 8),
      dhtSteelMat
    );
    pin.rotation.z = Math.PI / 2;
    pin.position.set(-0.07, -0.22, -0.09 + p * 0.06);
    dht22.add(pin);
  }

  // ==================== 4. ESP32 DEVKIT-C V4 + RESISTORS (INTERNAL) ====================
  const esp32 = new THREE.Group();
  esp32.position.set(-0.06, 1.46, -0.02);

  const pcbMat = new THREE.MeshStandardMaterial({
    color: 0x162219,
    roughness: 0.58,
    metalness: 0.12,
  });
  const icMat = new THREE.MeshStandardMaterial({
    color: 0x121714,
    roughness: 0.42,
    metalness: 0.15,
  });

  // Main ESP32 PCB board
  const pcb = new THREE.Mesh(new THREE.BoxGeometry(0.54, 1.04, 0.045), pcbMat);
  esp32.add(pcb);

  // ESP-WROOM-32 brushed metallic RF shield
  const rfShield = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.38, 0.065),
    espSteelMat
  );
  rfShield.position.set(0, 0.2, 0.05);
  esp32.add(rfShield);

  // Gold PCB Wi-Fi meander trace antenna at top
  const antennaBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.075, 0.015),
    espBrassMat
  );
  antennaBar.position.set(0, 0.45, 0.026);
  esp32.add(antennaBar);

  // CP2102 USB-UART bridge IC
  const cp2102 = new THREE.Mesh(
    new THREE.BoxGeometry(0.11, 0.11, 0.03),
    icMat
  );
  cp2102.position.set(0, -0.14, 0.035);
  esp32.add(cp2102);

  // Twin 19-pin header rails
  for (const sideX of [-0.22, 0.22]) {
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(0.055, 0.9, 0.06),
      icMat
    );
    rail.position.set(sideX, -0.02, -0.035);
    esp32.add(rail);
  }

  // Micro-USB metal port on PCB bottom
  const boardUsb = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.09, 0.06),
    espSteelMat
  );
  boardUsb.position.set(0, -0.49, 0.04);
  esp32.add(boardUsb);

  // Pull-up Resistor 4.7kΩ (Yellow-Violet-Red-Gold) beside ESP32
  const rPull = buildAxialResistor([0xfacc15, 0x7e22ce, 0xdc2626, 0xc99a3b], 1);
  rPull.position.set(0.37, 0.28, 0.02);
  esp32.add(rPull);

  // 3x 330Ω LED Resistors (Orange-Orange-Brown-Gold)
  for (let i = 0; i < 3; i += 1) {
    const rLed = buildAxialResistor(
      [0xf97316, 0xf97316, 0x78350f, 0xc99a3b],
      0.85
    );
    rLed.position.set(0.37, -0.02 - i * 0.16, 0.02);
    rLed.rotation.z = Math.PI / 2;
    esp32.add(rLed);
  }

  // ==================== 5. SHAFT (CABLE GLAND & STAINLESS SPEAR) ====================
  const shaft = new THREE.Group();
  shaft.position.set(0, -0.68, -0.02);

  const stainlessMat = new THREE.MeshStandardMaterial({
    color: 0xc8d0c9,
    metalness: 0.85,
    roughness: 0.26,
  });
  const markRingMat = new THREE.MeshStandardMaterial({
    color: 0x222c24,
    roughness: 0.65,
    metalness: 0.2,
  });

  // Hexagonal stainless cable gland nut at top of shaft
  const glandNut = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.16, 6),
    stainlessMat
  );
  glandNut.position.set(0, 1.24, 0);
  shaft.add(glandNut);

  const glandNeck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.11, 0.18, 20),
    stainlessMat
  );
  glandNeck.position.set(0, 1.08, 0);
  shaft.add(glandNeck);

  // Main rigid stainless steel insertion tube (~35 cm proportional)
  const tube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.072, 0.068, 2.38, 24),
    stainlessMat
  );
  tube.position.set(0, -0.18, 0);
  shaft.add(tube);

  // Engraved depth graduation rings (10 / 20 / 30 cm)
  for (const ry of [0.46, -0.22, -0.9]) {
    const depthMark = new THREE.Mesh(
      new THREE.CylinderGeometry(0.074, 0.074, 0.026, 24),
      markRingMat
    );
    depthMark.position.set(0, ry, 0);
    shaft.add(depthMark);
  }

  // ==================== 6. DS18B20 WATERPROOF SENSOR TIP ====================
  const ds18b20 = new THREE.Group();
  ds18b20.position.set(0, -2.35, -0.02);

  const tipSteelMat = new THREE.MeshStandardMaterial({
    color: 0xd4dcd5,
    metalness: 0.88,
    roughness: 0.2,
  });
  const thermalRingMaterial = new THREE.MeshStandardMaterial({
    color: 0x6c9a72,
    emissive: new THREE.Color(0x6c9a72),
    emissiveIntensity: 0.28,
    roughness: 0.35,
    metalness: 0.2,
  });
  thermalRingMaterial.userData.isDynamicIndicator = true;

  // Waterproof capsule ferrule
  const ferrule = new THREE.Mesh(
    new THREE.CylinderGeometry(0.074, 0.072, 0.42, 24),
    tipSteelMat
  );
  ferrule.position.set(0, 0.08, 0);
  ds18b20.add(ferrule);

  // Subtle thermal indicator band
  const thermalBand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.077, 0.077, 0.055, 24),
    thermalRingMaterial
  );
  thermalBand.position.set(0, 0.26, 0);
  ds18b20.add(thermalBand);

  // Pointed conical insertion spear tip
  const coneTip = new THREE.Mesh(
    new THREE.ConeGeometry(0.072, 0.32, 24),
    tipSteelMat
  );
  coneTip.rotation.x = Math.PI;
  coneTip.position.set(0, -0.29, 0);
  ds18b20.add(coneTip);

  // Assemble all 6 tagged sub-assemblies into root
  const parts: Record<ProbePartId, THREE.Group> = {
    housing,
    panel,
    dht22,
    esp32,
    shaft,
    ds18b20,
  };

  const basePositions = {} as Record<ProbePartId, THREE.Vector3>;
  for (const id of PROBE_PART_ORDER) {
    const group = parts[id];
    tagPartTree(group, id);
    basePositions[id] = group.position.clone();
    root.add(group);
  }

  return {
    root,
    parts,
    basePositions,
    housingShellMaterials,
    leds: {
      green: ledGreenMat,
      yellow: ledYellowMat,
      red: ledRedMat,
    },
    buzzerRings,
    thermalRingMaterial,
  };
}

export function applyProbeLiveState(
  rig: GlagahProbeRig,
  state: ProbeLiveVisualState
): void {
  const safeCoreTemp = Number.isFinite(state.coreTemp) ? state.coreTemp : 30;
  const safeDelta = Number.isFinite(state.delta) ? state.delta : 0;
  const isOverheat = Boolean(state.highTempWarning) || safeCoreTemp >= 60;

  const isGreen = state.hardwareClass === "CENDERUNG KERING";
  const isYellow = state.hardwareClass === "TIDAK PASTI";
  const isRed = state.hardwareClass === "AKTIF/LEMBAP";

  rig.leds.green.emissiveIntensity = isGreen ? 1.85 : 0.05;
  rig.leds.yellow.emissiveIntensity = isYellow ? 1.85 : 0.05;
  rig.leds.red.emissiveIntensity = isRed ? 1.85 : 0.05;

  rig.buzzerRings.visible = isOverheat;

  if (isOverheat) {
    rig.thermalRingMaterial.color.setHex(0xdc5548);
    rig.thermalRingMaterial.emissive.setHex(0xdc5548);
    rig.thermalRingMaterial.emissiveIntensity = 1.15;
  } else if (safeDelta >= 5.0) {
    rig.thermalRingMaterial.color.setHex(0xb9673a);
    rig.thermalRingMaterial.emissive.setHex(0xb9673a);
    rig.thermalRingMaterial.emissiveIntensity = 0.72;
  } else {
    rig.thermalRingMaterial.color.setHex(0x6c9a72);
    rig.thermalRingMaterial.emissive.setHex(0x6c9a72);
    rig.thermalRingMaterial.emissiveIntensity = 0.28;
  }
}

export function applyProbeViewMode(
  rig: GlagahProbeRig,
  opts: { exploded: number; xray: boolean; selectedPart: ProbePartId | null }
): void {
  const factor = Number.isFinite(opts.exploded)
    ? Math.min(1, Math.max(0, opts.exploded))
    : 0;

  for (const id of PROBE_PART_ORDER) {
    const group = rig.parts[id];
    const base = rig.basePositions[id];
    const [ox, oy, oz] = PROBE_PART_SPECS[id].explodedOffset;
    group.position.set(
      base.x + ox * factor,
      base.y + oy * factor,
      base.z + oz * factor
    );

    const isSelected = opts.selectedPart === id;
    group.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const mat of mats) {
        if (
          !(mat instanceof THREE.MeshStandardMaterial) ||
          mat.userData.isDynamicIndicator
        ) {
          continue;
        }
        if (isSelected) {
          mat.emissive.setHex(0x2f6e4a);
          mat.emissiveIntensity = 0.28;
        } else {
          mat.emissive.setHex(
            typeof mat.userData.baseEmissiveHex === "number"
              ? mat.userData.baseEmissiveHex
              : 0x000000
          );
          mat.emissiveIntensity =
            typeof mat.userData.baseEmissiveIntensity === "number"
              ? mat.userData.baseEmissiveIntensity
              : 0;
        }
      }
    });
  }

  for (const mat of rig.housingShellMaterials) {
    if (opts.xray) {
      mat.transparent = true;
      mat.opacity = 0.24;
      mat.depthWrite = false;
    } else {
      mat.transparent = false;
      mat.opacity = 1;
      mat.depthWrite = true;
    }
    mat.needsUpdate = true;
  }
}

export function disposeProbeRig(rig: GlagahProbeRig): void {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();

  rig.root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      if (obj.geometry) geometries.add(obj.geometry);
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const m of mats) {
        if (m) materials.add(m);
      }
    }
  });

  geometries.forEach((g) => g.dispose());
  materials.forEach((m) => m.dispose());
}
