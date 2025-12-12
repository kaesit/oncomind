import React, { useEffect, useRef } from "react";
import "../css/About.css";
const About: React.FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current ?? document;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add("active");
          } else {
            // keep it visible after reveal; remove this line if you want persistent reveal
            // el.classList.remove("active");
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12,
      }
    );

    const targets = root.querySelectorAll(".reveal");
    targets.forEach((t) => observer.observe(t));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page" ref={rootRef}>
      {/* HERO */}
      <section className="hero-section reveal">
        <div className="hero-content">
          <h1 className="hero-title">
            Precision-Engineered AI for
            <br />
            <span className="neon-accent">Medical Intelligence</span>
          </h1>
          <p className="hero-text">
            We architect intelligent systems designed to augment clinical workflows,
            accelerate biomedical research, and transform oncology through accurate
            image-driven diagnostics.
          </p>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1557825835-70d97c4aa567?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWVkaWNhbCUyMHRlY2h8ZW58MHx8MHx8fDA%3D"
            alt="Medical Tech"
            loading="lazy"
          />
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="section-block reveal">
        <div className="section-text">
          <h2 className="section-title">Design Philosophy</h2>
          <p>
            Our UI and computational architecture follow a techno-minimalistic
            paradigm: transparent information flow, readable data hierarchy,
            modular machine learning pipelines, and a visual language inspired by
            clinical precision instruments.
          </p>
        </div>

        <div className="section-image">
          <img
            src="https://images.unsplash.com/photo-1582560469781-1965b9af903d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNhbCUyMHRlY2h8ZW58MHx8MHx8fDA%3D"
            alt="Design Philosophy"
            loading="lazy"
          />
        </div>
      </section>

      {/* TECH STACK */}
      <section className="section-block reverse reveal">
        <div className="section-text">
          <h2 className="section-title">Technical Framework</h2>
          <ul className="tech-list">
            <li>— Computer Vision inference pipelines</li>
            <li>— On-device accelerated segmentation</li>
            <li>— FastAPI backend with modular endpoints</li>
            <li>— PyTorch, ONNX interoperability</li>
            <li>— 3D molecular visualization for protein targets</li>
          </ul>
        </div>

        <div className="section-image">
          <img
            src="https://images.unsplash.com/photo-1720962158813-29b66b8e23e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHVpfGVufDB8fDB8fHww"
            alt="Technical Architecture"
            loading="lazy"
          />
        </div>
      </section>

      {/* FULL WIDTH — fixed layout */}
      <section className="full-width-image reveal">
        <img
          src="https://images.unsplash.com/photo-1635776063043-ab23b4c226f6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGdyYWRpZW50JTIwYmFja2dyb3VuZHxlbnwwfDB8MHx8fDA%3D"
          className="bg-image"
          loading="lazy"
        />
        <div className="overlay">
          <h2>Oncology-Driven Computer Vision</h2>
          <p>
            Our platform identifies cellular structures, tissue abnormalities,
            segmentation masks, and diagnostic indicators to assist healthcare
            professionals with reliable precision.
          </p>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="timeline-section reveal">
        <h2 className="section-title">Our Long-Term Development Roadmap</h2>

        <div className="timeline">
          <div className="timeline-item">
            <h3>Phase 1 – Prototype</h3>
            <p>Dataset acquisition, YOLO-based diagnostics, demo pipeline.</p>
          </div>

          <div className="timeline-item">
            <h3>Phase 2 – Core Engine</h3>
            <p>FastAPI backend, ONNX inference, GPU acceleration.</p>
          </div>

          <div className="timeline-item">
            <h3>Phase 3 – Molecular AI</h3>
            <p>Protein-structure integration, ligand scoring, 3D visualization.</p>
          </div>

          <div className="timeline-item">
            <h3>Phase 4 – Clinical UX</h3>
            <p>Dashboard refinement, patient indexing, advanced analytics.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 – OncoMind AI Interface Framework</p>
      </footer>
    </div>
  );
};

export default About;
