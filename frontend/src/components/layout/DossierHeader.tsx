import React from "react";

interface DossierHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  summary: React.ReactNode;
  aside?: React.ReactNode;
  maxWidthClass?: string;
}

export default function DossierHeader({
  eyebrow,
  title,
  summary,
  aside,
  maxWidthClass = "max-w-7xl",
}: DossierHeaderProps) {
  return (
    <section className="border-b border-agri-primary/20 pb-10 pt-10 sm:pb-12 sm:pt-14">
      <div
        className={`mx-auto ${maxWidthClass} px-4 sm:px-6 lg:px-8 ${
          aside
            ? "grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-end"
            : ""
        }`}
      >
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-agri-clay">
            <span className="h-px w-8 bg-agri-clay" aria-hidden="true" />
            <span>{eyebrow}</span>
          </div>
          <h1 className="display-serif text-4xl leading-[0.98] text-agri-ink sm:text-5xl lg:text-[3.5rem]">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-agri-muted sm:text-base">
            {summary}
          </p>
        </div>

        {aside && <div className="lg:justify-self-end lg:w-full">{aside}</div>}
      </div>
    </section>
  );
}
