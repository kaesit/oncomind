import React, { useState } from "react";

/* =====================================================================
   AnatomyView — glassy x-ray torso where each organ lights up
   red (toxicity hit) or green (clear). Everything else stays neutral
   translucent white: no other hues on purpose.

   Data stays with the caller: we only read region ids/labels/related
   properties and the ADMET predictions, exactly like the old canvas.
   ===================================================================== */

type Region = { id: string; label: string; relatedProperties: string[] };
type Prediction = { property: string; toxic: boolean };
type Tone = "idle" | "scanned" | "toxic" | "safe" | "neutral";

const VB_W = 720;
const VB_H = 620;
const OX = 160; // body is drawn around x=200 and shifted into the middle of the viewBox

const RED = "#ff3d5a";
const GREEN = "#2bea85";
const WHITE = "#ffffff";

/** mirror an absolute-coordinate path (M/L/C/Q/Z) around the body midline x=200 */
const mirror = (d: string) => d.replace(/(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${400 - Number(x)} ${y}`);

/* ------------------------------------------------------------ body */
const HEAD = "M200 16 C238 16 254 46 252 84 C251 108 242 126 228 138 C218 147 209 152 200 152 C191 152 182 147 172 138 C158 126 149 108 148 84 C146 46 162 16 200 16 Z";
const EAR = "M149 78 C140 78 138 96 146 104";
const TORSO_HALF =
     "M200 140 L184 146 C184 162 183 172 180 180 C166 190 140 196 118 202 C100 208 88 218 84 232 C92 244 108 252 122 262 C128 300 134 360 134 410 C134 440 126 470 122 500 C118 530 118 570 120 620 L200 620 Z";
const ARM = "M84 232 C72 248 68 272 68 296 C68 340 64 390 62 440 L60 620 L100 620 L102 440 C104 380 108 320 112 270 C102 262 90 250 84 232 Z";
const CLAVICLE = "M196 198 C172 190 142 198 110 208";
const PELVIS = "M200 604 C186 594 152 590 140 566 C134 552 140 538 152 534";
const RIBS = Array.from({ length: 7 }, (_, i) => {
     const y = 214 + i * 19;
     const ox = 134 + Math.abs(i - 2) * 3;
     return `M196 ${y} C170 ${y - 9} ${ox + 6} ${y - 4} ${ox} ${y + 20}`;
});

/* ---------------------------------------------------------- organs */
type OrganShape = {
     fills: string[]; // filled organ paths
     details?: string[]; // fine inner strokes (gyri, coils…)
     vessels?: string[]; // stroked-only paths (plasma)
     center: number; // y used to decide when the scan line has passed it
     anchor: [number, number]; // where the callout leader line lands (body coords)
     side: "left" | "right";
     pillY: number;
};

const LUNG_L = "M190 216 C168 214 146 228 140 258 C133 292 132 330 136 356 C150 364 172 360 188 348 C192 312 194 262 190 216 Z";
const LUNG_R = "M210 216 C232 214 254 228 260 258 C267 292 268 330 264 356 C252 362 236 360 226 352 C230 336 224 316 214 306 C212 280 212 250 210 216 Z";
const KIDNEY_L = "M150 410 C140 410 136 424 138 436 C140 450 148 458 158 456 C164 454 166 446 162 438 C160 432 164 426 164 420 C164 414 158 410 150 410 Z";

const ORGANS: Record<string, OrganShape> = {
     brain: {
          fills: ["M164 78 C160 48 180 30 200 30 C220 30 240 48 236 78 C234 94 220 104 200 104 C180 104 166 94 164 78 Z"],
          details: [
               "M200 33 L200 101",
               "M176 52 C184 46 190 56 197 50",
               "M204 50 C212 56 220 46 228 56",
               "M170 72 C178 64 188 78 196 70",
               "M204 72 C212 80 222 66 231 76",
               "M178 92 C186 86 192 96 197 90",
               "M204 90 C210 96 216 86 224 92",
          ],
          center: 66,
          anchor: [234, 62],
          side: "right",
          pillY: 58,
     },
     lungs: {
          fills: [LUNG_L, LUNG_R],
          details: ["M176 250 C170 280 168 310 170 336", "M224 252 C232 280 240 306 244 336"],
          center: 286,
          anchor: [140, 290],
          side: "left",
          pillY: 246,
     },
     heart: {
          fills: ["M204 284 C214 270 238 272 244 290 C250 310 236 332 214 350 C204 344 192 330 190 314 C188 298 194 290 204 284 Z"],
          details: ["M214 296 C220 308 220 322 212 336"],
          center: 312,
          anchor: [244, 304],
          side: "right",
          pillY: 304,
     },
     liver: {
          fills: ["M134 368 C150 358 196 356 238 364 C234 376 218 390 194 398 C172 406 150 406 140 396 C132 388 130 376 134 368 Z"],
          details: ["M176 366 C178 380 182 392 188 400"],
          center: 382,
          anchor: [136, 380],
          side: "left",
          pillY: 380,
     },
     plasma: {
          fills: [],
          vessels: [
               // aortic arch → descending aorta → iliac split
               "M214 288 C216 262 208 248 198 250 C188 252 186 266 192 276 C194 330 194 450 194 560 C194 572 184 584 168 604",
               "M194 560 C196 574 214 586 232 604",
               // carotids
               "M200 250 C200 220 192 196 188 150",
               "M204 252 C206 222 210 196 212 150",
               // subclavian → arms
               "M196 254 C176 236 140 222 100 240 C88 250 84 280 84 330",
               "M206 254 C226 236 262 222 300 240 C312 250 316 280 316 330",
               // renal branches
               "M194 432 L164 434",
               "M194 432 L236 434",
          ],
          center: 250,
          anchor: [300, 240],
          side: "right",
          pillY: 196,
     },
     kidneys: {
          fills: [KIDNEY_L, mirror(KIDNEY_L)],
          center: 434,
          anchor: [138, 436],
          side: "left",
          pillY: 456,
     },
     intestine: {
          fills: ["M146 470 C146 452 166 446 200 446 C234 446 254 452 254 470 L254 532 C254 550 236 556 200 556 C164 556 146 550 146 532 Z"],
          details: [
               "M166 474 C178 466 190 482 202 474 C214 466 226 482 236 474",
               "M164 494 C176 486 188 502 200 494 C212 486 224 502 238 494",
               "M166 514 C178 506 190 522 202 514 C214 506 226 522 236 514",
               "M172 534 C184 526 196 540 208 532 C220 526 228 538 232 534",
          ],
          center: 500,
          anchor: [254, 500],
          side: "right",
          pillY: 512,
     },
};

/** paint order, back to front (heart sits in front of the lungs) */
const Z_ORDER = ["plasma", "lungs", "liver", "kidneys", "intestine", "heart", "brain"];
/** callout pills sit this far in from the viewBox edge, anchored by their inner side */
const PILL_IN = 200;

const toneColor = (t: Tone) => (t === "toxic" ? RED : t === "safe" ? GREEN : WHITE);

/* ------------------------------------------------------- component */
export interface AnatomyViewProps {
     regions: Region[];
     predictions: Prediction[];
     /** -2 waiting, 0..n-1 scanning, -1 complete (same contract as before) */
     scanStep: number;
     activeRegion: string | null;
     onRegionClick: (id: string) => void;
}

export function AnatomyView({ regions, predictions, scanStep, activeRegion, onRegionClick }: AnatomyViewProps) {
     const [hover, setHover] = useState<string | null>(null);
     const hasResults = predictions.length > 0;
     const scanning = scanStep >= 0;
     const lineY = 20 + (Math.max(scanStep, 0) / Math.max(1, regions.length - 1)) * 560;

     const info = regions
          .filter((r) => ORGANS[r.id])
          .map((r) => {
               const shape = ORGANS[r.id];
               const rel = predictions.filter((p) => r.relatedProperties.includes(p.property));
               const flags = rel.filter((p) => p.toxic).length;
               const revealed = scanStep === -1 || (scanning && shape.center <= lineY);
               let tone: Tone = "idle";
               if (revealed) tone = !hasResults ? "scanned" : !rel.length ? "neutral" : flags > 0 ? "toxic" : "safe";
               return { region: r, shape, tone, flags, revealed };
          });

     const painted = [...info].sort((a, b) => Z_ORDER.indexOf(a.region.id) - Z_ORDER.indexOf(b.region.id));
     const toxicOrgans = info.filter((o) => o.tone === "toxic").length;
     const focus = hover ?? activeRegion;
     const statusText = scanStep === -2 ? "AWAITING INPUT" : scanStep === -1 ? "SCAN COMPLETE" : `SCANNING ${Math.round(((scanStep + 1) / regions.length) * 100)}%`;

     const toggle = (id: string) => onRegionClick(id === activeRegion ? "" : id);

     return (
          <div className="om-anat-screen" onClick={() => onRegionClick("")}>
               {/* HUD */}
               <div className="om-anat-hud om-anat-hud--tl">
                    <span className="om-anat-chip"><i style={{ background: RED }} /> Toxicity hit</span>
                    <span className="om-anat-chip"><i style={{ background: GREEN }} /> Clear</span>
               </div>
               {scanStep === -1 && hasResults && (
                    <div className="om-anat-hud om-anat-hud--tr">
                         <span className="om-anat-chip" style={{ color: toxicOrgans ? RED : GREEN }}>
                              {toxicOrgans ? `${toxicOrgans} of ${info.length} regions affected` : "No region affected"}
                         </span>
                    </div>
               )}
               <div className="om-anat-hud om-anat-hud--bl om-mono">{statusText}</div>
               <div className="om-anat-hud om-anat-hud--br om-mono">ADMET v3.1</div>

               <div className="om-anat-fit">
                    <div className="om-anat">
                         <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" role="img" aria-label="Body map of predicted toxicity">
                              <defs>
                                   <filter id="om-anat-glow" x="-60%" y="-60%" width="220%" height="220%">
                                        <feGaussianBlur stdDeviation="9" />
                                   </filter>
                                   <filter id="om-anat-glow-sm" x="-60%" y="-60%" width="220%" height="220%">
                                        <feGaussianBlur stdDeviation="3" />
                                   </filter>
                                   <pattern id="om-anat-dots" width="7" height="7" patternUnits="userSpaceOnUse">
                                        <circle cx="1.2" cy="1.2" r="0.9" fill="#fff" />
                                   </pattern>
                                   <linearGradient id="om-anat-body" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#fff" stopOpacity="0.10" />
                                        <stop offset="100%" stopColor="#fff" stopOpacity="0.03" />
                                   </linearGradient>
                                   <linearGradient id="om-anat-fade" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0.72" stopColor="#fff" />
                                        <stop offset="1" stopColor="#000" />
                                   </linearGradient>
                                   <mask id="om-anat-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={VB_W} height={VB_H}>
                                        <rect width={VB_W} height={VB_H} fill="url(#om-anat-fade)" />
                                   </mask>
                                   {(["toxic", "safe", "neutral", "scanned", "idle"] as Tone[]).map((t) => {
                                        const c = toneColor(t);
                                        const [a, b] = t === "toxic" ? [0.95, 0.35] : t === "safe" ? [0.38, 0.06] : t === "scanned" ? [0.5, 0.1] : t === "neutral" ? [0.22, 0.05] : [0.1, 0.02];
                                        return (
                                             <radialGradient key={t} id={`om-anat-${t}`} cx="50%" cy="45%" r="65%">
                                                  <stop offset="0%" stopColor={c} stopOpacity={a} />
                                                  <stop offset="100%" stopColor={c} stopOpacity={b} />
                                             </radialGradient>
                                        );
                                   })}
                              </defs>

                              <g transform={`translate(${OX} 0)`}>
                                   {/* ---- glass body ---- */}
                                   <g mask="url(#om-anat-mask)">
                                        {[TORSO_HALF, mirror(TORSO_HALF), ARM, mirror(ARM), HEAD].map((d, i) => (
                                             <g key={i}>
                                                  <path d={d} fill="url(#om-anat-body)" />
                                                  <path d={d} fill="url(#om-anat-dots)" opacity={0.09} />
                                             </g>
                                        ))}
                                        <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
                                             {[TORSO_HALF, mirror(TORSO_HALF), ARM, mirror(ARM)].map((d, i) => (
                                                  <path key={i} d={d} strokeOpacity={0.28} strokeWidth={1.1} />
                                             ))}
                                             <path d={HEAD} strokeOpacity={0.4} strokeWidth={1.2} />
                                             <path d={EAR} strokeOpacity={0.3} />
                                             <path d={mirror(EAR)} strokeOpacity={0.3} />

                                             {/* skeleton hints */}
                                             <g strokeOpacity={0.16} strokeWidth={1.6}>
                                                  {RIBS.map((d, i) => (
                                                       <React.Fragment key={i}>
                                                            <path d={d} />
                                                            <path d={mirror(d)} />
                                                       </React.Fragment>
                                                  ))}
                                                  <path d={CLAVICLE} strokeOpacity={0.3} />
                                                  <path d={mirror(CLAVICLE)} strokeOpacity={0.3} />
                                                  <path d={PELVIS} />
                                                  <path d={mirror(PELVIS)} />
                                             </g>
                                        </g>
                                        <g fill="#fff" fillOpacity={0.13}>
                                             {Array.from({ length: 29 }, (_, i) => (
                                                  <rect key={i} x={194} y={160 + i * 15} width={12} height={10} rx={3} />
                                             ))}
                                        </g>
                                   </g>

                                   {/* ---- organs ---- */}
                                   {painted.map(({ region, shape, tone }) => {
                                        const c = toneColor(tone);
                                        const lit = tone === "toxic" || tone === "safe" || tone === "scanned";
                                        const dim = focus && focus !== region.id;
                                        const isFocus = focus === region.id;
                                        const handlers = {
                                             onClick: (e: React.MouseEvent) => {
                                                  e.stopPropagation();
                                                  toggle(region.id);
                                             },
                                             onMouseEnter: () => setHover(region.id),
                                             onMouseLeave: () => setHover(null),
                                        };
                                        return (
                                             <g
                                                  key={region.id}
                                                  className="om-anat-organ"
                                                  data-tone={tone}
                                                  style={{ opacity: dim ? 0.3 : 1 }}
                                                  {...handlers}
                                             >
                                                  {/* glow layer (pulses on toxic) */}
                                                  {lit && (
                                                       <g className={tone === "toxic" ? "om-anat-pulse" : undefined} filter="url(#om-anat-glow)" opacity={tone === "toxic" ? 0.9 : tone === "safe" ? 0.22 : 0.35}>
                                                            {shape.fills.map((d, i) => (
                                                                 <path key={i} d={d} fill={c} />
                                                            ))}
                                                            {shape.vessels?.map((d, i) => (
                                                                 <path key={i} d={d} fill="none" stroke={c} strokeWidth={8} strokeLinecap="round" />
                                                            ))}
                                                       </g>
                                                  )}

                                                  {shape.fills.map((d, i) => (
                                                       <g key={i}>
                                                            <path
                                                                 d={d}
                                                                 fill={`url(#om-anat-${tone})`}
                                                                 stroke={c}
                                                                 strokeOpacity={tone === "toxic" ? 1 : lit ? 0.75 : tone === "neutral" ? 0.45 : 0.22}
                                                                 strokeWidth={isFocus ? 2 : 1.1}
                                                            />
                                                            <path d={d} fill="url(#om-anat-dots)" opacity={tone === "toxic" ? 0.45 : lit ? 0.22 : 0.12} />
                                                       </g>
                                                  ))}
                                                  {shape.details?.map((d, i) => (
                                                       <path key={i} d={d} fill="none" stroke={tone === "toxic" ? "#fff" : c} strokeOpacity={tone === "toxic" ? 0.6 : lit ? 0.35 : 0.18} strokeWidth={1} strokeLinecap="round" />
                                                  ))}
                                                  {shape.vessels?.map((d, i) => (
                                                       <g key={i}>
                                                            <path d={d} fill="none" stroke={c} strokeOpacity={tone === "toxic" ? 1 : lit ? 0.6 : tone === "neutral" ? 0.4 : 0.18} strokeWidth={isFocus ? 3 : tone === "toxic" ? 2.6 : 1.8} strokeLinecap="round" />
                                                            {/* fat invisible hit area so thin vessels are clickable */}
                                                            <path d={d} fill="none" stroke="transparent" strokeWidth={14} style={{ pointerEvents: "stroke" }} />
                                                       </g>
                                                  ))}
                                             </g>
                                        );
                                   })}

                                   {/* ---- callout leaders ---- */}
                                   {info.map(({ region, shape, tone, revealed }) => {
                                        if (!revealed) return null;
                                        const c = toneColor(tone);
                                        const [ax, ay] = shape.anchor;
                                        const edge = shape.side === "left" ? PILL_IN - OX : VB_W - PILL_IN - OX;
                                        const elbow = shape.side === "left" ? ax - 26 : ax + 26;
                                        const dim = focus && focus !== region.id;
                                        return (
                                             <g key={region.id} style={{ opacity: dim ? 0.25 : 1, transition: "opacity 120ms" }} pointerEvents="none">
                                                  <path
                                                       d={`M${edge} ${shape.pillY} L${elbow} ${shape.pillY} L${ax} ${ay}`}
                                                       fill="none"
                                                       stroke={c}
                                                       strokeOpacity={tone === "toxic" || tone === "safe" ? 0.7 : 0.3}
                                                       strokeWidth={1}
                                                  />
                                                  <circle cx={ax} cy={ay} r={7} fill={c} opacity={0.18} filter="url(#om-anat-glow-sm)" />
                                                  <circle cx={ax} cy={ay} r={3} fill={c} />
                                             </g>
                                        );
                                   })}

                                   {/* ---- scan line ---- */}
                                   {scanning && (
                                        <g className="om-anat-scan" style={{ transform: `translateY(${lineY}px)` }} pointerEvents="none">
                                             <rect x={40} y={-14} width={320} height={28} fill="url(#om-anat-scanned)" opacity={0.25} filter="url(#om-anat-glow-sm)" />
                                             <line x1={30} x2={370} y1={0} y2={0} stroke="#fff" strokeOpacity={0.8} strokeWidth={1} />
                                        </g>
                                   )}
                              </g>
                         </svg>

                         {/* ---- callout pills (HTML for crisp text) ---- */}
                         {info.map(({ region, shape, tone, flags, revealed }) => {
                              if (!revealed) return null;
                              const left = shape.side === "left";
                              const x = left ? PILL_IN : VB_W - PILL_IN;
                              const dim = focus && focus !== region.id;
                              return (
                                   <button
                                        key={region.id}
                                        className="om-anat-pill"
                                        data-tone={tone}
                                        data-active={activeRegion === region.id}
                                        style={{
                                             left: `${(x / VB_W) * 100}%`,
                                             top: `${(shape.pillY / VB_H) * 100}%`,
                                             transform: `translate(${left ? "-100%" : "0"}, -50%)`,
                                             opacity: dim ? 0.4 : 1,
                                        }}
                                        onClick={(e) => {
                                             e.stopPropagation();
                                             toggle(region.id);
                                        }}
                                        onMouseEnter={() => setHover(region.id)}
                                        onMouseLeave={() => setHover(null)}
                                   >
                                        <span className="om-anat-pill-label">{region.label}</span>
                                        <span className="om-anat-pill-status">
                                             <i />
                                             {tone === "toxic"
                                                  ? `${flags} flag${flags > 1 ? "s" : ""}`
                                                  : tone === "safe"
                                                       ? "Clear"
                                                       : tone === "scanned"
                                                            ? "Scanning…"
                                                            : "No mapped data"}
                                        </span>
                                   </button>
                              );
                         })}
                    </div>
               </div>
          </div>
     );
}
