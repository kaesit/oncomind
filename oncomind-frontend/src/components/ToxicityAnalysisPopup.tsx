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
  await new Promise(r => setTimeout(r, 1400));
  return [
    { property: "hERG", category: "toxicity", value: 0.82, toxic: true },
    { property: "BBB_Martini", category: "distribution", value: 0.61, toxic: false },
    { property: "CYP3A4_Inhibitor", category: "metabolism", value: 0.77, toxic: true },
    { property: "CYP2D6_Inhibitor", category: "metabolism", value: 0.29, toxic: false },
    { property: "CYP2C9_Inhibitor", category: "metabolism", value: 0.55, toxic: true },
    { property: "HIA_Hou", category: "absorption", value: 0.95, toxic: false },
    { property: "PPBR_AZ", category: "distribution", value: 87.4, toxic: false },
    { property: "Caco2_Wang", category: "absorption", value: 0.88, toxic: false },
    { property: "Clearance_Hepatocyte", category: "excretion", value: 0.44, toxic: false },
    { property: "Solubility_AqSolDB", category: "absorption", value: 0.38, toxic: false },
  ];
}

function regionStatus(r: BodyRegion, preds: AdmetPrediction[]): "toxic" | "safe" | "neutral" {
  const rel = preds.filter(p => r.relatedProperties.includes(p.property));
  if (!rel.length) return "neutral";
  return rel.some(p => p.toxic) ? "toxic" : "safe";
}

/* -------------------------------------------------------
   HOLOGRAM CANVAS
------------------------------------------------------- */
interface HologramCanvasProps {
  width: number; height: number;
  predictions: AdmetPrediction[];
  scanStep: number;
  activeRegion: string | null;
  onRegionClick: (id: string) => void;
}

const HologramCanvas: React.FC<HologramCanvasProps> = ({
  width, height, predictions, scanStep, activeRegion, onRegionClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<{ x: number; y: number; vy: number; vx: number; opacity: number; color: [number, number, number] }[]>([]);

  const toCanvas = useCallback((nx: number, ny: number) => {
    const cx = width / 2 + nx * width * 0.26;
    const cy = height * 0.5 - ny * height * 0.44;
    return { cx, cy };
  }, [width, height]);

  useEffect(() => {
    particlesRef.current = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vy: -0.2 - Math.random() * 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.7,
      color: Math.random() > 0.5 ? [0, 255, 200] : [0, 140, 255],
    }));
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const bodySvg = buildBodySvg(width, height);
    const img = new Image();
    let imgReady = false;
    img.onload = () => { imgReady = true; };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(bodySvg);

    const draw = (t: number) => {
      const time = t * 0.001;
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "#030d1a";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(0,180,255,0.055)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 22) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
      for (let y = 0; y < height; y += 22) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

      if (imgReady) ctx.drawImage(img, 0, 0, width, height);

      if (scanStep > -2) {
        const progress = scanStep === -1 ? 1 : scanStep / (BODY_REGIONS.length - 1);
        const scanY = height * 0.04 + progress * height * 0.92;
        const sg = ctx.createLinearGradient(0, scanY - 10, 0, scanY + 10);
        sg.addColorStop(0, "rgba(0,255,200,0)");
        sg.addColorStop(0.5, "rgba(0,255,200,0.28)");
        sg.addColorStop(1, "rgba(0,255,200,0)");
        ctx.fillStyle = sg;
        ctx.fillRect(0, scanY - 10, width, 20);
        ctx.strokeStyle = "rgba(0,255,200,0.6)";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(width, scanY); ctx.stroke();
      }

      BODY_REGIONS.forEach((region, idx) => {
        const isScanned = scanStep === -1 || idx <= scanStep;
        if (!isScanned) return;

        const { cx, cy } = toCanvas(region.nx, region.ny);
        const status = predictions.length > 0 ? regionStatus(region, predictions) : "neutral";
        const isActive = activeRegion === region.id;

        const C = {
          toxic: { core: "#ff3333", ring: "#ff5555", glow: [255, 50, 50] as [number, number, number] },
          safe: { core: "#00ff88", ring: "#00ffaa", glow: [0, 255, 136] as [number, number, number] },
          neutral: { core: "#44aaff", ring: "#88ccff", glow: [68, 170, 255] as [number, number, number] },
        }[status];

        const R = region.radius * width * 0.5;
        const pulse = 0.65 + 0.35 * Math.sin(time * 2.5 + idx * 1.1);
        const [gr, gg, gb] = C.glow;

        const halo = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 2.2);
        halo.addColorStop(0, `rgba(${gr},${gg},${gb},${isActive ? 0.32 : 0.16})`);
        halo.addColorStop(1, `rgba(${gr},${gg},${gb},0)`);
        ctx.fillStyle = halo;
        ctx.beginPath(); ctx.arc(cx, cy, R * 2.2, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = `rgba(${gr},${gg},${gb},${0.12 + (isActive ? 0.10 : 0)})`;
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

        ctx.save();
        ctx.strokeStyle = C.ring;
        ctx.lineWidth = isActive ? 1.6 : 0.9;
        ctx.globalAlpha = pulse * (isActive ? 1 : 0.65);
        ctx.setLineDash([5, 4]);
        ctx.lineDashOffset = -(time * 14) % 9;
        ctx.beginPath(); ctx.arc(cx, cy, R * (isActive ? 1.05 : 0.95), 0, Math.PI * 2); ctx.stroke();
        if (isActive) {
          ctx.lineWidth = 0.5; ctx.globalAlpha = 0.3;
          ctx.setLineDash([2, 6]);
          ctx.beginPath(); ctx.arc(cx, cy, R * 1.35, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.setLineDash([]); ctx.globalAlpha = 1; ctx.restore();

        ctx.beginPath(); ctx.arc(cx, cy, R * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = C.core; ctx.fill();

        const onRight = region.nx >= -0.05;
        const lx = cx + (onRight ? R * 1.5 : -R * 1.5);
        ctx.save();
        ctx.font = "600 10px monospace";
        ctx.fillStyle = C.ring;
        ctx.textAlign = onRight ? "left" : "right";
        ctx.fillText(region.label.toUpperCase(), lx, cy - 3);
        if (predictions.length > 0) {
          const rel = predictions.filter(p => region.relatedProperties.includes(p.property));
          const flags = rel.filter(p => p.toxic).length;
          ctx.font = "9px monospace";
          ctx.fillStyle = flags > 0 ? "#ff8888" : "#55ffaa";
          ctx.fillText(flags > 0 ? `${flags} FLAG${flags > 1 ? "S" : ""}` : "CLEAR", lx, cy + 10);
        }
        ctx.strokeStyle = C.ring; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.45;
        ctx.beginPath();
        ctx.moveTo(cx + (onRight ? R * 0.9 : -R * 0.9), cy);
        ctx.lineTo(cx + (onRight ? R * 1.3 : -R * 1.3), cy);
        ctx.stroke();
        ctx.globalAlpha = 1; ctx.restore();
      });

      particlesRef.current.forEach(p => {
        p.y += p.vy; p.x += p.vx; p.opacity -= 0.0018;
        if (p.y < 0 || p.opacity <= 0) {
          p.x = Math.random() * width; p.y = height;
          p.opacity = 0.5 + Math.random() * 0.4;
          p.vy = -0.2 - Math.random() * 0.35;
        }
        const [r, g, b] = p.color;
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.max(0, p.opacity).toFixed(2)})`;
        ctx.fillRect(p.x, p.y, 1.5, 1.5);
      });

      ctx.strokeStyle = "rgba(0,200,255,0.4)"; ctx.lineWidth = 1;
      const D = 14;
      [[8, 8, 1, 1], [width - 8, 8, -1, 1], [8, height - 8, 1, -1], [width - 8, height - 8, -1, -1]].forEach(([x, y, sx, sy]) => {
        ctx.beginPath(); ctx.moveTo(x, y + sy * D); ctx.lineTo(x, y); ctx.lineTo(x + sx * D, y); ctx.stroke();
      });

      ctx.font = "9px monospace"; ctx.fillStyle = "rgba(0,200,255,0.45)";
      ctx.textAlign = "left";
      ctx.fillText(
        scanStep === -2 ? "AWAITING INPUT" : scanStep === -1 ? "SCAN COMPLETE" : `SCANNING ${Math.round(((scanStep + 1) / BODY_REGIONS.length) * 100)}%`,
        14, height - 10
      );
      ctx.textAlign = "right";
      ctx.fillText(`v3.1 ADMET`, width - 14, height - 10);

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [width, height, predictions, scanStep, activeRegion, toCanvas]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (width / rect.width);
    const my = (e.clientY - rect.top) * (height / rect.height);
    for (const region of BODY_REGIONS) {
      const { cx, cy } = toCanvas(region.nx, region.ny);
      const R = region.radius * width * 0.5 * 1.8;
      if (Math.hypot(mx - cx, my - cy) < R) {
        onRegionClick(region.id === activeRegion ? "" : region.id);
        return;
      }
    }
    onRegionClick("");
  };

  return (
    <canvas ref={canvasRef} width={width} height={height}
      onClick={handleClick}
      style={{ cursor: "crosshair", borderRadius: 8, display: "block" }} />
  );
};

/* -------------------------------------------------------
   SVG BODY
------------------------------------------------------- */
function buildBodySvg(W: number, H: number): string {
  const cx = W / 2;
  const s = H * 0.44;

  const headTop = cy(s, H, 1.00);
  const headBot = cy(s, H, 0.64);
  const neckTop = cy(s, H, 0.62);
  const neckBot = cy(s, H, 0.54);
  const shoulderY = cy(s, H, 0.50);
  const chestMid = cy(s, H, 0.28);
  const waistY = cy(s, H, -0.04);
  const hipY = cy(s, H, -0.16);
  const crotchY = cy(s, H, -0.28);
  const kneeY = cy(s, H, -0.62);
  const ankleY = cy(s, H, -0.88);
  const footY = cy(s, H, -0.96);

  const headW = s * 0.185;
  const neckW = s * 0.080;
  const shouldW = s * 0.280;
  const chestW = s * 0.255;
  const waistW = s * 0.195;
  const hipW = s * 0.245;
  const thighW = s * 0.120;
  const kneeW = s * 0.090;
  const ankleW = s * 0.055;
  const footW = s * 0.095;

  const opacity = "0.55";
  const stroke = "#00ccff";
  const sw = "1.3";

  function cy(scale: number, H: number, ny: number) {
    return H / 2 - ny * scale;
  }

  const armShoulderY = shoulderY;
  const elbowY = cy(s, H, 0.08);
  const wristY = cy(s, H, -0.26);
  const handY = cy(s, H, -0.36);

  const lArmX = cx - shouldW - s * 0.02;
  const rArmX = cx + shouldW + s * 0.02;
  const lElbX = cx - shouldW - s * 0.07;
  const rElbX = cx + shouldW + s * 0.07;
  const lWristX = cx - shouldW - s * 0.04;
  const rWristX = cx + shouldW + s * 0.04;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#002244" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#002244" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bodyFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#003366" stop-opacity="0.22"/>
      <stop offset="50%" stop-color="#002255" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#001133" stop-opacity="0.10"/>
    </linearGradient>
  </defs>
  <ellipse cx="${cx}" cy="${H * 0.48}" rx="${s * 0.38}" ry="${s * 0.70}" fill="url(#bg)"/>
  <path fill="url(#bodyFill)" stroke="none"
    d="M${cx - shouldW} ${shoulderY}
       C${cx - shouldW} ${shoulderY} ${cx - chestW} ${chestMid} ${cx - waistW} ${waistY}
       C${cx - hipW} ${hipY} ${cx - thighW * 2.1} ${crotchY} ${cx - thighW * 2.1} ${crotchY}
       L${cx + thighW * 2.1} ${crotchY}
       C${cx + thighW * 2.1} ${crotchY} ${cx + hipW} ${hipY} ${cx + waistW} ${waistY}
       C${cx + chestW} ${chestMid} ${cx + shouldW} ${shoulderY} ${cx + shouldW} ${shoulderY}
       Z"/>
  <g fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}">
    <ellipse cx="${cx}" cy="${(headTop + headBot) / 2}" rx="${headW}" ry="${(headBot - headTop) * 0.43}"/>
    <path d="M${cx - headW} ${(headTop + headBot) / 2 - headW * 0.18} Q${cx - headW * 1.18} ${(headTop + headBot) / 2} ${cx - headW} ${(headTop + headBot) / 2 + headW * 0.18}"/>
    <path d="M${cx + headW} ${(headTop + headBot) / 2 - headW * 0.18} Q${cx + headW * 1.18} ${(headTop + headBot) / 2} ${cx + headW} ${(headTop + headBot) / 2 + headW * 0.18}"/>
    <path d="M${cx - neckW} ${neckTop} L${cx - neckW} ${neckBot} M${cx + neckW} ${neckTop} L${cx + neckW} ${neckBot}"/>
    <path d="M${cx - neckW} ${neckBot} Q${cx - shouldW * 0.6} ${neckBot + s * 0.02} ${cx - shouldW} ${shoulderY}"/>
    <path d="M${cx + neckW} ${neckBot} Q${cx + shouldW * 0.6} ${neckBot + s * 0.02} ${cx + shouldW} ${shoulderY}"/>
    <path d="M${cx - shouldW} ${shoulderY} C${cx - chestW * 1.04} ${chestMid - s * 0.08} ${cx - chestW} ${chestMid} C${cx - chestW * 0.96} ${chestMid + s * 0.12} ${cx - waistW} ${waistY} C${cx - hipW * 0.92} ${hipY - s * 0.04} ${cx - hipW} ${hipY} C${cx - hipW * 1.04} ${hipY + s * 0.06} ${cx - thighW * 2.1} ${crotchY}"/>
    <path d="M${cx + shouldW} ${shoulderY} C${cx + chestW * 1.04} ${chestMid - s * 0.08} ${cx + chestW} ${chestMid} C${cx + chestW * 0.96} ${chestMid + s * 0.12} ${cx + waistW} ${waistY} C${cx + hipW * 0.92} ${hipY - s * 0.04} ${cx + hipW} ${hipY} C${cx + hipW * 1.04} ${hipY + s * 0.06} ${cx + thighW * 2.1} ${crotchY}"/>
    <path d="M${cx - thighW * 2.1} ${crotchY} Q${cx} ${crotchY + s * 0.06} ${cx + thighW * 2.1} ${crotchY}"/>
    <path d="M${cx - thighW * 2.1} ${crotchY} C${cx - thighW * 2.2} ${crotchY + s * 0.15} ${cx - thighW * 2.0} ${kneeY - s * 0.10} ${cx - kneeW * 1.6} ${kneeY}"/>
    <path d="M${cx - thighW * 0.9} ${crotchY + s * 0.04} C${cx - thighW * 0.85} ${crotchY + s * 0.15} ${cx - kneeW * 0.6} ${kneeY - s * 0.08} ${cx - kneeW * 0.5} ${kneeY}"/>
    <path d="M${cx - kneeW * 1.6} ${kneeY} Q${cx - kneeW} ${kneeY + s * 0.04} ${cx - kneeW * 0.5} ${kneeY}"/>
    <path d="M${cx - kneeW * 1.5} ${kneeY + s * 0.02} C${cx - kneeW * 1.55} ${kneeY + s * 0.14} ${cx - ankleW * 1.8} ${ankleY - s * 0.04} ${cx - ankleW * 1.7} ${ankleY}"/>
    <path d="M${cx - kneeW * 0.55} ${kneeY + s * 0.02} C${cx - ankleW * 0.7} ${ankleY - s * 0.08} ${cx - ankleW * 0.7} ${ankleY - s * 0.04} ${cx - ankleW * 0.65} ${ankleY}"/>
    <path d="M${cx - ankleW * 1.7} ${ankleY} L${cx - footW * 2.1} ${footY} Q${cx - footW * 1.2} ${footY + s * 0.03} ${cx - ankleW * 0.65} ${footY} L${cx - ankleW * 0.65} ${ankleY}"/>
    <path d="M${cx + thighW * 2.1} ${crotchY} C${cx + thighW * 2.2} ${crotchY + s * 0.15} ${cx + thighW * 2.0} ${kneeY - s * 0.10} ${cx + kneeW * 1.6} ${kneeY}"/>
    <path d="M${cx + thighW * 0.9} ${crotchY + s * 0.04} C${cx + thighW * 0.85} ${crotchY + s * 0.15} ${cx + kneeW * 0.6} ${kneeY - s * 0.08} ${cx + kneeW * 0.5} ${kneeY}"/>
    <path d="M${cx + kneeW * 1.6} ${kneeY} Q${cx + kneeW} ${kneeY + s * 0.04} ${cx + kneeW * 0.5} ${kneeY}"/>
    <path d="M${cx + kneeW * 1.5} ${kneeY + s * 0.02} C${cx + kneeW * 1.55} ${kneeY + s * 0.14} ${cx + ankleW * 1.8} ${ankleY - s * 0.04} ${cx + ankleW * 1.7} ${ankleY}"/>
    <path d="M${cx + kneeW * 0.55} ${kneeY + s * 0.02} C${cx + ankleW * 0.7} ${ankleY - s * 0.08} ${cx + ankleW * 0.7} ${ankleY - s * 0.04} ${cx + ankleW * 0.65} ${ankleY}"/>
    <path d="M${cx + ankleW * 1.7} ${ankleY} L${cx + footW * 2.1} ${footY} Q${cx + footW * 1.2} ${footY + s * 0.03} ${cx + ankleW * 0.65} ${footY} L${cx + ankleW * 0.65} ${ankleY}"/>
    <path d="M${cx - shouldW} ${armShoulderY} C${lArmX - s * 0.02} ${armShoulderY + s * 0.08} ${lElbX} ${elbowY - s * 0.06} ${lElbX} ${elbowY}"/>
    <path d="M${cx - shouldW + s * 0.08} ${armShoulderY + s * 0.04} C${cx - shouldW + s * 0.06} ${elbowY - s * 0.10} ${lElbX + s * 0.09} ${elbowY - s * 0.02} ${lElbX + s * 0.09} ${elbowY}"/>
    <path d="M${lElbX} ${elbowY} Q${lElbX + s * 0.045} ${elbowY + s * 0.03} ${lElbX + s * 0.09} ${elbowY}"/>
    <path d="M${lElbX} ${elbowY + s * 0.02} C${lElbX - s * 0.01} ${wristY - s * 0.06} ${lWristX - s * 0.03} ${wristY} ${lWristX - s * 0.03} ${wristY}"/>
    <path d="M${lElbX + s * 0.09} ${elbowY + s * 0.02} C${lElbX + s * 0.09} ${wristY - s * 0.06} ${lWristX + s * 0.06} ${wristY} ${lWristX + s * 0.06} ${wristY}"/>
    <path d="M${lWristX - s * 0.03} ${wristY} Q${lWristX} ${handY} ${lWristX + s * 0.06} ${wristY}"/>
    <path d="M${cx + shouldW} ${armShoulderY} C${rArmX + s * 0.02} ${armShoulderY + s * 0.08} ${rElbX} ${elbowY - s * 0.06} ${rElbX} ${elbowY}"/>
    <path d="M${cx + shouldW - s * 0.08} ${armShoulderY + s * 0.04} C${cx + shouldW - s * 0.06} ${elbowY - s * 0.10} ${rElbX - s * 0.09} ${elbowY - s * 0.02} ${rElbX - s * 0.09} ${elbowY}"/>
    <path d="M${rElbX} ${elbowY} Q${rElbX - s * 0.045} ${elbowY + s * 0.03} ${rElbX - s * 0.09} ${elbowY}"/>
    <path d="M${rElbX} ${elbowY + s * 0.02} C${rElbX + s * 0.01} ${wristY - s * 0.06} ${rWristX + s * 0.03} ${wristY} ${rWristX + s * 0.03} ${wristY}"/>
    <path d="M${rElbX - s * 0.09} ${elbowY + s * 0.02} C${rElbX - s * 0.09} ${wristY - s * 0.06} ${rWristX - s * 0.06} ${wristY} ${rWristX - s * 0.06} ${wristY}"/>
    <path d="M${rWristX + s * 0.03} ${wristY} Q${rWristX} ${handY} ${rWristX - s * 0.06} ${wristY}"/>
    <path d="M${cx} ${neckBot + s * 0.04} L${cx} ${chestMid + s * 0.10}" stroke-dasharray="3 3" opacity="0.35"/>
    <path d="M${cx - neckW} ${neckBot + s * 0.03} Q${cx - shouldW * 0.55} ${shoulderY + s * 0.01} ${cx - shouldW} ${shoulderY}" opacity="0.6"/>
    <path d="M${cx + neckW} ${neckBot + s * 0.03} Q${cx + shouldW * 0.55} ${shoulderY + s * 0.01} ${cx + shouldW} ${shoulderY}" opacity="0.6"/>
    <path d="M${cx - chestW * 0.82} ${chestMid - s * 0.12} Q${cx} ${chestMid - s * 0.18} ${cx + chestW * 0.82} ${chestMid - s * 0.12}" stroke-dasharray="2 3" opacity="0.22"/>
    <path d="M${cx - chestW * 0.88} ${chestMid} Q${cx} ${chestMid - s * 0.08} ${cx + chestW * 0.88} ${chestMid}" stroke-dasharray="2 3" opacity="0.22"/>
    <path d="M${cx - chestW * 0.86} ${chestMid + s * 0.12} Q${cx} ${chestMid + s * 0.04} ${cx + chestW * 0.86} ${chestMid + s * 0.12}" stroke-dasharray="2 3" opacity="0.22"/>
  </g>
  <path d="M${cx} ${neckBot} L${cx} ${crotchY - s * 0.04}" fill="none" stroke="#00ccff" stroke-width="0.7" stroke-dasharray="3 5" opacity="0.18"/>
</svg>`;
}

/* -------------------------------------------------------
   STEP INDICATOR
------------------------------------------------------- */
const STEPS = ["Enter SMILES", "Scanning", "Results"];
function StepBar({ current }: { current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 20, fontFamily: "monospace" }}>
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%",
              background: i <= current ? "#00ccff" : "transparent",
              border: `1.5px solid ${i <= current ? "#00ccff" : "rgba(0,200,255,0.28)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: i <= current ? "#001a2e" : "rgba(0,200,255,0.4)",
              fontSize: 11, fontWeight: 700, transition: "all .3s",
            }}>{i + 1}</div>
            <span style={{ fontSize: 9, color: i === current ? "#00ccff" : "rgba(0,200,255,0.35)", letterSpacing: "0.08em" }}>
              {s.toUpperCase()}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              flex: 1, height: 1, margin: "0 8px 18px",
              background: i < current ? "#00ccff" : "rgba(0,200,255,0.18)", transition: "background .4s",
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
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
          <StepBar current={step} />

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

            {/* ORTA BÖLÜM: 3D ANATOMİ (HOLOGRAM) */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,200,255,0.14)", borderRadius: 6, overflow: "hidden" }}>
              <HologramCanvas width={320} height={580} predictions={predictions} scanStep={scanStep} activeRegion={activeRegion} onRegionClick={id => setActiveRegion(id || null)} />
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
          <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", marginTop: "10px", paddingRight: "8px" }}>
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

export default ToxicityAnalysisPopup;