import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ImageOff, Loader2, RotateCw, Siren, Stethoscope, UserPlus, Users } from "lucide-react";
import { Button, Card, CardHead, Empty, PageHeader, Pill, Select, StatusPill } from "../../dashboard/ui";
import notify from "../../dashboard/ui/notify";
import { DonutChart } from "../../dashboard/charts/DonutChart";
import { BarChart } from "../../dashboard/charts/BarChart";

// --- INTERFACES ---
interface DashboardData {
     kpis: {
          totalPatients: number;
          urgentCases: number;
          newPatients24h: number;
          totalDoctors: number;
     };
     charts: { statusDistribution: { status: string; count: number }[] };
     recentActivity: any[];
}

const initialData: DashboardData = {
     kpis: {
          totalPatients: 0,
          urgentCases: 0,
          newPatients24h: 0,
          totalDoctors: 0,
     },
     charts: { statusDistribution: [] },
     recentActivity: [],
};

const trainingStats = [
     { metric: "Epochs", value: 1000 },
     { metric: "Raw Molecule", value: 57619 },
     { metric: "Canonized Molecule", value: 32437 },
     { metric: "Accuracy", value: 86 },
];

const statusColor = (status: string) => {
     switch (status) {
          case "Urgent":
               return "#f0364f";
          case "Critical":
               return "#c4002b";
          case "High":
               return "#ff8a1f";
          case "Normal":
               return "#3b82f6";
          case "Stable":
               return "#16b46c";
          case "Recovering":
               return "#14b8a6";
          default:
               return "#8e8e96";
     }
};

export const DashboardAnalytics: React.FC = () => {
     const [data, setData] = useState<DashboardData>(initialData);
     const [availableModels, setAvailableModels] = useState<string[]>([]);
     const [selectedModel, setSelectedModel] = useState<string>("");
     const [imgIndex, setImgIndex] = useState(0);
     const [refreshKey, setRefreshKey] = useState(Date.now());
     const [imgState, setImgState] = useState<"loading" | "ok" | "error">("loading");

     // Dynamic Views based on selection
     const modelViews = selectedModel
          ? [
               {
                    id: 1,
                    name: "Inference Speed Benchmark",
                    url: `http://localhost:8000/inference_benchmark?model_name=${selectedModel}`,
               },
               {
                    id: 2,
                    name: "Neuron Activations (C-Atom)",
                    url: `http://localhost:8000/activation_map?model_name=${selectedModel}`,
               },
               {
                    id: 3,
                    name: "LSTM Weight Heatmap",
                    url: `http://localhost:8000/model_heatmap?layer=lstm&model_name=${selectedModel}`,
               },
          ]
          : [];

     // Load Data
     useEffect(() => {
          const docId = localStorage.getItem("doctorId") || "";
          fetch(`http://localhost:5001/api/Dashboard/stats?doctorId=${docId}`)
               .then((res) => res.json())
               .then(setData)
               .catch(console.error);

          fetch("http://localhost:8000/list_models")
               .then((res) => res.json())
               .then((d) => {
                    if (d.models?.length) {
                         setAvailableModels(d.models);
                         setSelectedModel(d.models[0]);
                    }
               })
               .catch(() => setAvailableModels(["Default"]));
     }, []);

     const currentSrc = modelViews.length > 0 ? `${modelViews[imgIndex].url}&t=${refreshKey}` : "";
     useEffect(() => setImgState("loading"), [currentSrc]);

     const handleNext = () => setImgIndex((p) => (p + 1) % modelViews.length);
     const handleRefresh = () => {
          setRefreshKey(Date.now());
          notify("Refreshing analysis...", "info", 1000);
     };

     const donutData = data.charts.statusDistribution.map((d) => ({ label: d.status, value: d.count, color: statusColor(d.status) }));
     const { kpis } = data;

     return (
          <div className="om-page">
               {/* 1. HEADER ROW */}
               <PageHeader title="OncoMind AI Dashboard" sub="Real-time Drug Discovery & Patient Analytics">
                    <span className="om-label" style={{ color: "var(--om-muted)" }}>Active Model</span>
                    <div style={{ width: 220 }}>
                         <Select
                              items={availableModels}
                              value={selectedModel || null}
                              onChange={(v) => {
                                   setSelectedModel(v ?? "");
                                   setRefreshKey(Date.now());
                              }}
                              placeholder="Select AI Model..."
                         />
                    </div>
               </PageHeader>

               {/* 2. KPI ROW */}
               <div className="om-stat-grid">
                    <Card aura="blue" className="om-stat">
                         <div className="om-stat-top">
                              <span className="om-stat-label">Total Patients</span>
                              <span className="om-stat-icon"><Users size={16} /></span>
                         </div>
                         <div className="om-dot-number">{kpis.totalPatients}</div>
                    </Card>
                    <Card aura="pink" className="om-stat">
                         <div className="om-stat-top">
                              <span className="om-stat-label">Urgent Cases</span>
                              <span className="om-stat-icon"><Siren size={16} /></span>
                         </div>
                         <div className="om-dot-number">{kpis.urgentCases}</div>
                         {kpis.totalPatients > 0 && (
                              <Pill tone="glass">{Math.round((kpis.urgentCases / kpis.totalPatients) * 100)}% of patients</Pill>
                         )}
                    </Card>
                    <Card aura="teal" className="om-stat">
                         <div className="om-stat-top">
                              <span className="om-stat-label">New (24h)</span>
                              <span className="om-stat-icon"><UserPlus size={16} /></span>
                         </div>
                         <div className="om-dot-number">{kpis.newPatients24h}</div>
                    </Card>
                    <Card aura="orange" className="om-stat">
                         <div className="om-stat-top">
                              <span className="om-stat-label">Active Doctors</span>
                              <span className="om-stat-icon"><Stethoscope size={16} /></span>
                         </div>
                         <div className="om-dot-number">{kpis.totalDoctors}</div>
                    </Card>
               </div>

               {/* 3. MAIN GRID */}
               <div className="om-split">
                    <div className="om-stack">
                         <Card>
                              <CardHead title="Patient Status Distribution" sub="Hover a slice or row to focus it" />
                              <DonutChart data={donutData} centerLabel="Patients" />
                         </Card>

                         <Card>
                              <CardHead title="Model Training Metrics" sub="Logarithmic scale">
                                   <Pill>log₁₀</Pill>
                              </CardHead>
                              <BarChart data={trainingStats.map((t) => ({ label: t.metric, value: t.value }))} log />
                         </Card>
                    </div>

                    <div className="om-stack">
                         {/* Live AI Analysis */}
                         <Card>
                              <CardHead title="Live Model Analysis" sub={modelViews[imgIndex]?.name ?? "Waiting for model list"}>
                                   <Button variant="ghost" size="sm" iconOnly icon={<RotateCw size={16} />} onClick={handleRefresh} aria-label="Refresh analysis" />
                              </CardHead>

                              <div className="om-media" style={{ aspectRatio: "4 / 3", background: "#0b0b0e" }}>
                                   {modelViews.length > 0 ? (
                                        <>
                                             {imgState !== "error" && (
                                                  <img
                                                       key={currentSrc}
                                                       src={currentSrc}
                                                       alt="Analysis"
                                                       style={{ objectFit: "contain", opacity: imgState === "ok" ? 1 : 0, transition: "opacity 160ms" }}
                                                       onLoad={() => setImgState("ok")}
                                                       onError={() => setImgState("error")}
                                                  />
                                             )}
                                             {imgState === "loading" && (
                                                  <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#8b8b95" }}>
                                                       <Loader2 className="om-spin" size={22} />
                                                  </div>
                                             )}
                                             {imgState === "error" && (
                                                  <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#8b8b95" }}>
                                                       <Empty icon={<ImageOff size={26} />} title={<span style={{ color: "#f3f3f5" }}>Offline</span>}>
                                                            The ML service didn't return this view.
                                                       </Empty>
                                                  </div>
                                             )}
                                             <div className="om-media-overlay" style={{ justifyContent: "flex-end" }}>
                                                  <span className="om-pill om-pill--ink" style={{ opacity: 0.85 }}>
                                                       {imgIndex + 1} / {modelViews.length}
                                                  </span>
                                             </div>
                                        </>
                                   ) : (
                                        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#8b8b95", fontSize: 14 }}>
                                             Loading Model...
                                        </div>
                                   )}
                              </div>

                              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 14 }}>
                                   {/* both arrows advance, as before */}
                                   <Button iconOnly icon={<ChevronLeft size={18} />} onClick={() => handleNext()} aria-label="Previous view" disabled={!modelViews.length} />
                                   <Button iconOnly icon={<ChevronRight size={18} />} onClick={handleNext} aria-label="Next view" disabled={!modelViews.length} />
                              </div>
                         </Card>

                         {/* Recent List */}
                         <Card flush>
                              <div style={{ padding: "18px 18px 4px" }}>
                                   <CardHead title="Recent Admissions" />
                              </div>
                              <div className="om-table-wrap" style={{ "--max-h": "340px" } as React.CSSProperties}>
                                   <table className="om-table">
                                        <thead>
                                             <tr>
                                                  <th className="center" style={{ width: 80 }}>Time</th>
                                                  <th>Name</th>
                                                  <th style={{ width: 110 }}>Status</th>
                                             </tr>
                                        </thead>
                                        <tbody>
                                             {data.recentActivity.map((r, i) => (
                                                  <tr key={r.id ?? i}>
                                                       <td className="center om-mono" style={{ color: "var(--om-muted)", fontSize: 12 }}>{r.time}</td>
                                                       <td style={{ fontWeight: 550 }}>{r.name}</td>
                                                       <td>
                                                            <StatusPill status={r.status === "Urgent" ? "Urgent" : "Stable"}>{r.status}</StatusPill>
                                                       </td>
                                                  </tr>
                                             ))}
                                        </tbody>
                                   </table>
                                   {data.recentActivity.length === 0 && <Empty title="No recent admissions" />}
                              </div>
                         </Card>
                    </div>
               </div>
          </div>
     );
};
