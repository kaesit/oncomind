// src/pages/Research.tsx
import React from "react";
import { ArrowUpRight, BookOpen, Bot, Database, Dna, FileText, FlaskConical, Github, Lightbulb, Rocket } from "lucide-react";
import { Orb, SectionHead, useReveal } from "../site/parts";

const cards = [
     {
          title: "Rapid Prototyping",
          img: "https://images.unsplash.com/photo-1582560469781-1965b9af903d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aGVhbHRoJTIwdGVjaHxlbnwwfHwwfHx8MA%3D%3D",
          alt: "Healthcare technology prototyping visualization",
          text: "We build and test healthcare software rapidly to ensure safety and efficacy. Our prototyping approach allows us to validate clinical assumptions early, iterate based on real-world feedback, and deliver tools that genuinely improve patient outcomes. Speed meets precision in every build.",
     },
     {
          title: "Custom ML Models",
          img: "https://images.unsplash.com/photo-1531956656798-56686eeef3d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmlvJTIwdGVjaHxlbnwwfDJ8MHx8fDA%3D",
          alt: "Bioinformatics and machine learning datasets",
          text: "Generic models fall short in healthcare. We develop specialized datasets tailored to oncology, genomics, and clinical diagnostics. Our custom-trained models understand the nuances of medical data, delivering accuracy and insights that generic AI simply cannot match.",
     },
     {
          title: "Bioinformatic Research",
          img: "https://plus.unsplash.com/premium_photo-1681843039768-0e22b7a031d5?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "Molecular biology and genomic research",
          text: "From genomic sequencing to protein structure prediction, we conduct real bioinformatics research that bridges computational biology and clinical medicine. Our work transforms raw biological data into actionable insights that advance precision oncology and personalized treatment strategies.",
     },
];

const method = [
     { icon: <Lightbulb size={18} />, text: "Problem-driven hypothesis formulation" },
     { icon: <Database size={18} />, text: "Data acquisition & preprocessing (clinical, genomic, omics)" },
     { icon: <Bot size={18} />, text: "Model prototyping and rapid validation" },
     { icon: <FlaskConical size={18} />, text: "Iterative testing with real biological constraints" },
     { icon: <Rocket size={18} />, text: "Translation into usable healthcare tools" },
];

const publications = [
     { icon: <FileText size={18} />, text: "AI-assisted diagnostics in bioinformatics (2024)", label: "Read our 2024 paper on AI-assisted diagnostics" },
     { icon: <Dna size={18} />, text: "Custom genomic dataset preprocessing framework", label: "Explore our genomic preprocessing framework" },
     { icon: <BookOpen size={18} />, text: "Research notes & methodology", label: "View research methodology notes" },
     { icon: <Github size={18} />, text: "Open-source tools on GitHub", label: "Visit our GitHub repository" },
];

export default function Research() {
     const ref = useReveal();

     return (
          <div ref={ref}>
               <section className="site-hero" style={{ paddingBottom: 0 }}>
                    <Orb tone="pink" size={520} style={{ top: -200, left: "30%" }} />
                    <div className="site-dots" />
                    <div className="site-wrap site-above" style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 980 }}>
                         <span className="site-eyebrow">Research</span>
                         <h1 className="site-display">
                              Science you can <span className="site-serif site-gradient-text">follow</span>
                         </h1>
                         <p className="site-lead">
                              You don't need a PhD in bioinformatics to understand our mission.
                              We translate complex genomic and clinical data into practical healthcare solutions
                              through rigorous, iterative research.
                         </p>
                    </div>
               </section>

               {/* INFORMATION CARDS */}
               <section className="site-section">
                    <div className="site-wrap">
                         <div className="site-bento">
                              {cards.map((c, i) => (
                                   <article key={c.title} className="site-tile site-reveal" style={{ padding: 10, gap: 0, justifyContent: "flex-start", transitionDelay: `${i * 80}ms` }}>
                                        <div className="site-frame" style={{ aspectRatio: "16 / 10", borderRadius: 24, boxShadow: "none" }}>
                                             <img src={c.img} alt={c.alt} loading="lazy" />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "18px 12px 12px" }}>
                                             <span className="site-tile-num" style={{ fontSize: 30 }}>{String(i + 1).padStart(2, "0")}</span>
                                             <h2 className="site-h3" style={{ fontSize: 22 }}>{c.title}</h2>
                                             <p className="site-body">{c.text}</p>
                                        </div>
                                   </article>
                              ))}
                         </div>
                    </div>
               </section>

               {/* METHODOLOGY */}
               <section className="site-section" style={{ paddingTop: 0 }}>
                    <div className="site-wrap site-split site-reveal" style={{ alignItems: "start" }}>
                         <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 110 }}>
                              <span className="site-eyebrow">Method</span>
                              <h2 className="site-h2">Our Research <span className="site-serif">Methodology</span></h2>
                         </div>
                         <ol className="site-list">
                              {method.map((m, i) => (
                                   <li key={m.text} style={{ padding: "20px 0", fontSize: 17, color: "var(--om-text)" }}>
                                        <span className="site-list-num">{String(i + 1).padStart(2, "0")}</span>
                                        <span className="site-icon" style={{ width: 38, height: 38, borderRadius: 12 }}>{m.icon}</span>
                                        {m.text}
                                   </li>
                              ))}
                         </ol>
                    </div>
               </section>

               {/* PUBLICATIONS */}
               <section className="site-section" style={{ paddingTop: 0 }}>
                    <div className="site-wrap">
                         <SectionHead eyebrow="Library" title={<>Publications <span className="site-serif">&amp; Resources</span></>} />
                         <div className="site-bento">
                              {publications.map((p, i) => (
                                   <a
                                        key={p.text}
                                        href="#"
                                        aria-label={p.label}
                                        className="site-tile site-half site-reveal site-link-tile"
                                        style={{ minHeight: 150, textDecoration: "none", transitionDelay: `${i * 60}ms` }}
                                   >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                             <span className="site-icon">{p.icon}</span>
                                             <ArrowUpRight size={20} className="site-muted" />
                                        </div>
                                        <h3 className="site-h3">{p.text}</h3>
                                   </a>
                              ))}
                         </div>
                    </div>
               </section>
          </div>
     );
}
