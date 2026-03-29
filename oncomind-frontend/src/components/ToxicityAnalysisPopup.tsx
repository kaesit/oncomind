import React, { useState, useRef, useEffect, useCallback } from "react";
import { Popup } from "devextreme-react/popup";
import { Button } from "devextreme-react/button";
import TextBox from "devextreme-react/text-box";
import TextArea from "devextreme-react/text-area";
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
  // 3D body point: x/y in -1..1 normalized space (front view)
  nx: number; ny: number;
  radius: number; // hitbox radius in normalized units
  relatedProperties: string[];
  description: string;
}

/* -------------------------------------------------------
   BODY REGIONS — normalized coordinates on a human figure
   (0,0) = center of figure, y goes UP, x goes RIGHT
------------------------------------------------------- */
const BODY_REGIONS: BodyRegion[] = [
  { id: "brain",     label: "CNS / Brain",    nx:  0.00, ny:  0.82, radius: 0.13,
    relatedProperties: ["BBB_Martini","CNS_MPO","MDCK"],
    description: "Blood-brain barrier penetration & CNS activity" },
  { id: "heart",     label: "Heart",          nx: -0.08, ny:  0.38, radius: 0.09,
    relatedProperties: ["hERG","Pgp_Inhibitor"],
    description: "Cardiac toxicity via hERG channel blockade" },
  { id: "lungs",     label: "Lungs",          nx:  0.18, ny:  0.36, radius: 0.10,
    relatedProperties: ["Caco2_Wang","PAMPA_NCATS"],
    description: "Pulmonary absorption & permeability" },
  { id: "liver",     label: "Liver",          nx:  0.10, ny:  0.18, radius: 0.12,
    relatedProperties: ["CYP2D6_Substrate","CYP3A4_Substrate","CYP2C9_Inhibitor","CYP2D6_Inhibitor","CYP3A4_Inhibitor"],
    description: "Hepatic metabolism & CYP enzyme interactions" },
  { id: "plasma",    label: "Blood / Plasma", nx: -0.20, ny:  0.25, radius: 0.08,
    relatedProperties: ["PPBR_AZ","VDss_Lombardo"],
    description: "Plasma protein binding & volume of distribution" },
  { id: "kidneys",   label: "Kidneys",        nx:  0.18, ny: -0.02, radius: 0.09,
    relatedProperties: ["Clearance_Hepatocyte","Clearance_Microsome","Half_Life"],
    description: "Renal clearance & half-life" },
  { id: "intestine", label: "GI Tract",       nx:  0.00, ny: -0.15, radius: 0.11,
    relatedProperties: ["HIA_Hou","Solubility_AqSolDB","Caco2_Wang"],
    description: "Gastrointestinal absorption & solubility" },
];

/* -------------------------------------------------------
   MOCK — replace with real Flask endpoint
------------------------------------------------------- */
async function runToxicityAnalysis(smiles: string): Promise<AdmetPrediction[]> {
  // TODO: replace with your real endpoint
  // const res = await fetch("/api/toxicity/analyze", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ smiles }),
  // });
  // return res.json();
  await new Promise(r => setTimeout(r, 1400));
  return [
    { property: "hERG",                  category: "toxicity",     value: 0.82, toxic: true  },
    { property: "BBB_Martini",           category: "distribution", value: 0.61, toxic: false },
    { property: "CYP3A4_Inhibitor",      category: "metabolism",   value: 0.77, toxic: true  },
    { property: "CYP2D6_Inhibitor",      category: "metabolism",   value: 0.29, toxic: false },
    { property: "CYP2C9_Inhibitor",      category: "metabolism",   value: 0.55, toxic: true  },
    { property: "HIA_Hou",               category: "absorption",   value: 0.95, toxic: false },
    { property: "PPBR_AZ",              category: "distribution", value: 87.4, toxic: false },
    { property: "Caco2_Wang",           category: "absorption",   value: 0.88, toxic: false },
    { property: "Clearance_Hepatocyte", category: "excretion",    value: 0.44, toxic: false },
    { property: "Solubility_AqSolDB",   category: "absorption",   value: 0.38, toxic: false },
  ];
}

/* -------------------------------------------------------
   3D HOLOGRAM BODY CANVAS
------------------------------------------------------- */
interface HologramCanvasProps {
  width: number;
  height: number;
  predictions: AdmetPrediction[];
  scanStep: number; // -2=idle, -1=all done, 0..N=scanning index
  activeRegion: string | null;
  onRegionClick: (id: string) => void;
}

function regionStatus(region: BodyRegion, predictions: AdmetPrediction[]): "toxic" | "safe" | "neutral" {
  const rel = predictions.filter(p => region.relatedProperties.includes(p.property));
  if (rel.length === 0) return "neutral";
  return rel.some(p => p.toxic) ? "toxic" : "safe";
}

const HologramCanvas: React.FC<HologramCanvasProps> = ({
  width, height, predictions, scanStep, activeRegion, onRegionClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const particlesRef = useRef<{ x: number; y: number; vy: number; opacity: number; color: string }[]>([]);

  // Map normalized coords to canvas pixels
  const toCanvas = useCallback((nx: number, ny: number) => {
    const cx = width / 2 + nx * (width * 0.28);
    const cy = height * 0.5 - ny * (height * 0.42);
    return { cx, cy };
  }, [width, height]);

  // Init particles
  useEffect(() => {
    particlesRef.current = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vy: -0.3 - Math.random() * 0.5,
      opacity: Math.random(),
      color: Math.random() > 0.5 ? "#00ffcc" : "#0088ff",
    }));
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const draw = (t: number) => {
      timeRef.current = t * 0.001;
      const time = timeRef.current;
      ctx.clearRect(0, 0, width, height);

      // Background: deep space
      ctx.fillStyle = "#030d1a";
      ctx.fillRect(0, 0, width, height);

      // Grid lines — holographic floor grid
      ctx.strokeStyle = "rgba(0,180,255,0.06)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 24) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += 24) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Scan line (only during scan phase)
      if (scanStep >= -1 && scanStep !== -2) {
        const scanY = scanStep === -1
          ? -100
          : (height * 0.08) + (scanStep / (BODY_REGIONS.length - 1)) * (height * 0.84);
        const grad = ctx.createLinearGradient(0, scanY - 8, 0, scanY + 8);
        grad.addColorStop(0, "rgba(0,255,200,0)");
        grad.addColorStop(0.5, "rgba(0,255,200,0.35)");
        grad.addColorStop(1, "rgba(0,255,200,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, scanY - 8, width, 16);
        ctx.strokeStyle = "rgba(0,255,200,0.7)";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(width, scanY); ctx.stroke();
      }

      // --- Draw human silhouette with 3D isometric shift ---
      const wobble = Math.sin(time * 0.8) * 2;
      ctx.save();
      ctx.translate(width / 2 + wobble, height / 2);

      // Glow base — subtle body aura
      const bodyGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, 120);
      bodyGrad.addColorStop(0, "rgba(0,140,255,0.07)");
      bodyGrad.addColorStop(1, "rgba(0,140,255,0)");
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, 110, 200, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body outline paths (stylized wireframe-ish)
      const scale = height * 0.42;
      ctx.strokeStyle = "rgba(0,200,255,0.55)";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "#00ccff";
      ctx.shadowBlur = 8;

      // Head
      ctx.beginPath();
      ctx.ellipse(0, -0.82 * scale, 0.13 * scale, 0.12 * scale, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Torso (simplified bezier hull)
      ctx.beginPath();
      ctx.moveTo(-0.14 * scale, -0.68 * scale);
      ctx.bezierCurveTo(-0.20 * scale, -0.40 * scale, -0.22 * scale, 0.10 * scale, -0.14 * scale, 0.28 * scale);
      ctx.lineTo(0.14 * scale, 0.28 * scale);
      ctx.bezierCurveTo(0.22 * scale, 0.10 * scale, 0.20 * scale, -0.40 * scale, 0.14 * scale, -0.68 * scale);
      ctx.closePath();
      ctx.stroke();

      // Arms
      [[-1, 0.9], [1, 0.9]].forEach(([side]) => {
        ctx.beginPath();
        ctx.moveTo(side * 0.14 * scale, -0.60 * scale);
        ctx.bezierCurveTo(side * 0.30 * scale, -0.55 * scale, side * 0.32 * scale, -0.20 * scale, side * 0.28 * scale, 0.10 * scale);
        ctx.stroke();
      });

      // Legs
      [[-0.07, 1], [0.07, 1]].forEach(([xOff]) => {
        ctx.beginPath();
        ctx.moveTo(xOff * scale, 0.28 * scale);
        ctx.bezierCurveTo(xOff * scale * 1.2, 0.45 * scale, xOff * scale * 1.1, 0.70 * scale, xOff * scale, 0.90 * scale);
        ctx.stroke();
      });

      ctx.shadowBlur = 0;
      ctx.restore();

      // --- Floating particles ---
      particlesRef.current.forEach(p => {
        p.y += p.vy;
        p.opacity -= 0.003;
        if (p.y < 0 || p.opacity <= 0) {
          p.x = Math.random() * width;
          p.y = height;
          p.opacity = 0.6 + Math.random() * 0.4;
          p.vy = -0.3 - Math.random() * 0.5;
        }
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, "0");
        ctx.fillRect(p.x, p.y, 1.5, 1.5);
      });

      // --- Region markers ---
      BODY_REGIONS.forEach((region, idx) => {
        const isScanned = scanStep === -1 || idx <= scanStep;
        if (!isScanned) return;

        const { cx, cy } = toCanvas(region.nx, -region.ny);
        const status = predictions.length > 0 ? regionStatus(region, predictions) : "neutral";
        const isActive = activeRegion === region.id;

        const colors = {
          toxic:   { core: "#ff3333", glow: "rgba(255,50,50,",   ring: "#ff6666" },
          safe:    { core: "#00ff88", glow: "rgba(0,255,136,",   ring: "#00ffaa" },
          neutral: { core: "#44aaff", glow: "rgba(68,170,255,",  ring: "#88ccff" },
        };
        const c = colors[status];
        const pulse = 0.7 + 0.3 * Math.sin(time * 3 + idx);
        const r = region.radius * width * 0.28;

        // Outer glow ring
        const glowGrad = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 1.8);
        glowGrad.addColorStop(0, c.glow + (isActive ? "0.35" : "0.18") + ")");
        glowGrad.addColorStop(1, c.glow + "0)");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Animated dashed orbit ring
        ctx.save();
        ctx.strokeStyle = c.ring;
        ctx.lineWidth = isActive ? 1.5 : 0.8;
        ctx.globalAlpha = pulse * (isActive ? 1 : 0.6);
        ctx.setLineDash([4, 4]);
        ctx.lineDashOffset = -time * 12;
        ctx.beginPath();
        ctx.arc(cx, cy, r * (isActive ? 1.1 : 0.95), 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Core dot
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = c.core;
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Label callout
        const labelX = cx + (region.nx >= 0 ? r * 1.6 : -r * 1.6);
        const labelAnchor = region.nx >= 0 ? "left" : "right";
        ctx.save();
        ctx.font = "500 11px monospace";
        ctx.fillStyle = c.ring;
        ctx.globalAlpha = isScanned ? 1 : 0;
        ctx.textAlign = labelAnchor as CanvasTextAlign;
        ctx.fillText(region.label.toUpperCase(), labelX, cy - 4);
        if (predictions.length > 0) {
          const rel = predictions.filter(p => region.relatedProperties.includes(p.property));
          const toxCount = rel.filter(p => p.toxic).length;
          ctx.font = "10px monospace";
          ctx.fillStyle = toxCount > 0 ? "#ff8888" : "#88ffcc";
          ctx.fillText(toxCount > 0 ? `${toxCount} FLAG` : "CLEAR", labelX, cy + 10);
        }
        // Connector line
        ctx.strokeStyle = c.ring;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(cx + (region.nx >= 0 ? r * 0.95 : -r * 0.95), cy);
        ctx.lineTo(cx + (region.nx >= 0 ? r * 1.4 : -r * 1.4), cy);
        ctx.stroke();
        ctx.restore();
      });

      // Corner HUD decorations
      ctx.strokeStyle = "rgba(0,200,255,0.4)";
      ctx.lineWidth = 1;
      [[8, 8], [width - 8, 8], [8, height - 8], [width - 8, height - 8]].forEach(([x, y], i) => {
        const d = 14;
        const sx = i % 2 === 0 ? 1 : -1;
        const sy = i < 2 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(x, y + sy * d); ctx.lineTo(x, y); ctx.lineTo(x + sx * d, y);
        ctx.stroke();
      });

      // Status text
      ctx.font = "10px monospace";
      ctx.fillStyle = "rgba(0,200,255,0.5)";
      ctx.textAlign = "left";
      const statusText = scanStep === -2
        ? "AWAITING INPUT"
        : scanStep === -1
        ? "SCAN COMPLETE"
        : `SCANNING... ${Math.round((scanStep / BODY_REGIONS.length) * 100)}%`;
      ctx.fillText(statusText, 16, height - 12);
      ctx.textAlign = "right";
      ctx.fillText(`REGIONS: ${BODY_REGIONS.length}`, width - 16, height - 12);

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [width, height, predictions, scanStep, activeRegion, toCanvas]);

  // Click → hit test regions
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (const region of BODY_REGIONS) {
      const { cx, cy } = toCanvas(region.nx, -region.ny);
      const r = region.radius * width * 0.28 * 1.6;
      if (Math.hypot(mx - cx, my - cy) < r) {
        onRegionClick(region.id);
        return;
      }
    }
    onRegionClick(""); // deselect
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onClick={handleClick}
      style={{ cursor: "crosshair", borderRadius: 8, display: "block" }}
    />
  );
};

/* -------------------------------------------------------
   STEP INDICATOR
------------------------------------------------------- */
const STEPS = ["Enter SMILES", "Scanning", "Results"];

function StepBar({ current }: { current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%",
              background: i <= current ? "#00ccff" : "transparent",
              border: `1.5px solid ${i <= current ? "#00ccff" : "rgba(0,200,255,0.3)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: i <= current ? "#001a2e" : "rgba(0,200,255,0.5)",
              fontSize: 11, fontWeight: 600, fontFamily: "monospace",
              transition: "all .3s",
            }}>{i + 1}</div>
            <span style={{
              fontSize: 10, fontFamily: "monospace",
              color: i === current ? "#00ccff" : "rgba(0,200,255,0.4)",
              letterSpacing: "0.05em",
            }}>{s.toUpperCase()}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              flex: 1, height: 1, margin: "0 8px 18px",
              background: `linear-gradient(90deg, ${i < current ? "#00ccff" : "rgba(0,200,255,0.2)"}, ${i + 1 <= current ? "#00ccff" : "rgba(0,200,255,0.2)"})`,
              transition: "background .4s",
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* -------------------------------------------------------
   MAIN POPUP COMPONENT
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
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const handleAnalyze = async () => {
    if (!smiles.trim()) { notify("Please enter a SMILES string.", "warning", 2000); return; }
    setStep(1);
    setAnalyzing(true);
    setScanStep(0);
    setPredictions([]);
    setActiveRegion(null);
    timers.current.forEach(clearTimeout);
    timers.current = [];

    const predPromise = runToxicityAnalysis(smiles.trim());

    BODY_REGIONS.forEach((_, i) => {
      const t = setTimeout(() => setScanStep(i), 350 * i);
      timers.current.push(t);
    });

    try {
      const preds = await predPromise;
      const totalAnim = 350 * BODY_REGIONS.length + 300;
      const t = setTimeout(() => {
        setScanStep(-1);
        setPredictions(preds);
        setAnalyzing(false);
        setStep(2);
      }, totalAnim);
      timers.current.push(t);
    } catch {
      notify("Analysis failed.", "error", 2500);
      setAnalyzing(false);
    }
  };

  const handleClose = () => {
    timers.current.forEach(clearTimeout);
    setStep(0); setSmiles(""); setDrugName("");
    setAnalyzing(false); setScanStep(-2);
    setPredictions([]); setActiveRegion(null);
    onHide();
  };

  const handleRegionClick = (id: string) => setActiveRegion(prev => prev === id ? null : id || null);

  const activeReg = BODY_REGIONS.find(r => r.id === activeRegion);
  const regionPreds = predictions.filter(p => activeReg?.relatedProperties.includes(p.property));
  const toxicCount = predictions.filter(p => p.toxic).length;

  return (
    <Popup
      visible={visible}
      onHiding={handleClose}
      dragEnabled={false}
      showTitle
      title="Toxicity Analysis"
      width={1120}
      height={680}
      showCloseButton
    >
      {/* Dark sci-fi container */}
      <div style={{
        display: "flex", flexDirection: "column", height: "100%",
        background: "#030d1a", color: "#b0e8ff",
        padding: "16px 16px 12px", borderRadius: 6,
        fontFamily: "monospace",
      }}>
        <StepBar current={step} />

        <div style={{ display: "flex", gap: 20, flex: 1, overflow: "hidden" }}>

          {/* LEFT PANEL */}
          <div style={{ width: 300, display: "flex", flexDirection: "column", gap: 14, overflowY: "auto" }}>

            {/* SMILES input */}
            <div>
              <div style={{ fontSize: 10, color: "#00ccff", letterSpacing: "0.08em", marginBottom: 6 }}>
                COMPOUND NAME (optional)
              </div>
              <input
                value={drugName}
                onChange={e => setDrugName(e.target.value)}
                placeholder="e.g. Imatinib"
                style={{
                  width: "100%", background: "rgba(0,150,255,0.06)",
                  border: "1px solid rgba(0,200,255,0.25)", borderRadius: 4,
                  color: "#b0e8ff", padding: "6px 10px", fontSize: 13,
                  fontFamily: "monospace", outline: "none", boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <div style={{ fontSize: 10, color: "#00ccff", letterSpacing: "0.08em", marginBottom: 6 }}>
                SMILES STRING *
              </div>
              <textarea
                value={smiles}
                onChange={e => setSmiles(e.target.value)}
                placeholder="CC(C)n1nc(-c2ccc(F)c(C#N)c2)c2c(N)ncnc21"
                rows={4}
                style={{
                  width: "100%", background: "rgba(0,150,255,0.06)",
                  border: "1px solid rgba(0,200,255,0.25)", borderRadius: 4,
                  color: "#00ffaa", padding: "8px 10px", fontSize: 11,
                  fontFamily: "monospace", outline: "none", resize: "vertical",
                  boxSizing: "border-box", lineHeight: 1.5,
                }}
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing || !smiles.trim()}
              style={{
                background: analyzing ? "rgba(0,200,255,0.08)" : "rgba(0,200,255,0.12)",
                border: "1px solid rgba(0,200,255,0.5)",
                borderRadius: 4, color: analyzing ? "rgba(0,200,255,0.4)" : "#00ccff",
                fontFamily: "monospace", fontSize: 12, letterSpacing: "0.1em",
                padding: "10px 0", cursor: analyzing ? "not-allowed" : "pointer",
                transition: "all .2s",
              }}
            >
              {analyzing ? "[ SCANNING... ]" : "[ RUN ADMET ANALYSIS ]"}
            </button>

            {/* Stats */}
            {step === 2 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
                {[
                  { label: "TOTAL", val: predictions.length, color: "#00ccff" },
                  { label: "FLAGS", val: toxicCount, color: toxicCount > 0 ? "#ff5555" : "#00ff88" },
                  { label: "CLEAR", val: predictions.length - toxicCount, color: "#00ff88" },
                  { label: "REGIONS", val: BODY_REGIONS.length, color: "#88aaff" },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{
                    background: "rgba(0,150,255,0.06)",
                    border: "1px solid rgba(0,200,255,0.15)",
                    borderRadius: 4, padding: "8px 10px",
                  }}>
                    <div style={{ fontSize: 9, color: "rgba(0,200,255,0.5)", letterSpacing: "0.1em" }}>{label}</div>
                    <div style={{ fontSize: 20, fontWeight: 600, color }}>{val}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Region detail */}
            {activeReg && step === 2 && (
              <div style={{
                background: "rgba(0,150,255,0.06)",
                border: "1px solid rgba(0,200,255,0.3)",
                borderRadius: 4, padding: "10px 12px",
              }}>
                <div style={{ fontSize: 11, color: "#00ccff", fontWeight: 600, marginBottom: 4 }}>
                  {activeReg.label.toUpperCase()}
                </div>
                <div style={{ fontSize: 10, color: "rgba(0,200,255,0.5)", marginBottom: 8 }}>
                  {activeReg.description}
                </div>
                {regionPreds.length === 0 ? (
                  <div style={{ fontSize: 10, color: "rgba(0,200,255,0.35)" }}>No mapped properties</div>
                ) : (
                  regionPreds.map(p => (
                    <div key={p.property} style={{
                      display: "flex", justifyContent: "space-between",
                      padding: "3px 0", borderBottom: "1px solid rgba(0,200,255,0.08)",
                      fontSize: 11,
                    }}>
                      <span style={{ color: "rgba(0,200,255,0.7)" }}>{p.property}</span>
                      <span style={{ color: p.toxic ? "#ff5555" : "#00ff88", fontWeight: 600 }}>
                        {p.value < 2 ? p.value.toFixed(2) : p.value.toFixed(1)}
                        {p.toxic ? " !" : " ✓"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* CENTER — hologram */}
          <div style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid rgba(0,200,255,0.15)", borderRadius: 6, overflow: "hidden",
          }}>
            <HologramCanvas
              width={340}
              height={540}
              predictions={predictions}
              scanStep={scanStep}
              activeRegion={activeRegion}
              onRegionClick={handleRegionClick}
            />
          </div>

          {/* RIGHT — ADMET table */}
          {step === 2 && (
            <div style={{
              width: 290, overflowY: "auto",
              border: "1px solid rgba(0,200,255,0.15)",
              borderRadius: 6, padding: "12px 14px",
              background: "rgba(0,20,40,0.6)",
            }}>
              <div style={{ fontSize: 10, color: "#00ccff", letterSpacing: "0.1em", marginBottom: 12 }}>
                ADMET REPORT {drugName && `— ${drugName.toUpperCase()}`}
              </div>

              {(["toxicity","absorption","distribution","metabolism","excretion"] as const).map(cat => {
                const group = predictions.filter(p => p.category === cat);
                if (!group.length) return null;
                return (
                  <div key={cat} style={{ marginBottom: 14 }}>
                    <div style={{
                      fontSize: 9, color: "rgba(0,200,255,0.45)",
                      letterSpacing: "0.12em", marginBottom: 4,
                      borderBottom: "1px solid rgba(0,200,255,0.1)", paddingBottom: 3,
                    }}>{cat.toUpperCase()}</div>
                    {group.map(p => (
                      <div key={p.property} style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", padding: "4px 0",
                        borderBottom: "1px solid rgba(0,200,255,0.06)",
                        fontSize: 11,
                      }}>
                        <span style={{ color: "rgba(0,200,255,0.65)" }}>{p.property}</span>
                        <span style={{
                          padding: "1px 7px", borderRadius: 3, fontSize: 10, fontWeight: 600,
                          background: p.toxic ? "rgba(255,50,50,0.15)" : "rgba(0,255,136,0.12)",
                          color: p.toxic ? "#ff6666" : "#00ff88",
                          border: `1px solid ${p.toxic ? "rgba(255,80,80,0.3)" : "rgba(0,255,136,0.25)"}`,
                        }}>
                          {p.value < 2 ? p.value.toFixed(2) : p.value.toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}

              <button
                onClick={() => notify("PDF export triggered.", "success", 2000)}
                style={{
                  marginTop: 8, width: "100%",
                  background: "rgba(0,200,255,0.08)",
                  border: "1px solid rgba(0,200,255,0.4)",
                  borderRadius: 4, color: "#00ccff",
                  fontFamily: "monospace", fontSize: 11, letterSpacing: "0.08em",
                  padding: "8px 0", cursor: "pointer",
                }}
              >
                [ EXPORT PDF ]
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <button
            onClick={handleClose}
            style={{
              background: "transparent", border: "1px solid rgba(0,200,255,0.25)",
              borderRadius: 4, color: "rgba(0,200,255,0.5)",
              fontFamily: "monospace", fontSize: 11, letterSpacing: "0.08em",
              padding: "6px 18px", cursor: "pointer",
            }}
          >
            [ CLOSE ]
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default ToxicityAnalysisPopup;