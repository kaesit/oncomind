// src/pages/Contact.tsx
import React from "react";
import { ArrowUpRight, CircleDot, Github, MapPin, MessageSquarePlus } from "lucide-react";
import { PhotoHero, useReveal } from "../site/parts";
import { IMG } from "../site/images";

const REPO = "https://github.com/kaesit/oncomind";

const channels = [
     {
          icon: <MessageSquarePlus size={20} />,
          title: "Open an issue",
          text: "Ideas, questions, bugs or collaboration proposals — the fastest way to reach us.",
          href: `${REPO}/issues/new`,
          cta: "New issue",
     },
     {
          icon: <Github size={20} />,
          title: "Browse the repository",
          text: "Read the code, follow the progress, or star the project to keep up with it.",
          href: REPO,
          cta: "View on GitHub",
     },
];

export default function Contact() {
     const ref = useReveal();

     return (
          <div ref={ref}>
               <PhotoHero
                    image={IMG.fluidSwirl}
                    tint="violet"
                    eyebrow="Collaborate"
                    title={<>Get in <span className="site-serif">Touch</span></>}
                    lead="We are always looking for partners in clinical research, bioinformatics, and healthcare technology. Whether you are a researcher, clinician, or developer, let's build the future of medicine together."
               >
                    <div className="site-proof-row">
                         <span className="site-glass-chip"><MapPin size={14} /> Elazığ, Türkiye</span>
                    </div>
               </PhotoHero>

               <section className="site-section">
                    <div className="site-wrap">
                         <div className="site-bento">
                              {channels.map((c, i) => (
                                   <a
                                        key={c.title}
                                        href={c.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="site-tile site-half site-link-tile site-reveal"
                                        style={{ minHeight: 260, textDecoration: "none", transitionDelay: `${i * 80}ms` }}
                                   >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                             <span className="site-icon">{c.icon}</span>
                                             <ArrowUpRight size={22} className="site-muted" />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                             <h2 className="site-h2" style={{ fontSize: "clamp(28px, 2.8vw, 40px)" }}>{c.title}</h2>
                                             <p className="site-body">{c.text}</p>
                                             <span className="om-pill om-pill--ink" style={{ alignSelf: "flex-start", marginTop: 6 }}>{c.cta}</span>
                                        </div>
                                   </a>
                              ))}
                         </div>

                         <div
                              className="site-tile site-reveal"
                              style={{ minHeight: 0, marginTop: 14, flexDirection: "row", alignItems: "center", gap: 14, flexWrap: "wrap", background: "transparent", boxShadow: "none", border: "1.5px dashed var(--om-border-strong)" }}
                         >
                              <span className="site-icon"><CircleDot size={18} /></span>
                              <p className="site-body" style={{ flex: 1, minWidth: 220 }}>
                                   There's no contact form or email address yet — GitHub is the place to reach us.
                              </p>
                         </div>
                    </div>
               </section>
          </div>
     );
}
