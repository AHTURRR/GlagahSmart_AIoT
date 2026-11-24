import test from "node:test";
import assert from "node:assert/strict";
import { buildGlagahProbe, applyProbeViewMode, disposeProbeRig } from "./buildGlagahProbe";
import { exportProbeToGlbBlob } from "./exportProbeGlb";

// Node 24 ships standard Blob.arrayBuffer() but not DOM FileReader required by Three's GLTFExporter.
if (typeof globalThis.FileReader === "undefined") {
  class NodeFileReader {
    result: ArrayBuffer | null = null;
    onloadend: (() => void) | null = null;
    readAsArrayBuffer(blob: Blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        this.onloadend?.();
      });
    }
  }
  (globalThis as unknown as { FileReader: unknown }).FileReader = NodeFileReader;
}

test("exports assembled binary glTF 2.0 (.glb) and restores viewer state afterward", async () => {
  const rig = buildGlagahProbe();
  const activeView = { exploded: 1, xray: true, selectedPart: "esp32" as const };
  applyProbeViewMode(rig, activeView);
  const explodedHousingPos = rig.parts.housing.position.clone();

  const blob = await exportProbeToGlbBlob(rig, activeView);
  assert.equal(blob.type, "model/gltf-binary");
  assert.ok(blob.size > 1000, "GLB binary payload should be non-trivial");

  const buffer = await blob.arrayBuffer();
  const magic = new TextDecoder().decode(new Uint8Array(buffer, 0, 4));
  assert.equal(magic, "glTF");

  // Caller view state must be faithfully restored
  assert.equal(rig.parts.housing.position.distanceTo(explodedHousingPos), 0);
  for (const mat of rig.housingShellMaterials) {
    assert.equal(mat.transparent, true);
    assert.ok(mat.opacity <= 0.35);
  }

  disposeProbeRig(rig);
});

test("exportProbeToGlbBlob restores latest view state via resolver callback", async () => {
  const rig = buildGlagahProbe();
  let liveView: { exploded: number; xray: boolean; selectedPart: "esp32" | "ds18b20" | null } = {
    exploded: 0,
    xray: false,
    selectedPart: null,
  };
  applyProbeViewMode(rig, liveView);

  const promise = exportProbeToGlbBlob(rig, () => liveView);
  // Simulate latest view updating before export completes
  liveView = { exploded: 1, xray: true, selectedPart: "ds18b20" };

  const blob = await promise;
  assert.ok(blob.size > 1000);
  assert.ok(
    rig.parts.housing.position.distanceTo(rig.basePositions.housing) > 0.1
  );
  for (const mat of rig.housingShellMaterials) {
    assert.equal(mat.transparent, true);
    assert.ok(mat.opacity <= 0.35);
  }

  disposeProbeRig(rig);
});
