import React from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, Github, ShieldAlert } from "lucide-react";
import DemoCard from "../components/DemoCard";
import { Orb, useReveal } from "../site/parts";

export default function Home() {
  const ref = useReveal();

  return (
    <div ref={ref}>
      <section className="site-hero">
        <Orb tone="violet" size={560} style={{ top: -200, right: -140 }} />
        <Orb tone="teal" size={380} style={{ bottom: -120, left: -80, animationDelay: "-5s" }} />
        <div className="site-dots" />

        <div className="site-wrap site-above site-hero-grid" style={{ alignItems: "end" }}>
          <div className="site-hero-copy">
            <span className="site-eyebrow">AI Analysis Platform</span>
            <h1 className="site-display" style={{ fontSize: "clamp(40px, 6vw, 84px)" }}>
              OncoMind — AI Analysis Platform for <span className="site-serif site-gradient-text">Cancer Genomics &amp; Drug Prediction</span>
            </h1>
            <p className="site-lead">
              OncoMind analyzes cancer genomic signatures and predicts potential drug responses using explainable machine learning.
            </p>
            <div className="site-ctas">
              <a className="om-btn om-btn--primary" href="#demo" style={{ textDecoration: "none" }}>
                Try demo <ArrowDown size={16} />
              </a>
              <Link className="om-btn" to="/login" style={{ textDecoration: "none" }}>
                Open dashboard <ArrowUpRight size={16} />
              </Link>
              <a className="om-btn om-btn--ghost" href="https://github.com/kaesit/oncomind" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                <Github size={16} /> GitHub
              </a>
            </div>
            <p className="site-muted" style={{ fontSize: 13, margin: 0 }}>
              Türkçe: OncoMind, kanser genetik verilerini analiz ederek olası ilaç tepkilerini öngören açıklanabilir yapay zekâ modelleri sunar.
            </p>
          </div>

          <aside className="site-tile site-tile--aura om-aura--violet site-reveal" style={{ minHeight: 0 }}>
            <span className="site-eyebrow" style={{ color: "rgba(255,255,255,0.8)" }}>Highlights</span>
            <h3 className="site-h2" style={{ fontSize: 30 }}>Presentation-ready highlights</h3>
            <ul className="site-list">
              {["Live demo: one-click predictions", "Dashboard: data viewer and charts", "Ethics & reproducibility notes"].map((t, i) => (
                <li key={t} style={{ color: "#fff", borderColor: "rgba(255,255,255,0.22)" }}>
                  <span className="site-list-num" style={{ color: "rgba(255,255,255,0.7)" }}>{String(i + 1).padStart(2, "0")}</span>
                  {t}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section id="demo" className="site-section" style={{ paddingTop: 0 }}>
        <div className="site-wrap site-split" style={{ alignItems: "start" }}>
          <div className="site-tile site-reveal" style={{ minHeight: 0, justifyContent: "flex-start" }}>
            <span className="site-eyebrow">How the demo works</span>
            <h2 className="site-h2" style={{ fontSize: 36 }}>About the <span className="site-serif">demo</span></h2>
            <p className="site-body">
              This demo runs a baseline model trained on a small synthetic dataset. In production you would use curated genomic and pharmacology data.
            </p>
            <ol className="site-list">
              <li><span className="site-list-num">01</span>Choose a sample index and click Run demo.</li>
              <li><span className="site-list-num">02</span>The UI will call the C# API which forwards the request to the ML service.</li>
              <li><span className="site-list-num">03</span>Results are shown below and can be copied for your presentation slides.</li>
            </ol>
          </div>

          <DemoCard />
        </div>
      </section>

      <section className="site-section" style={{ paddingTop: 0 }}>
        <div className="site-wrap">
          <div className="site-tile site-reveal" style={{ minHeight: 0, flexDirection: "row", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <span className="site-icon"><ShieldAlert size={20} /></span>
            <div style={{ flex: 1, minWidth: 240, display: "flex", flexDirection: "column", gap: 6 }}>
              <h3 className="site-h3">About &amp; Ethics</h3>
              <p className="site-body">
                OncoMind is an in-silico research demo. It does not provide clinical advice and does not include any protocol for drug production or administration.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
