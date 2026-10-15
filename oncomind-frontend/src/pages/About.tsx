import React from "react";
import { PhotoHero, SectionHead, StatusTag, useReveal } from "../site/parts";
import { IMG, photo } from "../site/images";

/* The real stack — every line here can be checked in the repository. */
const techList = [
  "React + TypeScript dashboard, charts built with visx",
  "C# / .NET API gateway with MongoDB",
  "Python FastAPI service for the machine-learning models",
  "PyTorch models with ONNX export",
  "RDKit and ADMET-AI for chemistry and toxicity",
  "Docker Compose to run everything locally",
];

const phases = [
  { title: "Phase 1 – Prototype", text: "Dataset acquisition, YOLO-based detection experiments, demo pipeline." },
  { title: "Phase 2 – Core Engine", text: "FastAPI backend, ONNX inference, GPU acceleration." },
  { title: "Phase 3 – Molecular AI", text: "Protein-structure integration, ligand scoring, 3D visualization." },
  { title: "Phase 4 – Clinical UX", text: "Dashboard refinement, patient indexing, advanced analytics." },
];

const About: React.FC = () => {
  const ref = useReveal();

  return (
    <div ref={ref}>
      {/* HERO */}
      <PhotoHero
        image={IMG.cellPurple}
        tint="magenta"
        position="70% center"
        eyebrow="About us"
        title={<>Precision-Engineered AI for <span className="site-serif">Medical Intelligence</span></>}
        lead="OncoMind is an experimental research project exploring how AI could support oncology research — from designing molecules to reading medical images. It's built in the open and is not a medical device."
      />

      {/* PHILOSOPHY */}
      <section className="site-section">
        <div className="site-wrap site-split site-reveal">
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <span className="site-eyebrow">01 — Philosophy</span>
            <h2 className="site-h2">Design <span className="site-serif site-gradient-text">Philosophy</span></h2>
            <p className="site-lead">
              Our UI and computational architecture follow a techno-minimalistic
              paradigm: transparent information flow, readable data hierarchy,
              modular machine learning pipelines, and a visual language inspired by
              clinical precision instruments.
            </p>
          </div>
          <div className="site-frame" style={{ aspectRatio: "4 / 5", borderRadius: 36 }}>
            <img src={photo(IMG.cellsPink, 1400)} alt="" loading="lazy" />
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="site-section" style={{ paddingTop: 0 }}>
        <div className="site-wrap site-split site-split--reverse site-reveal">
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <span className="site-eyebrow">02 — Stack</span>
            <h2 className="site-h2">Technical <span className="site-serif">Framework</span></h2>
            <ul className="site-list">
              {techList.map((t, i) => (
                <li key={t}>
                  <span className="site-list-num">{String(i + 1).padStart(2, "0")}</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="site-frame" style={{ aspectRatio: "4 / 5", borderRadius: 36 }}>
            <img src={photo(IMG.iridescent, 1400)} alt="" loading="lazy" />
          </div>
        </div>
      </section>

      {/* FULL WIDTH */}
      <section className="site-section--tight">
        <div className="site-wrap">
          <div className="site-photo-tile site-reveal" style={{ minHeight: 560, borderRadius: 40, padding: "clamp(28px, 5vw, 56px)" }}>
            <img src={photo(IMG.nucleiPurple, 2400)} alt="" loading="lazy" />
            <StatusTag status="in-development" />
            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 760 }}>
              <h2 className="site-h2">Oncology-Driven <span className="site-serif">Computer Vision</span></h2>
              <p className="site-lead" style={{ color: "rgba(255,255,255,0.86)" }}>
                We're training segmentation models on public imaging datasets to highlight
                regions worth a closer look. It isn't finished — and it's meant to support
                specialists, never to replace them or give a diagnosis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="site-section">
        <div className="site-wrap">
          <SectionHead eyebrow="Roadmap" title={<>Our Long-Term <span className="site-serif">Development Roadmap</span></>}>
            Plans, not promises — the order may change as we learn.
          </SectionHead>
          <div className="site-timeline">
            {phases.map((p, i) => (
              <article key={p.title} className="site-phase site-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="site-phase-bar" aria-hidden>
                  {/* position in the sequence, not progress */}
                  <span style={{ width: `${100 / phases.length}%`, marginLeft: `${(i * 100) / phases.length}%` }} />
                </div>
                <span className="site-dot-num" style={{ fontSize: 40, color: "var(--om-faint)" }}>{i + 1}</span>
                <h3 className="site-h3">{p.title}</h3>
                <p className="site-body">{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
