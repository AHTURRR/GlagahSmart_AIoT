import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import {
  buildGlagahProbe,
  applyProbeLiveState,
  applyProbeViewMode,
  disposeProbeRig,
} from "./buildGlagahProbe";
import { PROBE_PART_ORDER, DEFAULT_PREVIEW_STATE } from "./probeSpecs";

test("builds all 6 tagged sub-assemblies with meshes under root", () => {
  const rig = buildGlagahProbe();
  for (const id of PROBE_PART_ORDER) {
    const group = rig.parts[id];
    assert.ok(group instanceof THREE.Group, `missing group ${id}`);
    assert.equal(group.userData.partId, id);
    let meshCount = 0;
    group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        meshCount += 1;
        assert.equal(obj.userData.partId, id);
      }
    });
    assert.ok(meshCount >= 2, `group ${id} should contain detailed meshes`);
  }
  disposeProbeRig(rig);
});

test("maps live LED classes, buzzer alert, thermal tip, and guards NaN inputs", () => {
  const rig = buildGlagahProbe();

  applyProbeLiveState(rig, {
    ...DEFAULT_PREVIEW_STATE,
    hardwareClass: "CENDERUNG KERING",
    delta: 1.2,
    highTempWarning: false,
  });
  assert.ok(rig.leds.green.emissiveIntensity > 1.0);
  assert.ok(rig.leds.yellow.emissiveIntensity < 0.2);
  assert.ok(rig.leds.red.emissiveIntensity < 0.2);
  assert.equal(rig.buzzerRings.visible, false);

  applyProbeLiveState(rig, {
    ...DEFAULT_PREVIEW_STATE,
    hardwareClass: "AKTIF/LEMBAP",
    coreTemp: 63.5,
    delta: 32.5,
    highTempWarning: true,
  });
  assert.ok(rig.leds.red.emissiveIntensity > 1.0);
  assert.ok(rig.leds.green.emissiveIntensity < 0.2);
  assert.equal(rig.buzzerRings.visible, true);

  applyProbeLiveState(rig, {
    ...DEFAULT_PREVIEW_STATE,
    coreTemp: Number.NaN,
    delta: Number.POSITIVE_INFINITY,
    hardwareClass: "TIDAK PASTI",
    highTempWarning: false,
  });
  assert.ok(rig.leds.yellow.emissiveIntensity > 1.0);
  assert.ok(Number.isFinite(rig.thermalRingMaterial.emissiveIntensity));

  disposeProbeRig(rig);
});

test("applies deterministic exploded offsets and clean X-Ray restoration without drift", () => {
  const rig = buildGlagahProbe();
  const baseHousing = rig.basePositions.housing.clone();

  applyProbeViewMode(rig, { exploded: 1, xray: true, selectedPart: "esp32" });
  assert.ok(rig.parts.housing.position.distanceTo(baseHousing) > 0.1);
  assert.ok(rig.housingShellMaterials.length > 0);
  for (const mat of rig.housingShellMaterials) {
    assert.equal(mat.transparent, true);
    assert.ok(mat.opacity <= 0.35);
    assert.equal(mat.depthWrite, false);
  }

  // Repeated call with same factor must not drift
  const posAfterFirst = rig.parts.housing.position.clone();
  applyProbeViewMode(rig, { exploded: 1, xray: true, selectedPart: "esp32" });
  assert.equal(rig.parts.housing.position.distanceTo(posAfterFirst), 0);

  // Reset restores exact base position and opaque housing
  applyProbeViewMode(rig, { exploded: 0, xray: false, selectedPart: null });
  assert.equal(rig.parts.housing.position.distanceTo(baseHousing), 0);
  for (const mat of rig.housingShellMaterials) {
    assert.equal(mat.transparent, false);
    assert.equal(mat.opacity, 1);
    assert.equal(mat.depthWrite, true);
  }

  disposeProbeRig(rig);
});
