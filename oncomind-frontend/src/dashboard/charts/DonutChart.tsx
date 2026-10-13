import React, { useState } from "react";
import { Pie } from "@visx/shape";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";

export type DonutDatum = { label: string; value: number; color: string };

/**
 * Doughnut with the total in the centre and a hover-linked legend.
 * Labels live in the legend (not on connectors) so nothing overlaps on small cards.
 */
export function DonutChart({ data, height = 240, centerLabel = "Total" }: { data: DonutDatum[]; height?: number; centerLabel?: string }) {
     const [active, setActive] = useState<string | null>(null);
     const total = data.reduce((s, d) => s + d.value, 0);
     const activeDatum = data.find((d) => d.label === active);

     return (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(150px, 0.9fr)", gap: 16, alignItems: "center" }}>
               <div className="om-chart" style={{ height }}>
                    <ParentSize debounceTime={50}>
                         {({ width }) => {
                              const size = Math.min(width, height);
                              const r = size / 2;
                              if (r <= 0) return null;
                              return (
                                   <svg width={width} height={height} role="img" aria-label="Distribution chart">
                                        <Group top={height / 2} left={width / 2}>
                                             {total === 0 ? (
                                                  <circle r={r - 14} fill="none" stroke="var(--om-surface-3)" strokeWidth={22} />
                                             ) : (
                                                  <Pie
                                                       data={data.filter((d) => d.value > 0)}
                                                       pieValue={(d) => d.value}
                                                       outerRadius={r - 2}
                                                       innerRadius={r - 30}
                                                       padAngle={0.025}
                                                       cornerRadius={6}
                                                       pieSortValues={() => 0}
                                                  >
                                                       {(pie) =>
                                                            pie.arcs.map((arc) => {
                                                                 const dim = active && active !== arc.data.label;
                                                                 return (
                                                                      <path
                                                                           key={arc.data.label}
                                                                           d={pie.path(arc) ?? ""}
                                                                           fill={arc.data.color}
                                                                           opacity={dim ? 0.28 : 1}
                                                                           style={{ transition: "opacity 120ms" }}
                                                                           onMouseEnter={() => setActive(arc.data.label)}
                                                                           onMouseLeave={() => setActive(null)}
                                                                      />
                                                                 );
                                                            })
                                                       }
                                                  </Pie>
                                             )}
                                             <text
                                                  textAnchor="middle"
                                                  dy="-0.15em"
                                                  fill="var(--om-text)"
                                                  style={{ fontFamily: "var(--om-font-dot)", fontWeight: 800, fontSize: Math.max(28, r * 0.42) }}
                                             >
                                                  {activeDatum ? activeDatum.value : total}
                                             </text>
                                             <text textAnchor="middle" dy="1.9em" fill="var(--om-muted)" fontSize={12}>
                                                  {activeDatum ? activeDatum.label : centerLabel}
                                             </text>
                                        </Group>
                                   </svg>
                              );
                         }}
                    </ParentSize>
               </div>

               <div className="om-legend">
                    {data.map((d) => (
                         <div
                              key={d.label}
                              className="om-legend-row"
                              data-active={active === d.label}
                              onMouseEnter={() => setActive(d.label)}
                              onMouseLeave={() => setActive(null)}
                         >
                              <span className="om-legend-swatch" style={{ background: d.color }} />
                              <span>{d.label}</span>
                              <span className="om-legend-val">{d.value}</span>
                              <span className="om-legend-pct">{total ? Math.round((d.value / total) * 100) : 0}%</span>
                         </div>
                    ))}
                    {data.length === 0 && <span className="om-hint">No data yet</span>}
               </div>
          </div>
     );
}
