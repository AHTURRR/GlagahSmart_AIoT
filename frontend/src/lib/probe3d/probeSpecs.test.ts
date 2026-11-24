import test from "node:test";
import assert from "node:assert/strict";
import {
  PROBE_PART_ORDER,
  PROBE_PART_SPECS,
  CAMERA_PRESETS,
  DEFAULT_PREVIEW_STATE,
  formatProbeHudMetrics,
} from "./probeSpecs";

test("registers all 6 hardware sub-assemblies faithful to diagram.json", () => {
  assert.deepEqual(PROBE_PART_ORDER, [
    "housing",
    "panel",
    "dht22",
    "esp32",
    "shaft",
    "ds18b20",
  ]);
  assert.match(PROBE_PART_SPECS.ds18b20.espPins, /GPIO 4/);
  assert.match(PROBE_PART_SPECS.dht22.espPins, /GPIO 15/);
  assert.match(PROBE_PART_SPECS.panel.espPins, /GPIO 25/);
  assert.match(PROBE_PART_SPECS.panel.espPins, /GPIO 14/);
  assert.match(PROBE_PART_SPECS.esp32.description, /4\.7\s*kΩ/i);
  for (const id of PROBE_PART_ORDER) {
    const spec = PROBE_PART_SPECS[id];
    assert.equal(spec.id, id);
    assert.equal(spec.explodedOffset.length, 3);
  }
});

test("defines all 4 camera presets and valid default preview state", () => {
  assert.deepEqual(
    CAMERA_PRESETS.map((c) => c.id),
    ["full", "head", "internal", "tip"]
  );
  assert.equal(DEFAULT_PREVIEW_STATE.hardwareClass, "CENDERUNG KERING");
  assert.equal(DEFAULT_PREVIEW_STATE.highTempWarning, false);
});

test("formatProbeHudMetrics guards non-finite numbers and matches 60C overheat threshold", () => {
  const normal = formatProbeHudMetrics({
    ...DEFAULT_PREVIEW_STATE,
    coreTemp: 61.2,
    ambientTemp: 28.4,
    ambientHum: 74.6,
    delta: 32.8,
    highTempWarning: false,
  });
  assert.equal(normal.coreTempText, "61.2°C");
  assert.equal(normal.ambientTempText, "28.4°C");
  assert.equal(normal.ambientHumText, "75%");
  assert.equal(normal.deltaText, "+32.8°C");
  assert.equal(normal.isOverheat, true);

  const malformed = formatProbeHudMetrics({
    ...DEFAULT_PREVIEW_STATE,
    coreTemp: Number.NaN,
    ambientTemp: Number.POSITIVE_INFINITY,
    ambientHum: Number.NEGATIVE_INFINITY,
    delta: Number.NaN,
    highTempWarning: false,
  });
  assert.equal(malformed.coreTempText, "--");
  assert.equal(malformed.ambientTempText, "--");
  assert.equal(malformed.ambientHumText, "--");
  assert.equal(malformed.deltaText, "--");
  assert.equal(malformed.isOverheat, false);
});
