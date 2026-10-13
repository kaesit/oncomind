import React, { useState, useRef, useEffect, useCallback } from "react";
import { Database, ScanLine, Wrench } from "lucide-react";
import notify from "../dashboard/ui/notify";
import { Button, Dialog, Empty, SearchInput } from "../dashboard/ui";

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
               const res = await fetch("http://localhost:5000/api/DrugCandidate");
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

     return (
          <>
               {/* 1. ANA ANALİZ EKRANI */}
               <Dialog
                    open={visible}
                    onOpenChange={(o) => !o && handleClose()}
                    title="CT Image Analysis"
                    description="Work in progress — bounding boxes and tools are not wired up yet"
                    width={1500}
                    bodyStyle={{ height: "min(640px, calc(100vh - 120px))" }}
                    footer={<Button onClick={handleClose}>Close</Button>}
               >
                    <div className="om-tox-grid" style={{ gridTemplateColumns: "290px minmax(0, 1fr)", height: "100%" }}>
                         <div className="om-stack" style={{ gap: 12 }}>
                              <div className="om-field">
                                   <span className="om-label">Select CT images</span>
                                   <Button icon={<Database size={16} />} onClick={() => setPopupVisible(true)} block>
                                        Browse database
                                   </Button>
                              </div>
                              <Button variant="primary" icon={<ScanLine size={16} />} onClick={handleAnalyze} disabled={analyzing || !smiles.trim()} block>
                                   Draw bounding boxes
                              </Button>
                              <div className="om-field" style={{ marginTop: 8 }}>
                                   <span className="om-label">Select or add your tool</span>
                                   <Button icon={<Wrench size={16} />} onClick={() => setPopupVisible(true)} block>
                                        Browse database
                                   </Button>
                              </div>
                              <Button variant="primary" icon={<ScanLine size={16} />} onClick={handleAnalyze} disabled={analyzing || !smiles.trim()} block>
                                   Draw bounding boxes
                              </Button>
                         </div>
                         <div className="om-tox-report" style={{ display: "grid", placeItems: "center" }}>
                              <Empty icon={<ScanLine size={28} />} title="No CT image selected">
                                   Choose an image from the database to start.
                              </Empty>
                         </div>
                    </div>
               </Dialog>

               {/* 2. VERİ SETİ ARAMA */}
               <Dialog
                    open={isPopupVisible}
                    onOpenChange={setPopupVisible}
                    title="Browse drug candidates"
                    width={850}
                    bodyStyle={{ display: "flex", flexDirection: "column", gap: 14, height: "min(560px, calc(100vh - 140px))" }}
               >
                    <SearchInput placeholder="Search by SMILES..." value={search} onChange={setSearch} />

                    <div className="om-stack" style={{ overflowY: "auto", gap: 8, minHeight: 0, flex: 1 }}>
                         {filtered.map((ds) => (
                              <button key={ds.id} className="om-candidate" onClick={() => handleSelectCandidate(ds.smiles)}>
                                   <div className="om-media om-media--contain" style={{ width: 96, height: 96, aspectRatio: "1", flex: "none" }}>
                                        {ds.preview && <img src={ds.preview} alt="molecule" loading="lazy" />}
                                   </div>
                                   <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0, flex: 1 }}>
                                        <span className="om-mono" style={{ fontSize: 13, wordBreak: "break-all", color: "var(--om-text)" }}>
                                             {ds.smiles ? ds.smiles.substring(0, 50) + (ds.smiles.length > 50 ? "..." : "") : "N/A"}
                                        </span>
                                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                             <span className="om-pill om-pill--lime">QED {ds.QED?.toFixed(2) || ds.QED}</span>
                                             <span className="om-pill">MW {ds.MW?.toFixed(2) || ds.MW}</span>
                                             <span className="om-pill">Generated on {ds.downloaded}</span>
                                        </div>
                                   </div>
                              </button>
                         ))}

                         {/* BOŞ DURUM MESAJI */}
                         {filtered.length === 0 && <Empty title="No candidates found matching criteria" />}
                    </div>
               </Dialog>
          </>
     );
};

export default CTImagePopup;
