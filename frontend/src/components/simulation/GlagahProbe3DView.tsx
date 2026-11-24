"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { GlagahProbe3DCanvasProps } from "./GlagahProbe3DCanvas";

const GlagahProbe3DCanvas = dynamic(() => import("./GlagahProbe3DCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[460px] flex-col items-center justify-center gap-2 bg-[#141C16] px-6 text-center text-agri-bg">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-agri-emeraldLight">
        Studio 3D · GlagahSmart Probe
      </p>
      <p className="text-xs text-agri-bg/70">
        Menyiapkan model 3D perangkat keras...
      </p>
    </div>
  ),
});

export type GlagahProbe3DViewProps = GlagahProbe3DCanvasProps;

export default function GlagahProbe3DView(props: GlagahProbe3DViewProps) {
  return <GlagahProbe3DCanvas {...props} />;
}
