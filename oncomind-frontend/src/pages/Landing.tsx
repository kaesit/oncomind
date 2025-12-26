// src/pages/LandingExact.tsx
import React from "react";
import "../css/landing.css";
import "../css/index.css";
import BrutalistButton from "../components/BrutalistButton";
import { BrutalistCard } from "../components/BrutalistCard";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <div className="landing-exact">
      {/* HERO */}
      <section className="lex-hero">
        <div className="lex-container lex-hero-inner">
          <div className="lex-hero-left">
            <div className="lex-kicker">
              Semper Procedere • 常に前進 • Her zaman ileriye • Always one step ahead
            </div>
            <h1 className="lex-hero-title">
              From genomic signatures to actionable insights
            </h1>
            <p className="lex-hero-lead">
              OncoMind provides a reproducible, privacy-first demo pipeline that predicts
              drug-response patterns from cancer genomic signatures — built for clean,
              presentation-ready results.
            </p>

            <div className="lex-hero-ctas">
              <a href="#demo">
                <BrutalistButton
                  onClick={() => console.log('Demo clicked')}
                  style={{ padding: '10px 16px', fontSize: '0.9rem' }}
                >
                  Try live demo
                </BrutalistButton>
              </a>
              <a className="btn-ghost" href="#how">
                How it works
              </a>
            </div>

            <div className="lex-hero-stats">
              <div>
                <div className="stat-num">Local-first</div>
                <div className="stat-label">Runs on your machine</div>
              </div>
              <div>
                <div className="stat-num">Reproducible</div>
                <div className="stat-label">Synthetic datasets</div>
              </div>
              <div>
                <div className="stat-num">Extensible</div>
                <div className="stat-label">Swap models easily</div>
              </div>
            </div>
          </div>

          <div className="lex-hero-right">
            <div className="lex-preview">
              <div className="lex-preview-inner">
                <BrutalistCard
                  title="Genetic Research"
                  backgroundImageUrl="https://media.istockphoto.com/id/1477214805/photo/cancer-detection.jpg?s=612x612&w=0&k=20&c=ylUbxrTIpDAISXL6-rUcW23yXUXn4oY0C8rYVoON62k="
                  tag="Academic"
                >
                  Our lab is focused on identifying genetic markers for early-stage carcinoma.
                </BrutalistCard>

                <BrutalistCard
                  title="Patient Awareness"
                  backgroundImageUrl="https://t4.ftcdn.net/jpg/06/33/37/89/360_F_633378965_iRc8bqmOoxkrAlYKvNcBqUhqGXNBmfTB.jpg"
                  tag="Priority"
                >
                  Download our guides and resources for patient families.
                </BrutalistCard>

                <BrutalistCard
                  title="Personalized Medicine"
                  backgroundImageUrl="https://www.news-medical.net/images/Article_Images/ImageForArticle_26037_17449621261067936.jpg"
                  tag="Future"
                >
                  We are producing and formulating personalized mRNA vaccines and drugs for cancer patients.
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
              <div id="whatitdoes">
                <ul>
                  <li>
                    Processes genomic signatures, runs a trained model, and returns interpretable
                    predictions suitable for slide-ready export and discussion
                  </li>
                  <li>
                    Helps doctors refine treatment processes with data-driven insights and
                    confidence scores
                  </li>
                  <li>
                    Provides analytics that help researchers decrease project timelines and
                    accelerate discovery
                  </li>
                </ul>
              </div>
            </div>

            <div className="features-grid">
              <div className="feature">
                <div className="feature-icon">1</div>
                <div>
                  <h4>Local-first</h4>
                  <p className="small">
                    Everything runs on your laptop — ideal for demos and privacy-sensitive presentations
                  </p>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">2</div>
                <div>
                  <h4>Explainable</h4>
                  <p className="small">
                    Outputs include provenance and simple scores, easy to include in slides
                  </p>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">3</div>
                <div>
                  <h4>Reproducible</h4>
                  <p className="small">
                    Synthetic dataset and training script shipped for reproducible demos
                  </p>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">4</div>
                <div>
                  <h4>Dev friendly</h4>
                  <p className="small">
                    Docker, VS Code tasks, and simple wiring for fast prototyping
                  </p>
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
              <h4>Ingest Data</h4>
              <p className="small">
                Load a genomic sample or use our built-in synthetic examples to get started instantly
              </p>
            </div>
            <div className="step card">
              <div className="step-num">2</div>
              <h4>Predict</h4>
              <p className="small">
                Frontend sends data to C# API, which routes to Python model and returns predictions
              </p>
            </div>
            <div className="step card">
              <div className="step-num">3</div>
              <h4>Export Results</h4>
              <p className="small">
                Download slide-ready JSON or copy formatted results directly for your presentation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL / PROOF */}
      <section className="lex-section lex-proof">
        <div className="lex-container lex-proof-inner">
          <div className="proof-left">
            <h3>Trusted for demos</h3>
            <p className="small">
              A lightweight tool designed to present model behavior clearly and ethically,
              without compromising patient privacy or data security.
            </p>
          </div>
          <div className="proof-right">
            <div className="testimonial card">
              "Great for live demos — zero surprises for judges. The reproducibility and
              clear explanations made our presentation stand out."
              <div className="small" style={{ marginTop: 16, fontStyle: 'normal', opacity: 0.7 }}>
                — Research Team Lead
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lex-cta-band">
        <div className="lex-container">
          <div className="cta-inner card">
            <div>
              <h3 style={{ margin: 0 }}>Ready to streamline your research presentation?</h3>
              <p className="small" style={{ marginTop: 12 }}>
                Quick demo, slide-ready output, no patient data required
              </p>
            </div>
            <div>
              <a className="btn-primary" href="#demo">
                Run live demo
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}