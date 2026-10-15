import React from "react";
import { Pill } from "../dashboard/ui";
import { Orb, SectionHead, useReveal } from "../site/parts";

const techList = [
  "Computer Vision inference pipelines",
  "On-device accelerated segmentation",
  "FastAPI backend with modular endpoints",
  "PyTorch, ONNX interoperability",
  "3D molecular visualization for protein targets",
];

const phases = [
  { title: "Phase 1 – Prototype", text: "Dataset acquisition, YOLO-based diagnostics, demo pipeline." },
  { title: "Phase 2 – Core Engine", text: "FastAPI backend, ONNX inference, GPU acceleration." },
  { title: "Phase 3 – Molecular AI", text: "Protein-structure integration, ligand scoring, 3D visualization." },
  { title: "Phase 4 – Clinical UX", text: "Dashboard refinement, patient indexing, advanced analytics." },
];

const About: React.FC = () => {
  const ref = useReveal();

  return (
    <div ref={ref}>
      {/* HERO */}
      <section className="site-hero">
        <Orb tone="teal" size={520} style={{ top: -160, right: -120 }} />
        <Orb tone="violet" size={460} style={{ bottom: -180, left: -140, animationDelay: "-8s" }} />
        <div className="site-dots" />
        <div className="site-wrap site-above site-hero-grid">
          <div className="site-hero-copy">
            <span className="site-eyebrow">About us</span>
            <h1 className="site-display">
              Precision-Engineered AI for <span className="site-serif site-gradient-text">Medical Intelligence</span>
            </h1>
            <p className="site-lead">
              We architect intelligent systems designed to augment clinical workflows,
              accelerate biomedical research, and transform oncology through accurate
              image-driven diagnostics.
            </p>
          </div>
          <div className="site-frame" style={{ aspectRatio: "4 / 5", borderRadius: 36 }}>
            <img src="https://cdn.cosmos.so/6990b780-d4c3-4764-aa2d-4575d6d6bd2f?format=jpeg" alt="Medical Tech" fetchPriority="high" />
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="site-section" style={{ paddingTop: 0 }}>
        <div className="site-wrap site-split site-reveal">
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <span className="site-eyebrow">01 — Philosophy</span>
            <h2 className="site-h2">Design <span className="site-serif">Philosophy</span></h2>
            <p className="site-lead">
              Our UI and computational architecture follow a techno-minimalistic
              paradigm: transparent information flow, readable data hierarchy,
              modular machine learning pipelines, and a visual language inspired by
              clinical precision instruments.
            </p>
          </div>
          <div className="site-frame">
            <img
              src="https://images.unsplash.com/photo-1606206873764-fd15e242df52?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Design Philosophy"
              loading="lazy"
            />
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
          <div className="site-frame">
            <img src="https://cdn.cosmos.so/df64935a-3d99-46e0-bc38-9daa349f2947?format=jpeg" alt="Technical Architecture" loading="lazy" />
          </div>
        </div>
      </section>

      {/* FULL WIDTH */}
      <section className="site-section--tight">
        <div className="site-wrap">
          <div
            className="site-reveal"
            style={{
              position: "relative",
              borderRadius: 40,
              overflow: "hidden",
              minHeight: 460,
              display: "flex",
              alignItems: "flex-end",
              color: "#fff",
              background: "#0b0b0e",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1620121478247-ec786b9be2fa?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Background"
              loading="lazy"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.75 }}
            />
            <div
              style={{
                position: "relative",
                padding: "clamp(28px, 5vw, 56px)",
                width: "100%",
                background: "linear-gradient(180deg, transparent 0%, rgba(8,8,10,0.85) 70%)",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <Pill tone="glass">Computer vision</Pill>
              <h2 className="site-h2" style={{ maxWidth: 760 }}>Oncology-Driven <span className="site-serif">Computer Vision</span></h2>
              <p className="site-lead" style={{ color: "rgba(255,255,255,0.82)" }}>
                Our platform identifies cellular structures, tissue abnormalities,
                segmentation masks, and diagnostic indicators to assist healthcare
                professionals with reliable precision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="site-section">
        <div className="site-wrap">
          <SectionHead eyebrow="Roadmap" title={<>Our Long-Term <span className="site-serif">Development Roadmap</span></>} />
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
