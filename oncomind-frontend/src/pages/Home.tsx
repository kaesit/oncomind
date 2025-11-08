import React from "react";
import DemoCard from "../components/DemoCard";

export default function Home() {
  return (
    <div>
      <header className="header">
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="brand">
            <div className="logo" />
            <div>
              <div style={{ fontWeight: 700 }}>OncoMind</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>AI Analysis Platform</div>
            </div>
          </div>
          <nav style={{ display: "flex", gap: 16 }}>
            <a href="#demo" style={{ color: "white", textDecoration: "none" }}>Demo</a>
            <a href="/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</a>
            <a href="https://github.com/kaesit/oncomind" style={{ color: "white", textDecoration: "none" }} target="_blank" rel="noreferrer">GitHub</a>
          </nav>
        </div>
      </header>

      <main className="container">
        <section className="hero" style={{ background: "transparent" }}>
          <div className="left">
            <h1>OncoMind — AI Analysis Platform for Cancer Genomics & Drug Prediction</h1>
            <p className="lead">
              OncoMind analyzes cancer genomic signatures and predicts potential drug responses using explainable machine learning.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href="#demo">Try demo</a>
              <a className="btn" style={{ border: "1px solid rgba(8,74,81,0.08)" }} href="/dashboard">Open dashboard</a>
            </div>
            <div style={{ marginTop: 12 }}>
              <p className="small">Türkçe: OncoMind, kanser genetik verilerini analiz ederek olası ilaç tepkilerini öngören açıklanabilir yapay zekâ modelleri sunar.</p>
            </div>
          </div>

          <div style={{ flex: "0 0 380px" }}>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Presentation-ready highlights</h3>
              <ul style={{ marginTop: 8 }}>
                <li>Live demo: one-click predictions</li>
                <li>Dashboard: data viewer and charts</li>
                <li>Ethics & reproducibility notes</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="demo" style={{ marginTop: 8 }}>
          <div className="demo-grid">
            <div>
              <div className="card">
                <h3>About the demo</h3>
                <p className="small">This demo runs a baseline model trained on a small synthetic dataset. In production you would use curated genomic and pharmacology data.</p>
                <ol>
                  <li>Choose a sample index and click Run demo.</li>
                  <li>The UI will call the C# API which forwards the request to the ML service.</li>
                  <li>Results are shown below and can be copied for your presentation slides.</li>
                </ol>
              </div>

              <div style={{ marginTop: 16 }}>
                {/* Extra content or instructions */}
              </div>
            </div>

            <div>
              <DemoCard />
            </div>
          </div>
        </section>

        <section style={{ marginTop: 28 }}>
          <div className="card">
            <h3>About & Ethics</h3>
            <p className="small">
              OncoMind is an in-silico research demo. It does not provide clinical advice and does not include any protocol for drug production or administration.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>© {new Date().getFullYear()} OncoMind — Presentation demo</div>
          <div><a href="https://github.com/kaesit/oncomind" target="_blank" rel="noreferrer" style={{ color: "#dff6f7" }}>GitHub</a></div>
        </div>
      </footer>
    </div>
  );
}
