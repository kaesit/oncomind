// src/pages/Landing.tsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, Code2, Dna, FlaskConical, HardDrive, HeartHandshake, RefreshCcw, ScanSearch, Sparkles } from "lucide-react";
import { Pill } from "../dashboard/ui";
import { Marquee, Orb, ScannerShowcase, SectionHead, useReveal } from "../site/parts";

const focusAreas = [
  {
    title: "Genetic Research",
    tag: "Academic",
    aura: "violet",
    icon: <Dna size={20} />,
    img: "https://media.istockphoto.com/id/1477214805/photo/cancer-detection.jpg?s=612x612&w=0&k=20&c=ylUbxrTIpDAISXL6-rUcW23yXUXn4oY0C8rYVoON62k=",
    text: "Our lab is focused on identifying genetic markers for early-stage carcinoma.",
  },
  {
    title: "Patient Awareness",
    tag: "Priority",
    aura: "pink",
    icon: <HeartHandshake size={20} />,
    img: "https://t4.ftcdn.net/jpg/06/33/37/89/360_F_633378965_iRc8bqmOoxkrAlYKvNcBqUhqGXNBmfTB.jpg",
    text: "Download our guides and resources for patient families.",
  },
  {
    title: "Personalized Medicine",
    tag: "Future",
    aura: "orange",
    icon: <FlaskConical size={20} />,
    img: "https://www.news-medical.net/images/Article_Images/ImageForArticle_26037_17449621261067936.jpg",
    text: "We are producing and formulating personalized mRNA vaccines and drugs for cancer patients.",
  },
];

const features = [
  { icon: <HardDrive size={20} />, title: "Local-first", text: "Everything runs on your laptop — ideal for demos and privacy-sensitive presentations" },
  { icon: <ScanSearch size={20} />, title: "Explainable", text: "Outputs include provenance and simple scores, easy to include in slides" },
  { icon: <RefreshCcw size={20} />, title: "Reproducible", text: "Synthetic dataset and training script shipped for reproducible demos" },
  { icon: <Code2 size={20} />, title: "Dev friendly", text: "Docker, VS Code tasks, and simple wiring for fast prototyping" },
];

const steps = [
  { title: "Ingest Data", text: "Load a genomic sample or use our built-in synthetic examples to get started instantly" },
  { title: "Predict", text: "Frontend sends data to C# API, which routes to Python model and returns predictions" },
  { title: "Export Results", text: "Download slide-ready JSON or copy formatted results directly for your presentation" },
];

export default function Landing() {
  const ref = useReveal();

  return (
    <div ref={ref}>
      {/* HERO */}
      <section className="site-hero">
        <Orb tone="violet" size={620} style={{ top: -180, left: -160 }} />
        <Orb tone="pink" size={520} style={{ top: 120, right: -160, animationDelay: "-6s" }} />
        <Orb tone="orange" size={360} style={{ bottom: -120, left: "38%", animationDelay: "-11s" }} />
        <div className="site-dots" />

        <div className="site-wrap site-above site-hero-grid">
          <div className="site-hero-copy">
            <span className="site-eyebrow">AI-driven cancer analysis</span>
            <h1 className="site-display">
              From genomic signatures to <span className="site-serif site-gradient-text">actionable insights</span>
            </h1>
            <p className="site-lead">
              OncoMind provides a reproducible, privacy-first demo pipeline that predicts
              drug-response patterns from cancer genomic signatures — built for clean,
              presentation-ready results.
            </p>

            <div className="site-ctas">
              <Link to="/home#demo" className="om-btn om-btn--primary" style={{ textDecoration: "none" }}>
                Try live demo <ArrowUpRight size={17} />
              </Link>
              <a href="#how" className="om-btn" style={{ textDecoration: "none" }}>
                How it works <ArrowDown size={16} />
              </a>
            </div>

            <div className="site-proof-row">
              <div className="site-proof"><b>Local-first</b><span>Runs on your machine</span></div>
              <div className="site-proof"><b>Reproducible</b><span>Synthetic datasets</span></div>
              <div className="site-proof"><b>Extensible</b><span>Swap models easily</span></div>
            </div>
          </div>

          <ScannerShowcase />
        </div>
      </section>

      {/* MOTTO */}
      <Marquee items={["Semper Procedere", "常に前進", "Her zaman ileriye", "Always one step ahead"]} />

      {/* FOCUS AREAS */}
      <section className="site-section">
        <div className="site-wrap">
          <SectionHead eyebrow="Focus" title={<>Three fronts, <span className="site-serif">one mission</span></>}>
            Research, awareness and personalized medicine — the three directions OncoMind is built around.
          </SectionHead>

          <div className="site-bento">
            {focusAreas.map((f, i) => (
              <article key={f.title} className={`site-tile site-tile--aura om-aura--${f.aura} site-reveal`} style={{ minHeight: 340, transitionDelay: `${i * 80}ms` }}>
                <img className="site-tile-img" src={f.img} alt="" loading="lazy" onError={(e) => (e.currentTarget.style.display = "none")} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span className="site-icon">{f.icon}</span>
                  <Pill tone="glass">{f.tag}</Pill>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <h3 className="site-h2" style={{ fontSize: "clamp(28px, 2.6vw, 38px)" }}>{f.title}</h3>
                  <p className="site-body">{f.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT / FEATURES */}
      <section id="product" className="site-section" style={{ paddingTop: 0 }}>
        <div className="site-wrap">
          <SectionHead eyebrow="Product" title={<>What it <span className="site-serif">does</span></>} />

          <div className="site-bento">
            <article className="site-tile site-tile--aura om-aura--violet site-half site-reveal">
              <span className="site-icon"><Sparkles size={20} /></span>
              <ul className="site-list site-list--light">
                <li><span className="site-list-num">01</span>Processes genomic signatures, runs a trained model, and returns interpretable predictions suitable for slide-ready export and discussion</li>
                <li><span className="site-list-num">02</span>Helps doctors refine treatment processes with data-driven insights and confidence scores</li>
                <li><span className="site-list-num">03</span>Provides analytics that help researchers decrease project timelines and accelerate discovery</li>
              </ul>
            </article>

            <div className="site-half site-quad">
              {features.map((f, i) => (
                <article key={f.title} className="site-tile site-reveal" style={{ minHeight: 0, transitionDelay: `${i * 60}ms` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span className="site-icon">{f.icon}</span>
                    <span className="site-tile-num" style={{ fontSize: 34 }}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <h3 className="site-h3">{f.title}</h3>
                    <p className="site-body">{f.text}</p>
                  </div>
                </article>
              ))}
            </div>
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

      {/* TESTIMONIAL / PROOF */}
      <section className="site-section" style={{ paddingTop: 0 }}>
        <div className="site-wrap site-split site-reveal" style={{ alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <span className="site-eyebrow">Proof</span>
            <h2 className="site-h2">Trusted for <span className="site-serif">demos</span></h2>
            <p className="site-lead">
              A lightweight tool designed to present model behavior clearly and ethically,
              without compromising patient privacy or data security.
            </p>
          </div>
          <figure style={{ margin: 0 }}>
            <blockquote className="site-quote">
              “Great for live demos — zero surprises for judges. The reproducibility and
              clear explanations made our presentation stand out.”
            </blockquote>
            <figcaption className="site-quote-by">— Research Team Lead</figcaption>
          </figure>
        </div>
      </section>

      {/* CTA */}
      <section className="site-section" style={{ paddingTop: 0 }}>
        <div className="site-wrap">
          <div className="site-cta site-reveal">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <h2 className="site-h2">Ready to streamline your research <span className="site-serif">presentation?</span></h2>
              <p className="site-lead">Quick demo, slide-ready output, no patient data required</p>
            </div>
            <Link to="/home#demo" className="om-btn om-btn--glass" style={{ textDecoration: "none", padding: "0 24px", "--h": "48px" } as React.CSSProperties}>
              Run a Demo <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
