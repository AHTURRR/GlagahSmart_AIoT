import test from "node:test";
import assert from "node:assert/strict";
import {
  PROBE_PART_ORDER,
  PROBE_PART_SPECS,
  CAMERA_PRESETS,
  DEFAULT_PREVIEW_STATE,
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
