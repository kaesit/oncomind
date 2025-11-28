// src/pages/LandingExact.tsx
import React from "react";
import DemoCard from "../components/DemoCard";
import "../css/landing.css";
import "../css/index.css";
import BrutalistButton from "../components/BrutalistButton";
import { BrutalistCard } from "../components/BrutalistCard";

// Use placeholder images for logos
const sampleLogos = [
  { src: 'https://via.placeholder.com/100x40/0f172a/cbd5e1?text=CLIENT', alt: 'Client A' },
  { src: 'https://via.placeholder.com/100x40/0f172a/cbd5e1?text=CLIENT', alt: 'Client B' },
  { src: 'https://via.placeholder.com/100x40/0f172a/cbd5e1?text=CLIENT', alt: 'Client C' },
  { src: 'https://via.placeholder.com/100x40/0f172a/cbd5e1?text=CLIENT', alt: 'Client D' },
  { src: 'https://via.placeholder.com/100x40/0f172a/cbd5e1?text=CLIENT', alt: 'Client E' },
];

// Use a placeholder for the main hero image
const heroImageUrl = 'https://via.placeholder.com/600x600/1e293b/cbd5e1?text=Official+Image';

export default function Landing() {
  return (
    <div className="landing-exact">

      {/*<header className="lex-header">
        <div className="lex-container lex-header-inner">
          <div className="lex-brand">
            <div className="lex-logo" />
            <div className="lex-brand-text">
              <div className="lex-title">OncoMind</div>
              <div className="lex-sub">AI Analysis Platform</div>
            </div>
          </div>

          <nav className="lex-nav">
            <a href="#product">Product</a>
            <a href="#how">How</a>
            <a href="#demo">Demo</a>
            <BrutalistButton
              width="120px"
              height="35px"
              transition_effect="ease-in"
              font_size="12px"
            >
              <a href="/dashboard">Dashboard</a>
            </BrutalistButton>
          </nav>
        </div>
      </header>*/}


      {/* HERO */}
      <section className="lex-hero">

        <div className="lex-container lex-hero-inner">
          <div className="lex-hero-left">
            <div className="lex-kicker">Semper Procedere - 常に前進 - Her zaman ileriye - Always one step ahead</div>
            <h1 className="lex-hero-title">
              From genomic signatures to actionable insights
            </h1>
            <p className="lex-hero-lead">
              OncoMind provides a reproducible, privacy-first demo pipeline that predicts drug-response patterns from cancer genomic signatures — built for clean, presentation-ready results.
            </p>

            <div className="lex-hero-ctas">
              <a href="#demo"><BrutalistButton
                onClick={() => console.log('Portal clicked')}
                style={{ padding: '10px 16px', fontSize: '0.9rem' }}
              >Try live demo</BrutalistButton></a>
              <a className="btn-ghost" href="#how">How it works</a>
            </div>


            <div className="lex-hero-stats">
              <div><div className="stat-num">Local</div><div className="stat-label">Runs locally</div></div>
              <div><div className="stat-num">Repro</div><div className="stat-label">Synthetic dataset</div></div>
              <div><div className="stat-num">Extensible</div><div className="stat-label">Swap models</div></div>
            </div>
          </div>

          <div className="lex-hero-right">
            <div className="lex-preview">
              <div className="lex-preview-inner">
                {/* Visual area: gradient + preview DemoCard */}
                <BrutalistCard
                  title="Genetic Research"
                  backgroundImageUrl="https://media.istockphoto.com/id/1477214805/photo/cancer-detection.jpg?s=612x612&w=0&k=20&c=ylUbxrTIpDAISXL6-rUcW23yXUXn4oY0C8rYVoON62k="
                  tag="Academic"
                >
                  Our lab is focused on identifying genetic markers for early-stage
                  carcinoma.
                </BrutalistCard>
                <pre></pre>
                <BrutalistCard
                  title="Patient Awareness"
                  backgroundImageUrl="https://t4.ftcdn.net/jpg/06/33/37/89/360_F_633378965_iRc8bqmOoxkrAlYKvNcBqUhqGXNBmfTB.jpg"
                  tag="Priority"
                >
                  Download our guides and resources for patient families.
                </BrutalistCard>
                <pre></pre>
                <BrutalistCard
                  title="Personalized Medicine"
                  backgroundImageUrl="https://www.news-medical.net/images/Article_Images/ImageForArticle_26037_17449621261067936.jpg"
                  tag="Future"
                >
                  We are producing and formulazing personalized mRNA vaccines and drugs for cancer patients.
                </BrutalistCard>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT / FEATURES */}
      <section id="product" className="lex-section">
        <div className="lex-container">
          <div className="lex-grid-2">
            <div className="card">
              <h3>What it does</h3>
              <p className="small">Processes genomic signatures, runs a trained model, and returns interpretable predictions suitable for slide-ready export and discussion.</p>
            </div>

            <div className="features-grid">
              <div className="feature">
                <div className="feature-icon">1</div>
                <div>
                  <h4>Local-first</h4>
                  <p className="small">Everything can run on your laptop — ideal for demos and privacy-sensitive presentations.</p>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">2</div>
                <div>
                  <h4>Explainable</h4>
                  <p className="small">Outputs include provenance and simple scores, easy to include in slides.</p>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">3</div>
                <div>
                  <h4>Reproducible</h4>
                  <p className="small">Synthetic dataset + training script shipped for reproducible demos.</p>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">4</div>
                <div>
                  <h4>Dev friendly</h4>
                  <p className="small">Docker, VS Code tasks & simple wiring for fast prototyping.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="lex-section">
        <div className="lex-container">
          <h3>How it works</h3>
          <div className="steps-row">
            <div className="step card">
              <div className="step-num">1</div>
              <h4>Ingest</h4>
              <p className="small">Load a sample or use built-in examples.</p>
            </div>
            <div className="step card">
              <div className="step-num">2</div>
              <h4>Predict</h4>
              <p className="small">Frontend → C# API → Python model returns prediction.</p>
            </div>
            <div className="step card">
              <div className="step-num">3</div>
              <h4>Export</h4>
              <p className="small">Download slide-ready JSON or copy the result for your presentation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL / PROOF */}
      <section className="lex-section lex-proof">
        <div className="lex-container lex-proof-inner">
          <div className="proof-left">
            <h3>Trusted for demos</h3>
            <p className="small">A lightweight tool to present model behavior clearly and ethically.</p>
          </div>
          <div className="proof-right">
            <div className="testimonial card">“Great for live demos — zero surprises for judges.”<div className="small" style={{ marginTop: 8 }}>— Demo user</div></div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lex-cta-band">
        <div className="lex-container">
          <div className="cta-inner card">
            <div>
              <h3 style={{ margin: 0 }}>Make your talk easier — run the demo now</h3>
              <p className="small">Quick demo, slide-ready output, no patient data required.</p>
            </div>
            <div><a className="btn-primary" href="#demo">Run live demo</a></div>
          </div>
        </div>
      </section>

      <footer className="lex-footer">
        <div className="lex-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>© {new Date().getFullYear()} OncoMind</div>
          <div><a className="footer-link" href="https://github.com/kaesit/oncomind" target="_blank" rel="noreferrer">GitHub</a></div>
        </div>
      </footer>
    </div>
  );
}
