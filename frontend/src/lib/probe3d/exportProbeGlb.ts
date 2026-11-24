import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { GlagahProbeRig, applyProbeViewMode } from "./buildGlagahProbe";
import { ProbePartId } from "./probeSpecs";

export interface ProbeViewSnapshot {
  exploded: number;
  xray: boolean;
  selectedPart: ProbePartId | null;
}

export async function exportProbeToGlbBlob(
  rig: GlagahProbeRig,
  currentView: ProbeViewSnapshot
): Promise<Blob> {
  const exporter = new GLTFExporter();

  // Export clean assembled, opaque hardware without transient highlight/explosion
  applyProbeViewMode(rig, { exploded: 0, xray: false, selectedPart: null });
  rig.root.updateMatrixWorld(true);

  try {
    const result = await new Promise<ArrayBuffer>((resolve, reject) => {
      exporter.parse(
        rig.root,
        (output) => {
          if (output instanceof ArrayBuffer) {
            resolve(output);
          } else {
            reject(new Error("GLTFExporter did not return binary ArrayBuffer"));
          }
        },
        (error) => {
          reject(
            error instanceof Error
              ? error
              : new Error("Failed to serialize 3D probe to GLB")
          );
        },
        { binary: true }
      );
    });

    return new Blob([result], { type: "model/gltf-binary" });
  } finally {
    applyProbeViewMode(rig, currentView);
    rig.root.updateMatrixWorld(true);
  }
}

export function downloadGlbBlob(
  blob: Blob,
  filename = "glagahsmart-iot-probe.glb"
): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
