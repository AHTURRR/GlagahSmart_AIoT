# GlagahSmart 3D Hardware Probe Visualization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive, offline-ready procedural Three.js 3D hardware visualization of the GlagahSmart IoT Handheld Field Insertion Probe with live sensor-state reactivity, Exploded/X-Ray inspection, `.GLB` export, and integration into `/simulation` and `/technology`.

**Architecture:** A pure Three.js procedural assembly engine (`frontend/src/lib/probe3d/`) constructs the 6 numbered hardware sub-assemblies (`housing`, `panel`, `dht22`, `esp32`, `shaft`, `ds18b20`) and exposes deterministic state-mapping and disposal helpers testable directly in Node 24 without a browser. A client-only WebGL canvas component (`GlagahProbe3DCanvas.tsx`) wrapped via `next/dynamic({ ssr: false })` renders the studio scene with OrbitControls, raycast part selection, smooth Exploded/X-Ray transitions, and `GLTFExporter` `.glb` download, then plugs directly into `WokwiCircuitView.tsx` and `technology/page.tsx`.

**Tech Stack:** Next.js 14.2.23 (App Router), React 18.3.1, TypeScript 5.7, Tailwind CSS 3.4, Three.js (`three` + `@types/three`), Node 24 native test runner (`node --test`).

**Spec:** `docs/superpowers/specs/2026-11-24-glagahsmart-3d-probe-design.md`

## Global Constraints

- Follow `DESIGN.md`: warm paper (`#F4F0E8`), botanical ink (`#1E2A21`), forest green (`#24523A`), clay (`#B9673A`), restrained mint (`#6C9A72`), ESD charcoal studio (`#141C16`), sharp 0px architectural borders, quiet purposeful motion only (no neon cyberpunk glow, no auto-rotate spin, no `rounded-2xl`/`rounded-3xl`, no `animate-ping`/`animate-pulse`/`animate-bounce`).
- Run 100% offline with zero external CDN, remote HDRI, or iframe dependencies, complying with strict CSP in `frontend/next.config.mjs`.
- Load Three.js client-side only (`next/dynamic` with `ssr: false`) so SSR and other routes stay fast.
- Hardware parts and pin labels must remain strictly faithful to `simulation/diagram.json` (`ESP32 DevKit-C v4`, `DS18B20` on `GPIO 4`, `R_pull 4.7kΩ`, `DHT22` on `GPIO 15`, `3x LED + 3x R 330Ω` on `GPIO 25/26/27`, `Piezo Buzzer` on `GPIO 14`).
- Cleanly dispose all WebGL geometries, materials, controls, observers, and renderer on unmount, with graceful fallback notice if WebGL is unavailable.

## Review Focus

- **WebGL unavailable or initialization failure:** `GlagahProbe3DCanvas` catches context creation failure and shows a calm fallback panel directing users to the 2D `Skematik` tab instead of crashing.
- **Invalid or extreme live sensor values (`NaN`, `Infinity`, extreme temperatures):** `applyProbeLiveState` guards non-finite numbers and maps thermal/LED states safely without producing `NaN` colors or throwing.
- **Repeated tab switching (`Model 3D Alat` ↔ `Skematik` ↔ `Pinout & BOM`):** Mounting and unmounting cleans up `requestAnimationFrame`, `ResizeObserver`, event listeners, `OrbitControls`, geometries, materials, and `WebGLRenderer` to prevent WebGL context leaks.
- **Repeated `Exploded View` / `X-Ray` toggles without positional or alpha drift:** `applyProbeViewMode` computes every sub-assembly position deterministically from immutable `basePosition + explodedOffset * clamp(exploded, 0, 1)` and cleanly restores `opacity: 1, transparent: false, depthWrite: true` on `housing` when X-Ray turns off.
- **`.GLB` export integrity:** `exportProbeToGlbBlob` resets temporary explosion/X-Ray state before serializing (or exports a clean assembled snapshot) and resolves a binary `Blob` beginning with valid glTF 2.0 magic bytes (`glTF`), restoring viewer state cleanly afterward.

---

### Task 1: Install Three.js Dependencies & Define Hardware 3D Spec Registry

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/src/lib/probe3d/probeSpecs.ts`
- Test: `frontend/src/lib/probe3d/probeSpecs.test.ts`

**Interfaces:**
- Produces in `frontend/src/lib/probe3d/probeSpecs.ts`:
  - `export type ProbePartId = "housing" | "panel" | "dht22" | "esp32" | "shaft" | "ds18b20";`
  - `export type CameraPresetId = "full" | "head" | "internal" | "tip";`
  - `export interface ProbePartSpec { id: ProbePartId; index: string; label: string; category: string; espPins: string; materialNote: string; description: string; explodedOffset: [number, number, number]; }`
  - `export interface CameraPresetSpec { id: CameraPresetId; label: string; position: [number, number, number]; target: [number, number, number]; }`
  - `export interface ProbeLiveVisualState { coreTemp: number; ambientTemp: number; ambientHum: number; delta: number; score: number; hardwareClass: "CENDERUNG KERING" | "TIDAK PASTI" | "AKTIF/LEMBAP"; recommendation: string; highTempWarning: boolean; }`
  - `export const PROBE_PART_ORDER: readonly ProbePartId[];`
  - `export const PROBE_PART_SPECS: Record<ProbePartId, ProbePartSpec>;`
  - `export const CAMERA_PRESETS: readonly CameraPresetSpec[];`
  - `export const DEFAULT_PREVIEW_STATE: ProbeLiveVisualState;`

- [ ] **Step 1: Install `three` and `@types/three` in `frontend/`**

Run: `Set-Location frontend; npm install three; npm install -D @types/three tsx`
Expected: `three` appears in `frontend/package.json` `dependencies`, `@types/three` and `tsx` in `devDependencies`, with exit code 0.

- [ ] **Step 2: Write the failing spec registry test**

Create `frontend/src/lib/probe3d/probeSpecs.test.ts`:
```ts
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
```

- [ ] **Step 3: Run test to verify it fails**

Run: `Set-Location frontend; npx tsx --test src/lib/probe3d/probeSpecs.test.ts`
Expected: FAIL with module not found (`probeSpecs.ts`).

- [ ] **Step 4: Implement `frontend/src/lib/probe3d/probeSpecs.ts`**

Create `frontend/src/lib/probe3d/probeSpecs.ts` implementing all exported types and constants above with exact Indonesian copy aligned to `simulation/diagram.json` and the spec's 6 assemblies (`housing`, `panel`, `dht22`, `esp32`, `shaft`, `ds18b20`) and 4 camera presets (`full`, `head`, `internal`, `tip`).

- [ ] **Step 5: Run test to verify it passes**

Run: `Set-Location frontend; npx tsx --test src/lib/probe3d/probeSpecs.test.ts`
Expected: PASS (2/2 tests passing).

- [ ] **Step 6: Commit**

```powershell
git add frontend/package.json frontend/package-lock.json frontend/src/lib/probe3d/probeSpecs.ts frontend/src/lib/probe3d/probeSpecs.test.ts
git commit -m "feat(3d): add Three.js dependency and GlagahSmart probe 3D spec registry"
```

---

### Task 2: Build Procedural Three.js Hardware Assembly & Live State Engine

**Files:**
- Create: `frontend/src/lib/probe3d/buildGlagahProbe.ts`
- Test: `frontend/src/lib/probe3d/buildGlagahProbe.test.ts`

**Interfaces:**
- Consumes from Task 1 (`./probeSpecs`): `ProbePartId`, `PROBE_PART_ORDER`, `PROBE_PART_SPECS`, `ProbeLiveVisualState`.
- Produces in `frontend/src/lib/probe3d/buildGlagahProbe.ts`:
  - `export interface GlagahProbeRig { root: THREE.Group; parts: Record<ProbePartId, THREE.Group>; basePositions: Record<ProbePartId, THREE.Vector3>; housingShellMaterials: THREE.MeshStandardMaterial[]; leds: { green: THREE.MeshStandardMaterial; yellow: THREE.MeshStandardMaterial; red: THREE.MeshStandardMaterial; }; buzzerRings: THREE.Group; thermalRingMaterial: THREE.MeshStandardMaterial; }`
  - `export function buildGlagahProbe(): GlagahProbeRig`
  - `export function applyProbeLiveState(rig: GlagahProbeRig, state: ProbeLiveVisualState): void`
  - `export function applyProbeViewMode(rig: GlagahProbeRig, opts: { exploded: number; xray: boolean; selectedPart: ProbePartId | null }): void`
  - `export function disposeProbeRig(rig: GlagahProbeRig): void`

- [ ] **Step 1: Write the failing procedural assembly & state tests**

Create `frontend/src/lib/probe3d/buildGlagahProbe.test.ts`:
```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `Set-Location frontend; npx tsx --test src/lib/probe3d/buildGlagahProbe.test.ts`
Expected: FAIL with module not found (`buildGlagahProbe.ts`).

- [ ] **Step 3: Implement `frontend/src/lib/probe3d/buildGlagahProbe.ts`**

Build the complete procedural Handheld Field Insertion Probe with authentic industrial proportions centered around origin `(0, 0, 0)` (total height ~`5.6` units, head centered near `y = +1.45`, stainless spear extending down to `y = -2.75` with pointed DS18B20 tip):
- `housing`: matte forest-olive `#24523A` upper enclosure body (`roughness: 0.68`, `metalness: 0.08`) + charcoal `#1E2A21` lower shell & textured ergonomic side grip bands + 4 stainless corner hex bolts + bottom rubber-gasketed USB-C port. Collect outer casing materials into `housingShellMaterials` for clean X-Ray control.
- `panel`: angled dark anodized bezel (`#18201A`) mounted on the tilted upper-front operator face, housing 3 recessed cylindrical LED lenses (`green #46B871`, `yellow #E0AE3B`, `red #DC5548` with emissive control) + perforated circular acoustic piezo buzzer grille (`GPIO 14`) + subtle concentric terracotta warning rings (`buzzerRings`, hidden unless `highTempWarning`).
- `dht22`: louvered protective side hood (`#24523A` / `#1E2A21`) with horizontal dust-deflecting slats on the right flank + crisp off-white `#F4F0E8` DHT22 module with perforated grille mounted inside.
- `esp32`: nestled inside the head cavity — matte dark PCB (`#19261D`), brushed metallic `ESP-WROOM-32` RF shield (`#B8C0B6`, `metalness: 0.72`, `roughness: 0.34`), gold PCB Wi-Fi trace antenna (`#C99A3B`), twin 19-pin headers, CP2102 IC, micro-USB socket, plus color-coded `4.7kΩ` pull-up resistor and `3× 330Ω` axial resistors on brass standoffs.
- `shaft`: stainless knurled `cable gland` collar (`#9EA69F`, `metalness: 0.8`, `roughness: 0.3`) + brushed stainless insertion tube with 3 engraved depth marker rings (10, 20, 30 cm).
- `ds18b20`: stainless waterproof capsule sleeve (`#C4CCC5`, `metalness: 0.85`, `roughness: 0.25`) tapering to a pointed conical insertion spear tip + subtle flush thermal indicator ring (`thermalRingMaterial`) that shifts smoothly between mint `#6C9A72` (stable), clay `#B9673A` (`ΔT ≥ 5°C`), and coral-red `#DC5548` (`highTempWarning`).
- Stamp every `Group` and child `Mesh` with `userData.partId = id` so raycasting immediately resolves the owning sub-assembly.
- Implement `applyProbeLiveState`, `applyProbeViewMode` (clamping `exploded` to `[0, 1]`, applying subtle emissive highlight boost on `selectedPart` without mutating base colors permanently), and `disposeProbeRig` (traversing `root` to dispose all geometries and materials).

- [ ] **Step 4: Run tests to verify they pass**

Run: `Set-Location frontend; npx tsx --test src/lib/probe3d/probeSpecs.test.ts src/lib/probe3d/buildGlagahProbe.test.ts`
Expected: PASS (all tests green).

- [ ] **Step 5: Commit**

```powershell
git add frontend/src/lib/probe3d/buildGlagahProbe.ts frontend/src/lib/probe3d/buildGlagahProbe.test.ts
git commit -m "feat(3d): build procedural Three.js GlagahSmart insertion probe assembly"
```

---

### Task 3: Add `.GLB` Exporter & Client-Only Interactive 3D Viewport Component

**Files:**
- Create: `frontend/src/lib/probe3d/exportProbeGlb.ts`
- Create: `frontend/src/components/simulation/GlagahProbe3DCanvas.tsx`
- Create: `frontend/src/components/simulation/GlagahProbe3DView.tsx`

**Interfaces:**
- Consumes from Tasks 1–2: `buildGlagahProbe`, `applyProbeLiveState`, `applyProbeViewMode`, `disposeProbeRig`, `PROBE_PART_ORDER`, `PROBE_PART_SPECS`, `CAMERA_PRESETS`, `DEFAULT_PREVIEW_STATE`, `ProbePartId`, `CameraPresetId`, `ProbeLiveVisualState`.
- Produces in `frontend/src/lib/probe3d/exportProbeGlb.ts`:
  - `export function exportProbeToGlbBlob(rig: GlagahProbeRig, currentView: { exploded: number; xray: boolean; selectedPart: ProbePartId | null }): Promise<Blob>` — temporarily resets the rig to assembled opaque state (`exploded: 0, xray: false, selectedPart: null`), serializes `rig.root` with Three.js `GLTFExporter` (`{ binary: true }`), restores `currentView` in a `finally` block, and resolves `new Blob([arrayBuffer], { type: "model/gltf-binary" })`.
  - `export function downloadGlbBlob(blob: Blob, filename?: string): void`
- Produces in `frontend/src/components/simulation/GlagahProbe3DView.tsx`:
  - `export interface GlagahProbe3DViewProps { liveState?: ProbeLiveVisualState; compact?: boolean; }`
  - `export default function GlagahProbe3DView(props: GlagahProbe3DViewProps): JSX.Element` — dynamically imports `GlagahProbe3DCanvas` with `ssr: false`.

- [ ] **Step 1: Implement `frontend/src/lib/probe3d/exportProbeGlb.ts`**

Use `GLTFExporter` from `three/examples/jsm/exporters/GLTFExporter.js`. Ensure `applyProbeViewMode` resets to assembled opaque state before `parseAsync` (or callback `parse`) and always restores the caller's `currentView` inside `finally`. Trigger browser download via temporary `URL.createObjectURL(blob)` + anchor click + `URL.revokeObjectURL` cleanup with default filename `glagahsmart-iot-probe.glb`.

- [ ] **Step 2: Implement `frontend/src/components/simulation/GlagahProbe3DCanvas.tsx`**

Build the interactive anti-slop studio viewport matching `WokwiCircuitView.tsx` and `DESIGN.md`:
- **Top control strip** (`bg-[#17211A] border-b border-agri-bg/10`):
  - Left: Component inspection buttons (`Casing`, `Panel LED`, `DHT22`, `ESP32`, `Batang`, `DS18B20` + `Reset` when active) synced with 3D raycast clicks.
  - Right: View toggles (**`Bongkar Lapis`** / Exploded View, **`X-Ray`** casing transparan), camera preset buttons (`Utuh`, `Kepala`, `Internal`, `Ujung`), and **`Unduh .GLB`** button with quiet exporting feedback.
- **WebGL Studio Canvas** (`bg-[#141C16]`, height `500px` normal / `440px` compact):
  - Studio 3-point lighting: soft warm-paper key `DirectionalLight` (`#FAF6EE`, intensity `2.2`), cool botanical rim light (`#9CC3A4`, intensity `0.9`), ambient `HemisphereLight` (`#F4F0E8` / `#1B261E`, intensity `1.1`) + subtle circular lab-mat ground disc (`#18221B`) with fine radial reference rings underneath the probe tip.
  - `OrbitControls` with smooth damping (`enableDamping = true`, `dampingFactor = 0.08`, no auto-rotate!).
  - Smooth `requestAnimationFrame` lerping toward target `exploded` (`0` or `1`) and active camera preset (`position` + `target`, pausing camera lerp immediately when the user starts dragging via OrbitControls `start` event so user control is never fought!).
  - Pointer click detection (distinguishing click from orbit drag via `< 5px` pointer movement threshold) using `THREE.Raycaster` to select/toggle `userData.partId`.
  - Compact corner telemetry HUD overlay (sharp 0px dark-ink hairline stamp, bottom-left): live `T_tumpuk`, `T_udara`, `RH`, `ΔT`, and active LED dots — zero neon badges.
  - Graceful fallback UI if `WebGLRenderer` fails to initialize (shows calm message + guidance to use the 2D `Skematik` tab).
  - Complete cleanup on unmount: cancel animation frame, disconnect `ResizeObserver`, remove pointer listeners, dispose `OrbitControls`, call `disposeProbeRig`, call `renderer.dispose()`.
- **Warm-paper Datasheet Drawer** below canvas (`bg-[#FBF9F4] border-t border-agri-ink/20`):
  - Shows selected part's index, category, Indonesian title, pin connection badge, material note, and field description — matching `WokwiCircuitView`'s schematic datasheet drawer.

- [ ] **Step 3: Implement `frontend/src/components/simulation/GlagahProbe3DView.tsx`**

Wrap `GlagahProbe3DCanvas` using `next/dynamic(() => import("./GlagahProbe3DCanvas"), { ssr: false, loading: ... })` with a calm architectural loading frame (`bg-[#141C16]` + mono text `Menyiapkan model 3D perangkat GlagahSmart...`).

- [ ] **Step 4: Run TypeScript type check**

Run: `Set-Location frontend; npx tsc --noEmit`
Expected: Exit code 0 with 0 errors.

- [ ] **Step 5: Commit**

```powershell
git add frontend/src/lib/probe3d/exportProbeGlb.ts frontend/src/components/simulation/GlagahProbe3DCanvas.tsx frontend/src/components/simulation/GlagahProbe3DView.tsx
git commit -m "feat(3d): add interactive WebGL 3D probe viewer and GLB exporter"
```

---

### Task 4: Integrate 3D Device Viewer into `/simulation` and `/technology` & Verify End-to-End

**Files:**
- Modify: `frontend/src/components/simulation/WokwiCircuitView.tsx`
- Modify: `frontend/src/app/technology/page.tsx`

**Interfaces:**
- Consumes from Task 3: `GlagahProbe3DView` (`liveState?: ProbeLiveVisualState; compact?: boolean`).
- Preserves existing `WokwiCircuitView` exported prop interface `{ liveState: WokwiLiveState }`.

- [ ] **Step 1: Add `Model 3D Alat` tab to `WokwiCircuitView.tsx`**

Update `activeTab` state type to `"model3d" | "schematic" | "live" | "pinout"` (defaulting to `"model3d"` so visitors opening `/simulation` immediately see the interactive 3D hardware probe reacting live to the sliders and presets, with `Skematik`, `Simulator Wokwi`, and `Pinout & BOM` one click away). Pass `liveState` into `<GlagahProbe3DView liveState={liveState} />` and keep the bottom Serial Monitor & MQTT Log strip synced beneath both `"model3d"` and `"schematic"` views.

- [ ] **Step 2: Add 3D hardware inspection section to `frontend/src/app/technology/page.tsx`**

Add a crisp field-dossier section **"Wujud Fisik Perangkat (Model 3D Interaktif)"** between the 5-stage End-to-End Pipeline and the 4 Subsystem Specifications, rendering `<GlagahProbe3DView compact />` inside a sharp `border border-agri-ink/25` frame with a header link to `/simulation` ("Uji respon LED & sensor secara live →").

- [ ] **Step 3: Run full verification suite (unit tests + TypeScript + anti-slop scan + Next.js production build check)**

Run:
```powershell
Set-Location frontend; npx tsx --test src/lib/probe3d/probeSpecs.test.ts src/lib/probe3d/buildGlagahProbe.test.ts; npx tsc --noEmit; npm run build
```
Expected:
- All Node unit tests PASS.
- `npx tsc --noEmit` exits 0 with 0 errors.
- `npm run build` exits 0 and compiles `/simulation` and `/technology` cleanly with zero SSR errors from Three.js.

- [ ] **Step 4: Verify live dev server serves `/simulation` and `/technology` with HTTP 200**

Start/verify dev server on `http://localhost:3000` and verify `/simulation` and `/technology` respond `200 OK` with zero console/server errors.

- [ ] **Step 5: Commit**

```powershell
git add frontend/src/components/simulation/WokwiCircuitView.tsx frontend/src/app/technology/page.tsx
git commit -m "feat(3d): integrate interactive 3D GlagahSmart probe into simulation and technology pages"
```
