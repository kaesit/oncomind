import React, { useEffect, useRef, useState } from "react";
import { AnatomyView } from "../dashboard/anatomy/AnatomyView";
import { useOmTheme } from "../dashboard/ui/theme";
import "../dashboard/styles/dashboard.css";
import "./site.css";

/* ------------------------------------------------------- standalone */
/** Wrapper for public pages that live outside MainLayout (sign in/up, 404). */
export function Standalone({ children }: { children: React.ReactNode }) {
     useOmTheme();
     return (
          <div className="om-site" style={{ position: "relative", overflow: "hidden", display: "grid", placeItems: "center", padding: 16 }}>
               {children}
          </div>
     );
}

/* ------------------------------------------------------------ reveal */
/** Adds `.is-in` to every `.site-reveal` inside the returned ref once it scrolls into view. */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
     const ref = useRef<T>(null);
     useEffect(() => {
          const root = ref.current;
          if (!root) return;
          const targets = root.querySelectorAll<HTMLElement>(".site-reveal");
          if (!("IntersectionObserver" in window)) {
               targets.forEach((t) => t.classList.add("is-in"));
               return;
          }
          const io = new IntersectionObserver(
               (entries) => {
                    entries.forEach((e) => {
                         if (e.isIntersecting) {
                              e.target.classList.add("is-in");
                              io.unobserve(e.target);
                         }
                    });
               },
               { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
          );
          targets.forEach((t) => io.observe(t));
          return () => io.disconnect();
     }, []);
     return ref;
}

/* --------------------------------------------------------- decoration */
export function Orb({ tone, size, style }: { tone: "violet" | "pink" | "orange" | "teal"; size: number; style?: React.CSSProperties }) {
     return <div aria-hidden className={`site-orb site-orb--${tone}`} style={{ width: size, height: size, ...style }} />;
}

export function Marquee({ items }: { items: string[] }) {
     // rendered twice so the -50% translate loops seamlessly
     const row = (hidden: boolean) => (
          <div className="site-marquee-item" aria-hidden={hidden || undefined}>
               {items.map((t) => (
                    <React.Fragment key={t}>
                         <span>{t}</span>
                         <i />
                    </React.Fragment>
               ))}
          </div>
     );
     return (
          <div className="site-marquee">
               <div className="site-marquee-track">
                    {row(false)}
                    {row(true)}
               </div>
          </div>
     );
}

export function SectionHead({ eyebrow, title, children }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode }) {
     return (
          <div className="site-head site-reveal">
               <div>
                    <span className="site-eyebrow">{eyebrow}</span>
                    <h2 className="site-h2">{title}</h2>
               </div>
               {children && <p className="site-lead">{children}</p>}
          </div>
     );
}

/* -------------------------------------------------- scanner showcase */
const SHOWCASE_REGIONS = [
     { id: "brain", label: "CNS / Brain", relatedProperties: [] },
     { id: "heart", label: "Heart", relatedProperties: [] },
     { id: "lungs", label: "Lungs", relatedProperties: [] },
     { id: "liver", label: "Liver", relatedProperties: [] },
     { id: "plasma", label: "Plasma / Blood", relatedProperties: [] },
     { id: "kidneys", label: "Kidneys", relatedProperties: [] },
     { id: "intestine", label: "GI Tract", relatedProperties: [] },
];

/**
 * The real dashboard scanner running an endless scan sweep.
 * No predictions are shown on purpose — this is a preview, not a result.
 */
export function ScannerShowcase() {
     const [step, setStep] = useState(-2);

     useEffect(() => {
          if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
               setStep(-1);
               return;
          }
          // -2 idle → 0..6 sweep → -1 hold → repeat
          const seq = [-2, 0, 1, 2, 3, 4, 5, 6, -1];
          const hold: Record<number, number> = { [-2]: 900, [-1]: 2600 };
          let i = 0;
          let t: ReturnType<typeof setTimeout>;
          const tick = () => {
               setStep(seq[i]);
               const wait = hold[seq[i]] ?? 380;
               i = (i + 1) % seq.length;
               t = setTimeout(tick, wait);
          };
          tick();
          return () => clearTimeout(t);
     }, []);

     return (
          <div className="site-device">
               <AnatomyView regions={SHOWCASE_REGIONS} predictions={[]} scanStep={step} activeRegion={null} onRegionClick={() => {}} />
               <span className="om-pill om-pill--ink site-device-tag">Live preview · ADMET body scanner</span>
          </div>
     );
}
