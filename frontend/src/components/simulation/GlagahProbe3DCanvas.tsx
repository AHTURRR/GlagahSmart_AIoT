"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Download, Eye, Layers, RotateCcw } from "lucide-react";
import {
  buildGlagahProbe,
  applyProbeLiveState,
  applyProbeViewMode,
  disposeProbeRig,
  GlagahProbeRig,
} from "@/lib/probe3d/buildGlagahProbe";
import {
  exportProbeToGlbBlob,
  downloadGlbBlob,
} from "@/lib/probe3d/exportProbeGlb";
import {
  CAMERA_PRESETS,
  CameraPresetId,
  DEFAULT_PREVIEW_STATE,
  PROBE_PART_ORDER,
  PROBE_PART_SPECS,
  ProbeLiveVisualState,
  ProbePartId,
} from "@/lib/probe3d/probeSpecs";

export interface GlagahProbe3DCanvasProps {
  liveState?: ProbeLiveVisualState;
  compact?: boolean;
}

export default function GlagahProbe3DCanvas({
  liveState = DEFAULT_PREVIEW_STATE,
  compact = false,
}: GlagahProbe3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rigRef = useRef<GlagahProbeRig | null>(null);

  const [selectedPart, setSelectedPart] = useState<ProbePartId | null>(null);
  const [exploded, setExploded] = useState(false);
  const [xray, setXray] = useState(false);
  const [activePreset, setActivePreset] = useState<CameraPresetId>("full");
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [webglError, setWebglError] = useState<string | null>(null);

  // Refs synced into the rAF loop without recreating the WebGL context
  const liveStateRef = useRef<ProbeLiveVisualState>(liveState);
  const targetExplodedRef = useRef<number>(0);
  const currentExplodedRef = useRef<number>(0);
  const xrayRef = useRef<boolean>(false);
  const selectedPartRef = useRef<ProbePartId | null>(null);
  const cameraGoalRef = useRef<{
    pos: THREE.Vector3;
    target: THREE.Vector3;
  } | null>(null);

  useEffect(() => {
    liveStateRef.current = liveState;
    if (rigRef.current) {
      applyProbeLiveState(rigRef.current, liveState);
    }
  }, [liveState]);

  useEffect(() => {
    targetExplodedRef.current = exploded ? 1 : 0;
  }, [exploded]);

  useEffect(() => {
    xrayRef.current = xray;
    if (rigRef.current) {
      applyProbeViewMode(rigRef.current, {
        exploded: currentExplodedRef.current,
        xray,
        selectedPart: selectedPartRef.current,
      });
    }
  }, [xray]);

  useEffect(() => {
    selectedPartRef.current = selectedPart;
    if (rigRef.current) {
      applyProbeViewMode(rigRef.current, {
        exploded: currentExplodedRef.current,
        xray: xrayRef.current,
        selectedPart,
      });
    }
  }, [selectedPart]);

  const handleSelectCameraPreset = (presetId: CameraPresetId) => {
    setActivePreset(presetId);
    const preset = CAMERA_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    cameraGoalRef.current = {
      pos: new THREE.Vector3(...preset.position),
      target: new THREE.Vector3(...preset.target),
    };
    if (presetId === "internal" && !xray && !exploded) {
      setXray(true);
    }
  };

  const handleResetView = () => {
    setSelectedPart(null);
    setExploded(false);
    setXray(false);
    handleSelectCameraPreset("full");
  };

  const handleExportGlb = async () => {
    if (!rigRef.current || exporting) return;
    setExporting(true);
    setExportMessage(null);
    try {
      const blob = await exportProbeToGlbBlob(rigRef.current, {
        exploded: currentExplodedRef.current,
        xray: xrayRef.current,
        selectedPart: selectedPartRef.current,
      });
      downloadGlbBlob(blob, "glagahsmart-iot-probe.glb");
      setExportMessage("glagahsmart-iot-probe.glb berhasil diunduh.");
      setTimeout(() => setExportMessage(null), 3500);
    } catch {
      setExportMessage("Gagal mengekspor berkas .GLB pada browser ini.");
      setTimeout(() => setExportMessage(null), 4000);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
    } catch {
      setWebglError(
        "WebGL tidak tersedia pada perangkat atau browser ini. Gunakan tab Skematik (2D) untuk inspeksi rangkaian."
      );
      return;
    }

    const width = Math.max(container.clientWidth, 300);
    const height = Math.max(container.clientHeight, 320);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Forest-charcoal lab studio scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x141c16);

    const initialPreset = CAMERA_PRESETS[0];
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 60);
    camera.position.set(...initialPreset.position);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = true;
    controls.minDistance = 2.1;
    controls.maxDistance = 10.5;
    controls.target.set(...initialPreset.target);
    controls.update();

    const handleUserOrbitStart = () => {
      cameraGoalRef.current = null;
    };
    controls.addEventListener("start", handleUserOrbitStart);

    // Calm 3-point matte materials-lab lighting
    const hemiLight = new THREE.HemisphereLight(0xf4f0e8, 0x1b261e, 1.15);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfaf6ee, 2.25);
    keyLight.position.set(4.5, 6.2, 5.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x9bc4a3, 0.95);
    rimLight.position.set(-4.8, 2.8, -3.5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xebc9a8, 0.55);
    fillLight.position.set(2.2, -2.5, 3.8);
    scene.add(fillLight);

    // Minimal circular drafting reference pad beneath probe tip
    const stageGroup = new THREE.Group();
    stageGroup.position.set(0, -2.74, -0.02);

    const padGeom = new THREE.CircleGeometry(1.75, 48);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x18221b,
      roughness: 0.92,
      metalness: 0.04,
    });
    const padMesh = new THREE.Mesh(padGeom, padMat);
    padMesh.rotation.x = -Math.PI / 2;
    padMesh.receiveShadow = true;
    stageGroup.add(padMesh);

    const stageRingGeoms: THREE.BufferGeometry[] = [];
    const stageRingMat = new THREE.MeshBasicMaterial({
      color: 0x2f4135,
      transparent: true,
      opacity: 0.75,
    });
    for (const r of [0.55, 1.15, 1.72]) {
      const rg = new THREE.RingGeometry(r - 0.008, r, 64);
      stageRingGeoms.push(rg);
      const rm = new THREE.Mesh(rg, stageRingMat);
      rm.rotation.x = -Math.PI / 2;
      rm.position.y = 0.003;
      stageGroup.add(rm);
    }
    scene.add(stageGroup);

    // Build GlagahSmart procedural 3D probe
    const rig = buildGlagahProbe();
    rigRef.current = rig;
    applyProbeLiveState(rig, liveStateRef.current);
    applyProbeViewMode(rig, {
      exploded: currentExplodedRef.current,
      xray: xrayRef.current,
      selectedPart: selectedPartRef.current,
    });
    scene.add(rig.root);

    // Raycast click-to-inspect (distinguished from orbit drag)
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownX = 0;
    let pointerDownY = 0;

    const onPointerDown = (ev: PointerEvent) => {
      pointerDownX = ev.clientX;
      pointerDownY = ev.clientY;
    };

    const onPointerUp = (ev: PointerEvent) => {
      const dx = ev.clientX - pointerDownX;
      const dy = ev.clientY - pointerDownY;
      if (Math.hypot(dx, dy) > 5) return;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(rig.root.children, true);
      const hitPart = hits.find(
        (h) => typeof h.object.userData?.partId === "string"
      )?.object.userData.partId as ProbePartId | undefined;

      if (hitPart) {
        setSelectedPart((prev) => (prev === hitPart ? null : hitPart));
      }
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    // Responsive ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const nextW = Math.max(container.clientWidth, 300);
      const nextH = Math.max(container.clientHeight, 320);
      camera.aspect = nextW / nextH;
      camera.updateProjectionMatrix();
      renderer.setSize(nextW, nextH);
    });
    resizeObserver.observe(container);

    // Smooth quiet animation loop (lerp exploded factor & camera presets only)
    let rafId = 0;
    const animate = () => {
      rafId = window.requestAnimationFrame(animate);

      const diffExploded =
        targetExplodedRef.current - currentExplodedRef.current;
      if (Math.abs(diffExploded) > 0.002) {
        currentExplodedRef.current += diffExploded * 0.12;
        if (Math.abs(targetExplodedRef.current - currentExplodedRef.current) <= 0.002) {
          currentExplodedRef.current = targetExplodedRef.current;
        }
        applyProbeViewMode(rig, {
          exploded: currentExplodedRef.current,
          xray: xrayRef.current,
          selectedPart: selectedPartRef.current,
        });
      }

      if (cameraGoalRef.current) {
        camera.position.lerp(cameraGoalRef.current.pos, 0.1);
        controls.target.lerp(cameraGoalRef.current.target, 0.1);
        if (
          camera.position.distanceTo(cameraGoalRef.current.pos) < 0.02 &&
          controls.target.distanceTo(cameraGoalRef.current.target) < 0.02
        ) {
          camera.position.copy(cameraGoalRef.current.pos);
          controls.target.copy(cameraGoalRef.current.target);
          cameraGoalRef.current = null;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      controls.removeEventListener("start", handleUserOrbitStart);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      controls.dispose();
      disposeProbeRig(rig);
      rigRef.current = null;
      padGeom.dispose();
      padMat.dispose();
      stageRingGeoms.forEach((g) => g.dispose());
      stageRingMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const selectedSpec = selectedPart ? PROBE_PART_SPECS[selectedPart] : null;
  const isGreenOn = liveState.hardwareClass === "CENDERUNG KERING";
  const isYellowOn = liveState.hardwareClass === "TIDAK PASTI";
  const isRedOn = liveState.hardwareClass === "AKTIF/LEMBAP";

  return (
    <div>
      {/* Top 3D Workbench Controls Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-agri-bg/10 bg-[#17211A] px-4 py-3 text-xs text-agri-bg sm:px-6">
        {/* Part inspection chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.12em] text-agri-bg/55">
            Bagian:
          </span>
          {PROBE_PART_ORDER.map((id) => {
            const spec = PROBE_PART_SPECS[id];
            const active = selectedPart === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedPart(active ? null : id)}
                className={`border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  active
                    ? "border-agri-emeraldLight bg-agri-primary text-white"
                    : "border-agri-bg/20 bg-transparent text-agri-bg/75 hover:border-agri-bg/45 hover:text-white"
                }`}
              >
                {spec.shortLabel}
              </button>
            );
          })}
          {(selectedPart || exploded || xray || activePreset !== "full") && (
            <button
              type="button"
              onClick={handleResetView}
              className="inline-flex items-center gap-1 px-2 py-1 font-mono text-[11px] text-agri-amberLight hover:text-white"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Exploded / X-Ray / Camera Presets / Export GLB */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-pressed={exploded}
            onClick={() => setExploded((v) => !v)}
            className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[11px] transition-colors ${
              exploded
                ? "border-agri-amberLight bg-agri-clay text-white"
                : "border-agri-bg/25 bg-transparent text-agri-bg/85 hover:border-agri-bg/50"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Bongkar lapis</span>
          </button>

          <button
            type="button"
            aria-pressed={xray}
            onClick={() => setXray((v) => !v)}
            className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[11px] transition-colors ${
              xray
                ? "border-agri-emeraldLight bg-agri-primary text-white"
                : "border-agri-bg/25 bg-transparent text-agri-bg/85 hover:border-agri-bg/50"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>X-Ray</span>
          </button>

          <div className="inline-flex border border-agri-bg/20 divide-x divide-agri-bg/20">
            {CAMERA_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectCameraPreset(preset.id)}
                className={`px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  activePreset === preset.id
                    ? "bg-agri-bg text-agri-ink font-semibold"
                    : "text-agri-bg/75 hover:bg-agri-bg/10 hover:text-white"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportGlb}
            disabled={exporting || Boolean(webglError)}
            className="inline-flex items-center gap-1.5 border border-agri-bg/35 bg-agri-bg px-2.5 py-1 font-mono text-[11px] font-bold text-agri-ink transition-colors hover:bg-white disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{exporting ? "Mengekspor..." : "Unduh .GLB"}</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Studio Viewport */}
      <div className="relative bg-[#141C16]">
        {webglError ? (
          <div className="flex min-h-[380px] flex-col items-center justify-center gap-3 px-6 py-12 text-center text-agri-bg">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-agri-amberLight">
              WebGL tidak tersedia
            </p>
            <p className="max-w-md text-sm leading-6 text-agri-bg/75">
              {webglError}
            </p>
          </div>
        ) : (
          <>
            <div
              ref={containerRef}
              className={`w-full cursor-grab active:cursor-grabbing ${
                compact ? "h-[430px] sm:h-[460px]" : "h-[460px] sm:h-[520px]"
              }`}
              role="img"
              aria-label="Model 3D interaktif perangkat keras Probe Pemantau Limbah Glagah ESP32"
            />

            {/* Quiet Bottom-Left Live Hardware HUD Stamp */}
            <div className="pointer-events-none absolute bottom-3 left-3 border border-agri-bg/15 bg-[#101712]/90 px-3 py-2 font-mono text-[11px] text-agri-bg sm:bottom-4 sm:left-4">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center gap-1.5" aria-hidden="true">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isGreenOn ? "bg-[#4AC276]" : "bg-[#24382A]"
                    }`}
                  />
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isYellowOn ? "bg-[#E2B245]" : "bg-[#3C341E]"
                    }`}
                  />
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isRedOn ? "bg-[#DE5B4E]" : "bg-[#3E2421]"
                    }`}
                  />
                </span>
                <span className="text-agri-bg/90">
                  {liveState.hardwareClass}
                </span>
                {liveState.highTempWarning && (
                  <span className="text-[#E89B7C]">· ALARM ≥60°C</span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap gap-x-3 text-[10px] text-agri-bg/65 tabular-nums">
                <span>T_inti {liveState.coreTemp.toFixed(1)}°C</span>
                <span>T_udara {liveState.ambientTemp.toFixed(1)}°C</span>
                <span>RH {Math.round(liveState.ambientHum)}%</span>
                <span>
                  ΔT {liveState.delta >= 0 ? "+" : ""}
                  {liveState.delta.toFixed(1)}°C
                </span>
              </div>
            </div>

            {/* Quiet Bottom-Right Navigation Hint */}
            <div className="pointer-events-none absolute bottom-3 right-3 hidden border border-agri-bg/15 bg-[#101712]/85 px-2.5 py-1.5 font-mono text-[10px] text-agri-bg/65 sm:block sm:bottom-4 sm:right-4">
              Seret putar · Gulir zoom · Klik komponen
            </div>

            {exportMessage && (
              <div className="absolute right-3 top-3 border border-agri-emeraldLight/50 bg-[#121914]/95 px-3 py-1.5 font-mono text-[11px] text-agri-emeraldLight sm:right-4 sm:top-4">
                {exportMessage}
              </div>
            )}
          </>
        )}
      </div>

      {/* Warm-Paper Datasheet Inspector Drawer */}
      <div className="border-t border-agri-ink/20 bg-[#FBF9F4] px-5 py-4 sm:px-6">
        {selectedSpec ? (
          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-agri-clay">
                  {selectedSpec.index} · {selectedSpec.category}
                </span>
                <span className="border border-agri-primary/20 bg-agri-bg px-2.5 py-0.5 font-mono text-[11px] font-semibold text-agri-primary">
                  {selectedSpec.espPins}
                </span>
              </div>
              <h3 className="display-serif text-2xl leading-tight text-agri-ink">
                {selectedSpec.label}
              </h3>
              <p className="text-xs leading-6 text-agri-muted sm:text-sm">
                {selectedSpec.description}
              </p>
            </div>

            <div className="flex flex-col justify-between gap-2 border-t border-agri-primary/15 pt-3 text-xs lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
              <div>
                <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-agri-muted">
                  Material &amp; konstruksi target
                </span>
                <strong className="mt-0.5 block text-agri-ink">
                  {selectedSpec.materialNote}
                </strong>
              </div>
              <p className="font-mono text-[11px] text-agri-primary">
                Tip: aktifkan <strong>Bongkar lapis</strong> atau{" "}
                <strong>X-Ray</strong> untuk melihat posisi ESP32 &amp; resistor
                di dalam kepala probe.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs leading-6 text-agri-muted">
            Putar dan perbesar model 3D{" "}
            <strong className="text-agri-ink">
              Handheld Field Insertion Probe
            </strong>{" "}
            di atas, klik bagian fisik alat untuk membaca spesifikasinya, atau
            aktifkan <strong className="text-agri-ink">Bongkar lapis</strong>{" "}
            dan <strong className="text-agri-ink">X-Ray</strong> untuk mengintip
            susunan ESP32 di dalam casing. Gunakan{" "}
            <strong className="text-agri-ink">Unduh .GLB</strong> untuk membuka
            model ini di Blender atau PowerPoint.
          </p>
        )}
      </div>
    </div>
  );
}
