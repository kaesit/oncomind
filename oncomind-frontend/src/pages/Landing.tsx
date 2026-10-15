// src/pages/Landing.tsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, Atom, Dna, FlaskConical, Github, HeartHandshake, LineChart, ScanLine, ShieldCheck, Users } from "lucide-react";
import { Marquee, ModuleStatus, PhotoHero, ScannerShowcase, SectionHead, StatusTag, useReveal } from "../site/parts";
import { IMG, photo } from "../site/images";

const REPO = "https://github.com/kaesit/oncomind";

/* What the project actually does today — keep this list honest. */
const pillars = [
  {
    title: "Molecule generation",
    icon: <Atom size={20} />,
    status: "working" as ModuleStatus,
    img: IMG.fluidSwirl,
    text: "Recurrent neural networks trained on kinase-target molecules (such as ABL1) propose new candidate structures. Only drug-like ones (QED ≥ 0.6) are kept.",
  },
  {
    title: "Toxicity screening",
    icon: <FlaskConical size={20} />,
    status: "working" as ModuleStatus,
    img: IMG.cellsFluorescent,
    text: "Every candidate can be screened with the open-source ADMET-AI model, and the predictions are mapped onto the body so risks are visible at a glance.",
  },
  {
    title: "Patient awareness",
    icon: <HeartHandshake size={20} />,
    status: "working" as ModuleStatus,
    img: IMG.dandelionsSunset,
    text: "Plain-language notes on early detection, prevention and mental resilience — with sources, and never a substitute for a doctor.",
  },
];

const modules: { title: string; icon: React.ReactNode; status: ModuleStatus; text: string }[] = [
  { title: "Drug candidate generation", icon: <Atom size={18} />, status: "working", text: "Generate and store candidate molecules with their QED and molecular weight." },
  { title: "ADMET toxicity body map", icon: <FlaskConical size={18} />, status: "working", text: "Predictions from ADMET-AI, mapped to organs: red for a predicted hit, green when clear." },
  { title: "Model introspection", icon: <LineChart size={18} />, status: "working", text: "Inference benchmarks, neuron activation maps and LSTM weight heatmaps for each model." },
  { title: "Patient records", icon: <Users size={18} />, status: "working", text: "Doctors keep patient records and analysis history in the dashboard (demo data only)." },
  { title: "CT image detection", icon: <ScanLine size={18} />, status: "in-development", text: "Segmentation models on public imaging datasets. Not finished, and not a diagnostic tool." },
  { title: "Genomic profiling", icon: <Dna size={18} />, status: "planned", text: "On the roadmap. Nothing here yet — we'll say so until there is." },
];

const steps = [
  { title: "Generate", text: "An AI model proposes new drug-like molecules for a cancer-related target." },
  { title: "Screen", text: "ADMET-AI predicts how each molecule might behave in the body, organ by organ." },
  { title: "Review", text: "People stay in charge: candidates and results are reviewed in the dashboard, never acted on automatically." },
];

export default function Landing() {
  const ref = useReveal();

  return (
    <div ref={ref}>
      {/* HERO */}
      <PhotoHero
        image={IMG.lightWave}
        tint="violet"
        tall
        eyebrow="Experimental · research use only"
        title={
          <>
            Searching for tomorrow's cancer drugs, <span className="site-serif site-gradient-text">one molecule at a time</span>
          </>
        }
        lead="OncoMind is an open, experimental research project. AI models propose new drug-like molecules, an ADMET model predicts how each one might affect the body, and people review everything. Nothing here is clinical advice."
        aside={<ScannerShowcase />}
      >
        <div className="site-ctas">
          <Link to="/login" className="om-btn om-btn--primary" style={{ textDecoration: "none" }}>
            Open the dashboard <ArrowUpRight size={17} />
          </Link>
          <a href="#how" className="om-btn" style={{ textDecoration: "none" }}>
            How it works <ArrowDown size={16} />
          </a>
        </div>
        <div className="site-proof-row">
          <a className="site-glass-chip" href={REPO} target="_blank" rel="noreferrer"><Github size={14} /> Open source</a>
          <span className="site-glass-chip">Runs locally with Docker</span>
          <span className="site-glass-chip"><ShieldCheck size={14} /> Research use only</span>
        </div>
      </PhotoHero>

      {/* MOTTO */}
      <Marquee items={["Semper Procedere", "常に前進", "Her zaman ileriye", "Always one step ahead"]} />

      {/* PILLARS */}
      <section className="site-section">
        <div className="site-wrap">
          <SectionHead eyebrow="What it does" title={<>Small steps, <span className="site-serif site-gradient-text">real progress</span></>}>
            Three things OncoMind does today. Everything else is labelled honestly below.
          </SectionHead>

          <div className="site-bento">
            {pillars.map((p, i) => (
              <article key={p.title} className="site-photo-tile site-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <img src={photo(p.img, 1200)} alt="" loading="lazy" />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span className="site-icon">{p.icon}</span>
                  <StatusTag status={p.status} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <h3 className="site-h2" style={{ fontSize: "clamp(28px, 2.6vw, 38px)" }}>{p.title}</h3>
                  <p className="site-body">{p.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* STATUS BOARD */}
      <section id="product" className="site-section" style={{ paddingTop: 0 }}>
        <div className="site-wrap">
          <SectionHead eyebrow="Status" title={<>Where every module <span className="site-serif">really</span> stands</>}>
            Working means you can use it in the dashboard today. In development means it exists but isn't ready. Planned means it doesn't exist yet.
          </SectionHead>
          <div className="site-modules">
            {modules.map((m, i) => (
              <article key={m.title} className="site-module site-reveal" data-status={m.status} style={{ transitionDelay: `${i * 50}ms` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <span className="site-icon" style={{ width: 40, height: 40, borderRadius: 13 }}>{m.icon}</span>
                  <StatusTag status={m.status} />
                </div>
                <h3 className="site-h3">{m.title}</h3>
                <p className="site-body">{m.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="site-section" style={{ paddingTop: 0 }}>
        <div className="site-wrap">
          <SectionHead eyebrow="Process" title={<>How it <span className="site-serif">works</span></>} />
          <div className="site-steps">
            {steps.map((s, i) => (
              <article key={s.title} className="site-step site-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <span className="site-dot-num">{i + 1}</span>
                <h3 className="site-h3">{s.title}</h3>
                <p className="site-body">{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HONEST BY DESIGN */}
      <section className="site-section" style={{ paddingTop: 0 }}>
        <div className="site-wrap">
          <div className="site-honest site-reveal">
            <span className="site-eyebrow">Honest by design</span>
            <p className="site-quote" style={{ maxWidth: 900 }}>
              We'd rather show you a work in progress than a polished promise.
            </p>
            <ul className="site-check-list">
              <li><b>Real status, always</b>Every feature is labelled working, in development or planned.</li>
              <li><b>No clinical claims</b>OncoMind is a research project, not a medical device or a source of medical advice.</li>
              <li><b>Read the code</b>Everything is open source, so you can check how any result is produced.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="site-section" style={{ paddingTop: 0 }}>
        <div className="site-wrap">
          <div className="site-cta site-reveal" style={{ background: "linear-gradient(120deg, #5b2eff 0%, #ff2d87 60%, #ff9b2f 100%)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <h2 className="site-h2">Follow the build, <span className="site-serif">step by step</span></h2>
              <p className="site-lead">OncoMind is developed in the open. Star the repository to follow along, or open an issue with ideas.</p>
            </div>
            <a href={REPO} target="_blank" rel="noreferrer" className="om-btn" style={{ textDecoration: "none", padding: "0 24px", "--h": "48px", background: "#fff", color: "#111113", boxShadow: "none" } as React.CSSProperties}>
              <Github size={17} /> View on GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
