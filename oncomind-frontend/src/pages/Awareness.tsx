import React from 'react';
import { ArrowDown, Brain, Check, ShieldCheck, Stethoscope } from 'lucide-react';
import { Pill } from '../dashboard/ui';
import { Orb, SectionHead, useReveal } from '../site/parts';

const pillars = [
     {
          icon: <Stethoscope size={20} />,
          title: "Early Detection",
          text: "Finding cancer early often allows for more treatment options. Don't wait for symptoms to become severe.",
          items: ["Perform monthly self-exams", "Schedule regular screenings", "Know your family history"],
     },
     {
          icon: <Brain size={20} />,
          title: "Mental Resilience",
          text: "A cancer diagnosis affects the mind as much as the body. Your emotional health is a vital part of recovery.",
          items: ["Manage anxiety & stress", "Seek support groups", "Practice mindfulness"],
          highlight: true,
     },
     {
          icon: <ShieldCheck size={20} />,
          title: "Active Prevention",
          text: "Up to 50% of cancers are preventable. Small lifestyle changes today can lower your risk tomorrow.",
          items: ["Quit tobacco products", "Sun safety & SPF", "Plant-based nutrition"],
     },
];

const screenings = [
     { age: "21+", title: "Cervical Health", text: "Pap tests every 3 years." },
     { age: "40+", title: "Breast Health", text: "Annual mammograms." },
     { age: "45+", title: "Colorectal Health", text: "Colonoscopy tests." },
     { age: "50+", title: "Prostate Health", text: "PSA blood test discussion." },
];

const myths = [
     {
          myth: "“If no one in my family has cancer, I'm not at risk.”",
          fact: "Only 5-10% of cancers are hereditary. Most are caused by aging and lifestyle factors.",
     },
     {
          myth: "“Sugar causes cancer to grow faster.”",
          fact: "Sugar doesn't directly speed up growth, but high sugar intake leads to obesity, a major risk factor.",
     },
];

const AwarenessPage = () => {
     const ref = useReveal();

     return (
          <div ref={ref}>
               {/* --- HERO SECTION --- */}
               <section className="site-hero">
                    <Orb tone="pink" size={620} style={{ top: -220, right: -140 }} />
                    <Orb tone="orange" size={420} style={{ bottom: -160, left: -100, animationDelay: "-7s" }} />
                    <div className="site-dots" />
                    <div className="site-wrap site-above" style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 980 }}>
                         <span className="site-eyebrow">Patient Education</span>
                         <h1 className="site-display">
                              Your Health, <span className="site-serif site-gradient-text">Your Journey</span>
                         </h1>
                         <p className="site-lead">
                              Cancer awareness is more than just a ribbon. It is about knowing your body,
                              understanding your risks, and nurturing your mental well-being in the dark times.
                         </p>
                         <div className="site-ctas">
                              <a href="#screening" className="om-btn om-btn--primary" style={{ textDecoration: "none" }}>
                                   Get Screened <ArrowDown size={16} />
                              </a>
                         </div>
                    </div>
               </section>

               {/* --- PILLARS SECTION --- */}
               <section className="site-section" style={{ paddingTop: 0 }}>
                    <div className="site-wrap">
                         <div className="site-bento">
                              {pillars.map((p, i) => (
                                   <article
                                        key={p.title}
                                        className={`site-tile site-reveal ${p.highlight ? "site-tile--aura om-aura--pink" : ""}`}
                                        style={{ minHeight: 380, transitionDelay: `${i * 80}ms` }}
                                   >
                                        <span className="site-icon">{p.icon}</span>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                             <h3 className="site-h2" style={{ fontSize: "clamp(28px, 2.6vw, 36px)" }}>{p.title}</h3>
                                             <p className="site-body">{p.text}</p>
                                             <ul className="site-list" style={{ marginTop: 4 }}>
                                                  {p.items.map((it) => (
                                                       <li key={it} style={{ padding: "10px 0", color: "inherit", borderColor: p.highlight ? "rgba(255,255,255,0.22)" : undefined }}>
                                                            <Check size={15} style={{ flex: "none" }} /> {it}
                                                       </li>
                                                  ))}
                                             </ul>
                                        </div>
                                   </article>
                              ))}
                         </div>
                    </div>
               </section>

               {/* --- SCREENING GUIDELINES --- */}
               <section id="screening" className="site-section" style={{ paddingTop: 0 }}>
                    <div className="site-wrap">
                         <SectionHead eyebrow="Screening" title={<>Screening <span className="site-serif">Guidelines</span></>}>
                              General estimates for adults (consult your doctor):
                         </SectionHead>
                         <div className="site-timeline">
                              {screenings.map((s, i) => (
                                   <article key={s.title} className="site-phase site-reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                                        <span className="site-muted" style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>Age</span>
                                        <span className="site-dot-num site-gradient-text" style={{ fontSize: 56 }}>{s.age}</span>
                                        <h3 className="site-h3">{s.title}</h3>
                                        <p className="site-body">{s.text}</p>
                                   </article>
                              ))}
                         </div>
                         <p className="site-muted site-reveal" style={{ fontSize: 13, marginTop: 18 }}>
                              * These are general estimates. High-risk individuals need earlier screening.
                         </p>
                    </div>
               </section>

               {/* --- MYTHS vs FACTS --- */}
               <section className="site-section" style={{ paddingTop: 0 }}>
                    <div className="site-wrap">
                         <SectionHead eyebrow="Myths vs facts" title={<>Debunking <span className="site-serif">Myths</span></>} />
                         <div className="site-bento">
                              {myths.map((m, i) => (
                                   <article key={m.myth} className="site-myth site-half site-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                                        <Pill style={{ alignSelf: "flex-start", color: "var(--om-urgent)" }}>Myth</Pill>
                                        <p className="site-myth-claim">{m.myth}</p>
                                        <Pill tone="lime" style={{ alignSelf: "flex-start" }}>Fact</Pill>
                                        <p className="site-myth-fact">{m.fact}</p>
                                   </article>
                              ))}
                         </div>
                    </div>
               </section>
          </div>
     );
};

export default AwarenessPage;
