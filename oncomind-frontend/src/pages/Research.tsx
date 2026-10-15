// src/pages/Research.tsx
import React from "react";
import { ArrowUpRight, Bot, Database, FileText, FlaskConical, Github, Lightbulb, Rocket } from "lucide-react";
import { ModuleStatus, PhotoHero, SectionHead, StatusTag, useReveal } from "../site/parts";
import { IMG, photo } from "../site/images";

const REPO = "https://github.com/kaesit/oncomind";

/* Describe only what exists; mark the rest by status. */
const cards: { title: string; img: string; status: ModuleStatus; text: string }[] = [
     {
          title: "Rapid Prototyping",
          img: IMG.nucleiPurple,
          status: "working",
          text: "We build small, testable pieces quickly and check them against real data before trusting them. Prototypes are how we find out what doesn't work — early, and cheaply.",
     },
     {
          title: "Custom ML Models",
          img: IMG.cellsPink,
          status: "working",
          text: "Alongside open-source models such as ADMET-AI, we train our own: recurrent molecule generators trained on kinase-target compounds, with training metrics visible in the dashboard.",
     },
     {
          title: "Bioinformatic Research",
          img: IMG.cellsGreen,
          status: "planned",
          text: "Using genomic data to inform treatment research is where we want to go next. It's on the roadmap — there is no genomic analysis in OncoMind yet.",
     },
];

const method = [
     { icon: <Lightbulb size={18} />, text: "Problem-driven hypothesis formulation" },
     { icon: <Database size={18} />, text: "Data acquisition & preprocessing from public research datasets" },
     { icon: <Bot size={18} />, text: "Model prototyping and validation" },
     { icon: <FlaskConical size={18} />, text: "Iterative testing with real biological constraints" },
     { icon: <Rocket size={18} />, text: "Translation into usable research tools" },
];

const resources = [
     { icon: <Github size={18} />, text: "OncoMind source code", sub: "Everything we build, in the open", href: REPO },
     { icon: <FlaskConical size={18} />, text: "ADMET-AI", sub: "The open-source model behind our toxicity predictions", href: "https://github.com/swansonk14/admet_ai" },
];

export default function Research() {
     const ref = useReveal();

     return (
          <div ref={ref}>
               <PhotoHero
                    image={IMG.microscopeSilhouette}
                    tint="violet"
                    position="center 40%"
                    eyebrow="Research"
                    title={<>Science you can <span className="site-serif">follow</span></>}
                    lead="You don't need a PhD in bioinformatics to understand our mission. We translate complex data into research tools through careful, iterative work — and we show you exactly where each one stands."
               />

               {/* INFORMATION CARDS */}
               <section className="site-section">
                    <div className="site-wrap">
                         <SectionHead eyebrow="Focus" title={<>What we <span className="site-serif site-gradient-text">work on</span></>} />
                         <div className="site-bento">
                              {cards.map((c, i) => (
                                   <article key={c.title} className="site-photo-tile site-reveal" style={{ minHeight: 500, transitionDelay: `${i * 80}ms` }}>
                                        <img src={photo(c.img, 1200)} alt="" loading="lazy" />
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                             <span className="site-tile-num" style={{ fontSize: 34, color: "rgba(255,255,255,0.6)" }}>{String(i + 1).padStart(2, "0")}</span>
                                             <StatusTag status={c.status} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                             <h2 className="site-h2" style={{ fontSize: "clamp(28px, 2.6vw, 36px)" }}>{c.title}</h2>
                                             <p className="site-body">{c.text}</p>
                                        </div>
                                   </article>
                              ))}
                         </div>
                         <p className="site-source site-reveal" style={{ marginTop: 14 }}>Microscopy imagery via Unsplash.</p>
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

               {/* RESOURCES */}
               <section className="site-section" style={{ paddingTop: 0 }}>
                    <div className="site-wrap">
                         <SectionHead eyebrow="Library" title={<>Open <span className="site-serif">resources</span></>}>
                              We haven't published any papers yet. When we do, they'll be listed here — until then, the code is the record.
                         </SectionHead>
                         <div className="site-bento">
                              {resources.map((p, i) => (
                                   <a
                                        key={p.text}
                                        href={p.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="site-tile site-half site-reveal site-link-tile"
                                        style={{ minHeight: 170, textDecoration: "none", transitionDelay: `${i * 60}ms` }}
                                   >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                             <span className="site-icon">{p.icon}</span>
                                             <ArrowUpRight size={20} className="site-muted" />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                             <h3 className="site-h3">{p.text}</h3>
                                             <p className="site-body site-muted">{p.sub}</p>
                                        </div>
                                   </a>
                              ))}
                         </div>
                         <div className="site-tile site-reveal" style={{ minHeight: 0, marginTop: 14, flexDirection: "row", alignItems: "center", gap: 14, background: "transparent", boxShadow: "none", border: "1.5px dashed var(--om-border-strong)" }}>
                              <span className="site-icon"><FileText size={18} /></span>
                              <p className="site-body" style={{ flex: 1 }}>Publications — none yet.</p>
                              <StatusTag status="planned" />
                         </div>
                    </div>
               </section>
          </div>
     );
}
