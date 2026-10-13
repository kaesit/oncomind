import React, { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import { Database, FileDown, FlaskConical, Play } from "lucide-react";
import notify from "../dashboard/ui/notify";
import { Button, Dialog, Empty, SearchInput, Textarea } from "../dashboard/ui";
import { AnatomyView } from "../dashboard/anatomy/AnatomyView";

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

var toxicity_results: AdmetPrediction[] = [];
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

  toxicity_results = await response.json();
  return toxicity_results;
}

function regionStatus(r: BodyRegion, preds: AdmetPrediction[]): "toxic" | "safe" | "neutral" {
  const rel = preds.filter(p => r.relatedProperties.includes(p.property));
  if (!rel.length) return "neutral";
  return rel.some(p => p.toxic) ? "toxic" : "safe";
}

/* -------------------------------------------------------
   STEP INDICATOR
------------------------------------------------------- */
const STEPS = ["Enter SMILES", "Scanning", "Results"];
function StepBar({ current }: { current: number }) {
  return (
    <div className="om-steps" role="list" aria-label="Progress">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className="om-step" role="listitem" data-state={i < current ? "done" : i === current ? "current" : "todo"}>
            <span className="om-step-num">{i + 1}</span>
            {s}
          </div>
          {i < STEPS.length - 1 && <span className="om-step-line" data-done={i < current} />}
        </React.Fragment>
      ))}
    </div>
  );
}

/* small value pill used in both the region panel and the report */
function ValueTag({ p, withMark }: { p: AdmetPrediction; withMark?: boolean }) {
  return (
    <span
      className="om-pill om-pill--tone"
      style={{ "--tone": p.toxic ? "var(--om-urgent)" : "var(--om-stable)", height: 22, fontVariantNumeric: "tabular-nums" } as React.CSSProperties}
    >
      {p.value < 2 ? p.value.toFixed(2) : p.value.toFixed(1)}
      {withMark ? (p.toxic ? " !" : " ✓") : ""}
    </span>
  );
}

/* -------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------- */
export interface ToxicityPopupProps {
  visible: boolean;
  onHide: () => void;
}

const ToxicityAnalysisPopup: React.FC<ToxicityPopupProps> = ({ visible, onHide }) => {
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


  function export_pdf() {
    var doc = new jsPDF();
    // FALSE !!! const results = runToxicityAnalysis();

    console.log(toxicity_results);
    toxicity_results.forEach((result, index) => {
      doc.text(`Property: ${result.property}, Value:${result.value} Toxic: ${result.toxic}`, 20, 20 + index * 10);
    });

    doc.save('results.pdf');

  }

  const activeReg = BODY_REGIONS.find(r => r.id === activeRegion);
  const regionPreds = predictions.filter(p => activeReg?.relatedProperties.includes(p.property));
  const toxicCount = predictions.filter(p => p.toxic).length;

  return (
    <>
      {/* 1. ANA ANALİZ EKRANI */}
      <Dialog
        open={visible}
        onOpenChange={(o) => !o && handleClose()}
        title="Toxicity Analysis"
        description="ADMET prediction mapped onto the body"
        width={1500}
        bodyStyle={{ display: "flex", flexDirection: "column", gap: 16, height: "min(720px, calc(100vh - 120px))" }}
        footer={<Button onClick={handleClose}>Close</Button>}
      >
        <StepBar current={step} />

        <div className="om-tox-grid">
          {/* SOL BÖLÜM: KONTROLLER */}
          <div className="om-stack" style={{ overflowY: "auto", gap: 12 }}>
            <div className="om-field">
              <span className="om-label">Select drug candidate</span>
              <Button icon={<Database size={16} />} onClick={() => setPopupVisible(true)} block>
                Browse database
              </Button>
            </div>
            <div className="om-field">
              <label className="om-label" htmlFor="tox-smiles">SMILES string *</label>
              <Textarea
                id="tox-smiles"
                className="om-mono"
                value={smiles}
                onChange={e => setSmiles(e.target.value)}
                placeholder="CC(C)n1nc(-c2ccc(F)..."
                rows={4}
                style={{ fontSize: 12 }}
              />
            </div>
            <Button variant="primary" icon={<Play size={16} />} loading={analyzing} onClick={handleAnalyze} disabled={analyzing || !smiles.trim()} block>
              {analyzing ? "Scanning..." : "Run ADMET analysis"}
            </Button>

            {step === 2 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "Total", val: predictions.length, color: "var(--om-text)" },
                  { label: "Flags", val: toxicCount, color: toxicCount > 0 ? "var(--om-urgent)" : "var(--om-stable)" },
                  { label: "Clear", val: predictions.length - toxicCount, color: "var(--om-stable)" },
                  { label: "Regions", val: BODY_REGIONS.length, color: "var(--om-text)" },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ background: "var(--om-surface-2)", borderRadius: 14, padding: "10px 12px" }}>
                    <div className="om-hint">{label}</div>
                    <div className="om-dot-number om-dot-number--sm" style={{ color }}>{val}</div>
                  </div>
                ))}
              </div>
            )}

            {!activeReg && step === 2 && (
              <div className="om-hint" style={{ padding: "2px 2px" }}>Click an organ or its label to see the related properties.</div>
            )}

            {activeReg && step === 2 && (
              <div style={{ background: "var(--om-surface-2)", borderRadius: 16, padding: "12px 14px" }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{activeReg.label}</div>
                <div className="om-hint" style={{ marginBottom: 8 }}>{activeReg.description}</div>
                {regionPreds.length === 0
                  ? <div className="om-hint">No mapped properties.</div>
                  : regionPreds.map(p => (
                    <div key={p.property} className="om-tox-row">
                      <span>{p.property}</span>
                      <ValueTag p={p} withMark />
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* ORTA BÖLÜM: ANATOMİ */}
          <div className="om-tox-screen">
            <AnatomyView regions={BODY_REGIONS} predictions={predictions} scanStep={scanStep} activeRegion={activeRegion} onRegionClick={id => setActiveRegion(id || null)} />
          </div>

          {/* SAĞ BÖLÜM: DETAYLI RAPOR */}
          <div className="om-tox-report">
            {step === 2 ? (
              <>
                <div className="om-card-head" style={{ marginBottom: 8 }}>
                  <h3 className="om-card-title">ADMET report{drugName ? ` — ${drugName}` : ""}</h3>
                </div>
                {(["toxicity", "absorption", "distribution", "metabolism", "excretion"] as const).map(cat => {
                  const group = predictions.filter(p => p.category === cat);
                  if (!group.length) return null;
                  return (
                    <div key={cat} style={{ marginBottom: 14 }}>
                      <div className="om-nav-label" style={{ padding: "0 0 4px" }}>{cat}</div>
                      {group.map(p => (
                        <div key={p.property} className="om-tox-row">
                          <span>{p.property}</span>
                          <ValueTag p={p} />
                        </div>
                      ))}
                    </div>
                  );
                })}
                <Button icon={<FileDown size={16} />} onClick={() => export_pdf()} block>
                  Export PDF
                </Button>
              </>
            ) : (
              <Empty icon={<FlaskConical size={26} />} title={step === 1 ? "Scanning…" : "No report yet"}>
                {step === 1 ? "Mapping predictions to body regions." : "Run an analysis to see the ADMET report."}
              </Empty>
            )}
          </div>
        </div>
      </Dialog>

      {/* 2. VERİ SETİ ARAMA */}
      <Dialog
        open={isPopupVisible}
        onOpenChange={setPopupVisible}
        title="Browse drug candidates"
        description="Pick a molecule to analyse it straight away"
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

export default ToxicityAnalysisPopup;
