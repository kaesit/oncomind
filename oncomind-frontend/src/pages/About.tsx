import React, { useEffect, useRef } from "react";
import "../css/About.css";
import Footer from "../components/Footer";

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
    <>
      <div className="about-page" ref={rootRef}>
        {/* HERO */}
        <section className="hero-section reveal">
          <div className="hero-content">
            <h1 className="hero-title">
              Precision-Engineered AI for
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
              src="https://cdn.cosmos.so/6990b780-d4c3-4764-aa2d-4575d6d6bd2f?format=jpeg"
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
              src="https://images.unsplash.com/photo-1606206873764-fd15e242df52?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
              <li>Computer Vision inference pipelines</li>
              <li>On-device accelerated segmentation</li>
              <li>FastAPI backend with modular endpoints</li>
              <li>PyTorch, ONNX interoperability</li>
              <li>3D molecular visualization for protein targets</li>
            </ul>
          </div>

          <div className="section-image">
            <img
              src="https://cdn.cosmos.so/df64935a-3d99-46e0-bc38-9daa349f2947?format=jpeg"
              alt="Technical Architecture"
              loading="lazy"
            />
          </div>
        </section>

        {/* FULL WIDTH */}
        <section className="full-width-image reveal">
          <img
            src="https://images.unsplash.com/photo-1620121478247-ec786b9be2fa?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="bg-image"
            loading="lazy"
            alt="Background"
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


      </div>
      <Footer />
    </>
  );
};

export default About;