import React, { useState } from "react";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLog, scaleLinear } from "@visx/scale";
import { GridRows } from "@visx/grid";
import { AxisBottom } from "@visx/axis";
import { ParentSize } from "@visx/responsive";

export type BarDatum = { label: string; value: number };

const fmt = new Intl.NumberFormat("en-US");

/**
 * Vertical bars with value labels. `log` keeps small values (e.g. 86) visible
 * next to large ones (e.g. 57,619) — same intent as the old logarithmic ValueAxis.
 */
export function BarChart({ data, height = 260, log = false }: { data: BarDatum[]; height?: number; log?: boolean }) {
     const [hover, setHover] = useState<string | null>(null);
     const margin = { top: 28, right: 8, bottom: 34, left: 8 };

     return (
          <div className="om-chart" style={{ height }}>
               <ParentSize debounceTime={50}>
                    {({ width }) => {
                         const innerW = Math.max(0, width - margin.left - margin.right);
                         const innerH = Math.max(0, height - margin.top - margin.bottom);
                         if (innerW === 0) return null;

                         const max = Math.max(1, ...data.map((d) => d.value));
                         const x = scaleBand<string>({ domain: data.map((d) => d.label), range: [0, innerW], padding: 0.32 });
                         const y = log
                              ? scaleLog<number>({ domain: [1, max * 1.6], range: [innerH, 0], clamp: true })
                              : scaleLinear<number>({ domain: [0, max * 1.1], range: [innerH, 0], nice: true });

                         return (
                              <svg width={width} height={height} role="img" aria-label="Bar chart">
                                   <defs>
                                        <linearGradient id="om-bar-grad" x1="0" y1="0" x2="0" y2="1">
                                             <stop offset="0%" stopColor="#7b5cff" />
                                             <stop offset="100%" stopColor="#4fb3ff" />
                                        </linearGradient>
                                   </defs>
                                   <Group left={margin.left} top={margin.top}>
                                        <GridRows scale={y} width={innerW} numTicks={4} stroke="var(--om-border)" strokeDasharray="2 4" />
                                        {data.map((d) => {
                                             const bw = x.bandwidth();
                                             const bx = x(d.label) ?? 0;
                                             const by = y(Math.max(log ? 1 : 0, d.value)) ?? innerH;
                                             const bh = Math.max(2, innerH - by);
                                             const dim = hover && hover !== d.label;
                                             return (
                                                  <g
                                                       key={d.label}
                                                       onMouseEnter={() => setHover(d.label)}
                                                       onMouseLeave={() => setHover(null)}
                                                       style={{ cursor: "default" }}
                                                  >
                                                       {/* track */}
                                                       <rect x={bx} y={0} width={bw} height={innerH} rx={Math.min(12, bw / 2)} fill="var(--om-surface-2)" />
                                                       <Bar
                                                            x={bx}
                                                            y={innerH - bh}
                                                            width={bw}
                                                            height={bh}
                                                            rx={Math.min(12, bw / 2)}
                                                            fill="url(#om-bar-grad)"
                                                            opacity={dim ? 0.35 : 1}
                                                            style={{ transition: "opacity 120ms" }}
                                                       />
                                                       <text
                                                            x={bx + bw / 2}
                                                            y={innerH - bh - 8}
                                                            textAnchor="middle"
                                                            fontSize={12}
                                                            fontWeight={600}
                                                            fill="var(--om-text)"
                                                            style={{ fontVariantNumeric: "tabular-nums" }}
                                                       >
                                                            {fmt.format(d.value)}
                                                       </text>
                                                  </g>
                                             );
                                        })}
                                        <AxisBottom
                                             top={innerH}
                                             scale={x}
                                             hideAxisLine
                                             hideTicks
                                             tickLabelProps={() => ({
                                                  fill: "var(--om-muted)",
                                                  fontSize: 11,
                                                  textAnchor: "middle",
                                                  dy: 6,
                                             })}
                                        />
                                   </Group>
                              </svg>
                         );
                    }}
               </ParentSize>
          </div>
     );
}
