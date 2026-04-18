import React, { useState, useRef, useEffect, useCallback } from "react";
import { Popup } from "devextreme-react/popup";
import notify from "devextreme/ui/notify";

/* -------------------------------------------------------
   TYPES
------------------------------------------------------- */
interface AdmetPrediction {
     property: string;
     value: number;
     category: "toxicity" | "absorption" | "distribution" | "metabolism" | "excretion";
     toxic: boolean;
}

interface BodyRegion {
     id: string;
     label: string;
     nx: number;
     ny: number;  // normalized -1..1 (x: left-right, y: up-down from center)
     radius: number;
     relatedProperties: string[];
     description: string;
}

/* -------------------------------------------------------
   BODY REGIONS — anatomically positioned
   ny: 1.0 = top of head, -1.0 = feet
------------------------------------------------------- */
const BODY_REGIONS: BodyRegion[] = [
     { id: "brain", label: "CNS / Brain", nx: 0.0, ny: 0.80, radius: 0.11, relatedProperties: ["BBB_Martini", "CNS_MPO", "MDCK", "BBB_Penetration"], description: "Blood-brain barrier penetration & CNS activity" },
     { id: "heart", label: "Heart", nx: -0.10, ny: 0.28, radius: 0.08, relatedProperties: ["hERG", "Pgp_Inhibitor"], description: "Cardiac toxicity via hERG channel blockade" },
     { id: "lungs", label: "Lungs", nx: 0.20, ny: 0.30, radius: 0.09, relatedProperties: ["Caco2_Wang", "PAMPA_NCATS"], description: "Pulmonary absorption & permeability" },
     { id: "liver", label: "Liver", nx: 0.12, ny: 0.12, radius: 0.11, relatedProperties: ["CYP2D6_Substrate", "CYP3A4_Substrate", "CYP2C9_Inhibitor", "CYP2D6_Inhibitor", "CYP3A4_Inhibitor"], description: "Hepatic metabolism & CYP enzyme interactions" },
     { id: "plasma", label: "Plasma / Blood", nx: -0.22, ny: 0.20, radius: 0.08, relatedProperties: ["PPBR_AZ", "VDss_Lombardo"], description: "Plasma protein binding & volume of distribution" },
     { id: "kidneys", label: "Kidneys", nx: 0.18, ny: -0.08, radius: 0.09, relatedProperties: ["Clearance_Hepatocyte", "Clearance_Microsome", "Half_Life"], description: "Renal clearance & half-life" },
     { id: "intestine", label: "GI Tract", nx: 0.0, ny: -0.18, radius: 0.10, relatedProperties: ["HIA_Hou", "Solubility_AqSolDB", "Caco2_Wang"], description: "GI absorption & solubility" },
];

/* -------------------------------------------------------
   MOCK API
------------------------------------------------------- */
async function runToxicityAnalysis(smiles: string): Promise<AdmetPrediction[]> {
     // ML Servisinizin çalıştığı portu (genelde 8000'dir) kontrol edin.
     const response = await fetch("http://localhost:8000/analyze_toxicity", {
          method: "POST",
          headers: {
               "Content-Type": "application/json",
          },
          body: JSON.stringify({ smiles }),
     });

     if (!response.ok) {
          throw new Error("Failed to fetch ADMET data");
     }

     return response.json();
}

/* -------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------- */
export interface CTImagePopup {
     visible: boolean;
     onHide: () => void;
}

const CTImagePopup: React.FC<CTImagePopup> = ({ visible, onHide }) => {
     const [step, setStep] = useState(0);
     const [smiles, setSmiles] = useState("");
     const [drugName, setDrugName] = useState("");
     const [analyzing, setAnalyzing] = useState(false);
     const [scanStep, setScanStep] = useState<number>(-2);
     const [predictions, setPredictions] = useState<AdmetPrediction[]>([]);
     const [activeRegion, setActiveRegion] = useState<string | null>(null);

     const [datasets, setDatasets] = useState<any[]>([]);
     const [search, setSearch] = useState("");
     const [isPopupVisible, setPopupVisible] = useState(false);
     const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

     // İlaç listesi popup'ı açıldığında verileri API'den çeker
     useEffect(() => {
          if (isPopupVisible && datasets.length === 0) {
               loadCandidates();
          }
     }, [isPopupVisible]);

     const loadCandidates = async () => {
          try {
               const res = await fetch("http://localhost:5001/api/DrugCandidate");
               const data = await res.json();
               const formattedData = data.map((d: any) => ({
                    id: d.id,
                    name: "Drug Candidate",
                    smiles: d.smiles,
                    QED: d.qedScore,
                    MW: d.mwScore,
                    downloaded: new Date(d.createdAt).toLocaleDateString(),
                    preview: d.moleculeImage
               }));
               setDatasets(formattedData);
          } catch (err) {
               console.error("Failed to load candidates", err);
               notify("Failed to load candidates from database", "error", 2000);
          }
     };

     // Hem butondan hem de dataset listesinden çağırılabilir
     const handleAnalyze = async (overrideSmiles?: string | React.MouseEvent) => {
          // React event'inden mi tetiklendi yoksa doğrudan string mi gönderildi kontrolü
          const targetSmiles = typeof overrideSmiles === 'string' ? overrideSmiles : smiles;

          if (!targetSmiles.trim()) {
               notify("SMILES string required.", "warning", 2000);
               return;
          }

          setSmiles(targetSmiles);
          setStep(1);
          setAnalyzing(true);
          setScanStep(0);
          setPredictions([]);
          setActiveRegion(null);

          timers.current.forEach(clearTimeout); timers.current = [];

          const predPromise = runToxicityAnalysis(targetSmiles.trim());

          BODY_REGIONS.forEach((_, i) => {
               timers.current.push(setTimeout(() => setScanStep(i), 360 * i));
          });

          try {
               const preds = await predPromise;
               timers.current.push(setTimeout(() => {
                    setScanStep(-1); setPredictions(preds); setAnalyzing(false); setStep(2);
               }, 360 * BODY_REGIONS.length + 300));
          } catch {
               notify("Analysis failed.", "error", 2500);
               setAnalyzing(false);
          }
     };

     // İlaç tıklandığında popup'ı kapatır ve analiz sürecini başlatır
     const handleSelectCandidate = (candidateSmiles: string) => {
          setPopupVisible(false);
          handleAnalyze(candidateSmiles);
     };

     const handleClose = () => {
          timers.current.forEach(clearTimeout);
          setStep(0); setSmiles(""); setDrugName(""); setAnalyzing(false);
          setScanStep(-2); setPredictions([]); setActiveRegion(null);
          onHide();
     };

     const filtered = datasets.filter((ds) =>
          search.trim().length === 0 || ds.smiles.toLowerCase().includes(search.toLowerCase())
     );

     const activeReg = BODY_REGIONS.find(r => r.id === activeRegion);
     const regionPreds = predictions.filter(p => activeReg?.relatedProperties.includes(p.property));
     const toxicCount = predictions.filter(p => p.toxic).length;

     const inputStyle: React.CSSProperties = {
          width: "100%", background: "rgba(0,150,255,0.06)",
          border: "1px solid rgba(0,200,255,0.25)", borderRadius: 4,
          color: "#b0e8ff", padding: "7px 10px", fontSize: 12,
          fontFamily: "monospace", outline: "none", boxSizing: "border-box", cursor: "pointer"
     };

     return (
          <>
               {/* 1. ANA ANALİZ EKRANI POPUP'I */}
               <Popup visible={visible} onHiding={handleClose} dragEnabled={false} showTitle title="Toxicity Analysis" width={1500} height={800} showCloseButton>
                    <div style={{
                         display: "flex", flexDirection: "column", height: "100%",
                         background: "#030d1a", color: "#b0e8ff", padding: "16px 16px 12px",
                         borderRadius: 6, fontFamily: "monospace"
                    }}>

                         <div style={{ display: "flex", gap: 18, flex: 1, overflow: "hidden" }}>

                              {/* SOL BÖLÜM: KONTROLLER */}
                              <div style={{ width: 290, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
                                   <div>
                                        <div style={{ fontSize: 9, color: "rgba(0,200,255,0.45)", letterSpacing: "0.1em", marginBottom: 5 }}>SELECT DRUG CANDIDATE</div>
                                        <button onClick={() => setPopupVisible(true)} style={inputStyle}>[ BROWSE DATABASE ]</button>
                                   </div>
                                   <div>
                                        <div style={{ fontSize: 9, color: "rgba(0,200,255,0.45)", letterSpacing: "0.1em", marginBottom: 5 }}>SMILES STRING *</div>
                                        <textarea value={smiles} onChange={e => setSmiles(e.target.value)}
                                             placeholder="CC(C)n1nc(-c2ccc(F)..."
                                             rows={4} style={{ ...inputStyle, color: "#00ffaa", resize: "vertical", lineHeight: 1.5, fontSize: 11, cursor: "text" }} />
                                   </div>
                                   <button onClick={handleAnalyze} disabled={analyzing || !smiles.trim()} style={{
                                        background: "rgba(0,200,255,0.10)", border: "1px solid rgba(0,200,255,0.45)",
                                        borderRadius: 4, color: analyzing ? "rgba(0,200,255,0.35)" : "#00ccff",
                                        fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em",
                                        padding: "10px 0", cursor: analyzing ? "not-allowed" : "pointer", transition: "all .2s",
                                   }}>{analyzing ? "[ SCANNING... ]" : "[ RUN ADMET ANALYSIS ]"}</button>

                                   {step === 2 && (
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                                             {[
                                                  { label: "TOTAL", val: predictions.length, color: "#00ccff" },
                                                  { label: "FLAGS", val: toxicCount, color: toxicCount > 0 ? "#ff5555" : "#00ff88" },
                                                  { label: "CLEAR", val: predictions.length - toxicCount, color: "#00ff88" },
                                                  { label: "REGIONS", val: BODY_REGIONS.length, color: "#88aaff" },
                                             ].map(({ label, val, color }) => (
                                                  <div key={label} style={{ background: "rgba(0,150,255,0.07)", border: "1px solid rgba(0,200,255,0.13)", borderRadius: 4, padding: "8px 10px" }}>
                                                       <div style={{ fontSize: 8, color: "rgba(0,200,255,0.4)", letterSpacing: "0.1em" }}>{label}</div>
                                                       <div style={{ fontSize: 20, fontWeight: 700, color }}>{val}</div>
                                                  </div>
                                             ))}
                                        </div>
                                   )}

                                   {activeReg && step === 2 && (
                                        <div style={{ background: "rgba(0,150,255,0.07)", border: "1px solid rgba(0,200,255,0.3)", borderRadius: 4, padding: "10px 12px" }}>
                                             <div style={{ fontSize: 10, color: "#00ccff", fontWeight: 700, marginBottom: 3 }}>{activeReg.label.toUpperCase()}</div>
                                             <div style={{ fontSize: 9, color: "rgba(0,200,255,0.45)", marginBottom: 8 }}>{activeReg.description}</div>
                                             {regionPreds.length === 0
                                                  ? <div style={{ fontSize: 9, color: "rgba(0,200,255,0.3)" }}>No mapped properties.</div>
                                                  : regionPreds.map(p => (
                                                       <div key={p.property} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid rgba(0,200,255,0.08)", fontSize: 10 }}>
                                                            <span style={{ color: "rgba(0,200,255,0.65)" }}>{p.property}</span>
                                                            <span style={{
                                                                 background: p.toxic ? "rgba(255,50,50,0.15)" : "rgba(0,255,136,0.12)",
                                                                 border: `1px solid ${p.toxic ? "rgba(255,80,80,0.3)" : "rgba(0,255,136,0.25)"}`,
                                                                 color: p.toxic ? "#ff6666" : "#00ff88", padding: "0 6px", borderRadius: 3, fontSize: 9, fontWeight: 700,
                                                            }}>{p.value < 2 ? p.value.toFixed(2) : p.value.toFixed(1)} {p.toxic ? "!" : "✓"}</span>
                                                       </div>
                                                  ))}
                                        </div>
                                   )}
                              </div>

                              {/* SAĞ BÖLÜM: DETAYLI RAPOR */}
                              {step === 2 && (
                                   <div style={{ width: 280, overflowY: "auto", border: "1px solid rgba(0,200,255,0.14)", borderRadius: 6, padding: "12px 14px", background: "rgba(0,10,28,0.6)" }}>
                                        <div style={{ fontSize: 9, color: "rgba(0,200,255,0.45)", letterSpacing: "0.1em", marginBottom: 12, borderBottom: "1px solid rgba(0,200,255,0.1)", paddingBottom: 6 }}>
                                             ADMET REPORT{drugName ? ` — ${drugName.toUpperCase()}` : ""}
                                        </div>
                                        {(["toxicity", "absorption", "distribution", "metabolism", "excretion"] as const).map(cat => {
                                             const group = predictions.filter(p => p.category === cat);
                                             if (!group.length) return null;
                                             return (
                                                  <div key={cat} style={{ marginBottom: 12 }}>
                                                       <div style={{ fontSize: 8, color: "rgba(0,200,255,0.35)", letterSpacing: "0.12em", marginBottom: 5, borderBottom: "1px solid rgba(0,200,255,0.08)", paddingBottom: 3 }}>
                                                            {cat.toUpperCase()}
                                                       </div>
                                                       {group.map(p => (
                                                            <div key={p.property} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: "1px solid rgba(0,200,255,0.06)", fontSize: 10 }}>
                                                                 <span style={{ color: "rgba(0,200,255,0.65)" }}>{p.property}</span>
                                                                 <span style={{
                                                                      background: p.toxic ? "rgba(255,50,50,0.15)" : "rgba(0,255,136,0.12)",
                                                                      border: `1px solid ${p.toxic ? "rgba(255,80,80,0.3)" : "rgba(0,255,136,0.25)"}`,
                                                                      color: p.toxic ? "#ff6666" : "#00ff88", padding: "1px 7px", borderRadius: 3, fontSize: 9, fontWeight: 700,
                                                                 }}>{p.value < 2 ? p.value.toFixed(2) : p.value.toFixed(1)}</span>
                                                            </div>
                                                       ))}
                                                  </div>
                                             );
                                        })}
                                        <button onClick={() => notify("PDF export triggered.", "success", 2000)} style={{
                                             marginTop: 8, width: "100%", background: "rgba(0,200,255,0.08)",
                                             border: "1px solid rgba(0,200,255,0.35)", borderRadius: 4, color: "#00ccff",
                                             fontFamily: "monospace", fontSize: 10, letterSpacing: "0.08em", padding: "8px 0", cursor: "pointer",
                                        }}>[ EXPORT PDF ]</button>
                                   </div>
                              )}
                         </div>

                         <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                              <button onClick={handleClose} style={{
                                   background: "transparent", border: "1px solid rgba(0,200,255,0.22)", borderRadius: 4,
                                   color: "rgba(0,200,255,0.45)", fontFamily: "monospace", fontSize: 10, letterSpacing: "0.08em",
                                   padding: "6px 18px", cursor: "pointer",
                              }}>[ CLOSE ]</button>
                         </div>
                    </div>
               </Popup>

               {/* 2. VERİ SETİ ARAMA POPUP'I (Kardeş Komponent Olarak Eklendi) */}
               <Popup
                    visible={isPopupVisible}
                    onHiding={() => setPopupVisible(false)}
                    dragEnabled={true}
                    showTitle={true}
                    title="[ BROWSE DRUG CANDIDATES ]"
                    width={850}
                    height={650}
                    showCloseButton={true}
               >
                    <div style={{
                         display: "flex", flexDirection: "column", height: "100%", gap: "16px",
                         background: "#030d1a", color: "#b0e8ff", padding: "10px 10px 20px 10px",
                         fontFamily: "monospace"
                    }}>

                         {/* ARAMA ÇUBUĞU */}
                         <input
                              type="text"
                              placeholder="[ SEARCH BY SMILES ] ..."
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              style={{
                                   padding: "14px 18px",
                                   borderRadius: "6px",
                                   border: "1px solid rgba(0,200,255,0.3)",
                                   outline: "none",
                                   background: "rgba(0,150,255,0.06)",
                                   color: "#00ffaa",
                                   fontFamily: "monospace",
                                   fontSize: "14px",
                                   letterSpacing: "0.08em",
                                   boxShadow: "inset 0 0 12px rgba(0,0,0,0.5)"
                              }}
                         />

                         {/* İLAÇ LİSTESİ */}
                         <div style={{
                              flex: 1,
                              minHeight: 0,
                              overflowY: "auto",
                              display: "flex",
                              flexDirection: "column",
                              gap: "16px",
                              marginTop: "10px",
                              paddingRight: "8px",
                              // SCROLLBAR TASARIMI (Chrome, Safari ve Edge için)
                              scrollbarWidth: "thin",          // Firefox
                              scrollbarColor: "rgba(0,200,255,0.3) transparent"
                         }}>
                              <style>{`
            div::-webkit-scrollbar {
            width: 6px;
            }
        div::-webkit-scrollbar-track {
            background: transparent;
        }
        div::-webkit-scrollbar-thumb {
            background: rgba(0, 200, 255, 0.2);
            border-radius: 10px;
            border: 1px solid rgba(0, 200, 255, 0.1);
        }
        div::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 255, 170, 0.4);
        }
    `}</style>
                              {filtered.map((ds) => (
                                   <div
                                        key={ds.id}
                                        onClick={() => handleSelectCandidate(ds.smiles)}
                                        style={{
                                             display: "flex", gap: "24px", padding: "16px 20px", cursor: "pointer",
                                             border: "1px solid rgba(0,200,255,0.15)", borderRadius: "8px", alignItems: "center",
                                             backgroundColor: "rgba(0,150,255,0.04)", transition: "all 0.3s ease"
                                        }}
                                        onMouseEnter={(e) => {
                                             e.currentTarget.style.backgroundColor = "rgba(0,200,255,0.12)";
                                             e.currentTarget.style.border = "1px solid rgba(0,200,255,0.5)";
                                             e.currentTarget.style.boxShadow = "0 0 20px rgba(0,200,255,0.15)";
                                        }}
                                        onMouseLeave={(e) => {
                                             e.currentTarget.style.backgroundColor = "rgba(0,150,255,0.04)";
                                             e.currentTarget.style.border = "1px solid rgba(0,200,255,0.15)";
                                             e.currentTarget.style.boxShadow = "none";
                                        }}
                                   >
                                        {/* MOLEKÜL GÖRSELİ */}
                                        <div style={{
                                             background: "rgba(255,255,255,0.03)",
                                             border: "1px solid rgba(0,200,255,0.2)",
                                             borderRadius: "6px",
                                             padding: "6px",
                                             display: "flex", alignItems: "center", justifyContent: "center"
                                        }}>
                                             <img src={ds.preview} alt="molecule" style={{ width: "100px", height: "100px", objectFit: "contain" }} />
                                        </div>

                                        {/* MOLEKÜL DETAYLARI */}
                                        <div style={{ display: "flex", flexDirection: "column", fontSize: "14px", flex: 1 }}>

                                             {/* SMILES DİZİSİ */}
                                             <div style={{ marginBottom: "12px", fontSize: "15px", lineHeight: "1.4" }}>
                                                  <b style={{ color: "rgba(0,200,255,0.5)", letterSpacing: "0.1em" }}>SMILES:</b>
                                                  <span style={{ color: "#00ffaa", marginLeft: "10px", wordBreak: "break-all" }}>
                                                       {ds.smiles ? ds.smiles.substring(0, 50) + (ds.smiles.length > 50 ? "..." : "") : "N/A"}
                                                  </span>
                                             </div>

                                             {/* ROZETLER (BADGES) */}
                                             <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "12px" }}>
                                                  <div style={{ background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.25)", padding: "6px 12px", borderRadius: "4px" }}>
                                                       <b style={{ color: "rgba(0,255,136,0.6)", fontSize: "12px", letterSpacing: "0.1em" }}>QED:</b>
                                                       <span style={{ color: "#00ff88", fontWeight: "bold", marginLeft: "6px", fontSize: "15px" }}>
                                                            {ds.QED?.toFixed(2) || ds.QED}
                                                       </span>
                                                  </div>
                                                  <div style={{ background: "rgba(0,200,255,0.08)", border: "1px solid rgba(0,200,255,0.25)", padding: "6px 12px", borderRadius: "4px" }}>
                                                       <b style={{ color: "rgba(0,200,255,0.6)", fontSize: "12px", letterSpacing: "0.1em" }}>MW:</b>
                                                       <span style={{ color: "#00ccff", fontWeight: "bold", marginLeft: "6px", fontSize: "15px" }}>
                                                            {ds.MW?.toFixed(2) || ds.MW}
                                                       </span>
                                                  </div>
                                             </div>

                                             {/* TARİH */}
                                             <div style={{ fontSize: "11px", color: "rgba(0,200,255,0.35)", letterSpacing: "0.1em", marginTop: "auto" }}>
                                                  <b>[ GENERATED ON: {ds.downloaded} ]</b>
                                             </div>

                                        </div>
                                   </div>
                              ))}

                              {/* BOŞ DURUM MESAJI */}
                              {filtered.length === 0 && (
                                   <div style={{ textAlign: "center", marginTop: "60px", color: "rgba(0,200,255,0.3)", fontSize: "16px", letterSpacing: "0.1em" }}>
                                        [ NO CANDIDATES FOUND MATCHING CRITERIA ]
                                   </div>
                              )}
                         </div>
                    </div>
               </Popup>
          </>
     );
};

export default CTImagePopup;