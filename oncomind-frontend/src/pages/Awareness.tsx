import React from 'react';
import { ArrowUpRight, Brain, Check, ShieldCheck, Stethoscope } from 'lucide-react';
import { Pill } from '../dashboard/ui';
import { PhotoHero, SectionHead, useReveal } from '../site/parts';
import { IMG, photo } from '../site/images';

/* Every number on this page must come from a linked, checked source. */
const WHO = "https://www.who.int/news-room/fact-sheets/detail/cancer";
const ACS_HEREDITARY = "https://www.cancer.org/cancer/risk-prevention/genetics/family-cancer-syndromes.html";
const NCI_MYTHS = "https://www.cancer.gov/about-cancer/causes-prevention/risk/myths";
const CRUK_SUGAR = "https://news.cancerresearchuk.org/2023/08/16/sugar-and-cancer-what-you-need-to-know/";

const pillars = [
     {
          icon: <Stethoscope size={20} />,
          img: IMG.dandelionSun,
          title: "Early Detection",
          text: "Finding cancer early often allows for more treatment options. Don't wait for symptoms to become severe.",
          items: ["Know what's normal for your body", "Ask your doctor which screenings suit you", "Know your family history"],
     },
     {
          icon: <Brain size={20} />,
          img: IMG.dandelionsSunset,
          title: "Mental Resilience",
          text: "A cancer diagnosis affects the mind as much as the body. Your emotional health is a vital part of recovery.",
          items: ["Manage anxiety & stress", "Seek support groups", "Practice mindfulness"],
     },
     {
          icon: <ShieldCheck size={20} />,
          img: IMG.wildflowersSunset,
          title: "Active Prevention",
          text: "Around 38% of cancers can currently be prevented by avoiding risk factors. Small changes today can lower your risk tomorrow.",
          items: ["Avoid tobacco", "Protect your skin from the sun", "Eat plenty of vegetables, fruit and whole grains"],
          source: { label: "World Health Organization", href: WHO },
     },
];

const myths = [
     {
          myth: "“If no one in my family has cancer, I'm not at risk.”",
          fact: "Only about 5% to 10% of cancers are passed down from a parent. Most are linked to aging and lifestyle factors.",
          sources: [{ label: "American Cancer Society", href: ACS_HEREDITARY }],
     },
     {
          myth: "“Sugar causes cancer to grow faster.”",
          fact: "No studies have shown that eating sugar makes cancer worse. But a diet high in sugar can lead to weight gain, and excess weight raises the risk of several cancers.",
          sources: [
               { label: "National Cancer Institute", href: NCI_MYTHS },
               { label: "Cancer Research UK", href: CRUK_SUGAR },
          ],
     },
];

function Source({ items }: { items: { label: string; href: string }[] }) {
     return (
          <span className="site-source">
               Source:{" "}
               {items.map((s, i) => (
                    <React.Fragment key={s.href}>
                         {i > 0 && ", "}
                         <a href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
                    </React.Fragment>
               ))}
          </span>
     );
}

const AwarenessPage = () => {
     const ref = useReveal();

     return (
          <div ref={ref}>
               {/* --- HERO SECTION --- */}
               <PhotoHero
                    image={IMG.wildflowersSunset}
                    tint="sunrise"
                    position="center 65%"
                    eyebrow="Patient Education"
                    title={<>Your Health, <span className="site-serif">Your Journey</span></>}
                    lead="Cancer awareness is more than just a ribbon. It is about knowing your body, understanding your risks, and nurturing your mental well-being in the dark times."
               >
                    <div className="site-ctas">
                         <a href={WHO} target="_blank" rel="noreferrer" className="om-btn om-btn--primary" style={{ textDecoration: "none" }}>
                              Read the WHO cancer facts <ArrowUpRight size={16} />
                         </a>
                    </div>
               </PhotoHero>

               {/* --- PILLARS SECTION --- */}
               <section className="site-section">
                    <div className="site-wrap">
                         <SectionHead eyebrow="Three pillars" title={<>Hope starts with <span className="site-serif site-gradient-text">knowing</span></>}>
                              General information to help you ask better questions — not medical advice. Your doctor knows your situation best.
                         </SectionHead>
                         <div className="site-bento">
                              {pillars.map((p, i) => (
                                   <article key={p.title} className="site-photo-tile site-reveal" style={{ minHeight: 520, transitionDelay: `${i * 80}ms` }}>
                                        <img src={photo(p.img, 1200)} alt="" loading="lazy" />
                                        <span className="site-icon">{p.icon}</span>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                             <h3 className="site-h2" style={{ fontSize: "clamp(28px, 2.6vw, 36px)" }}>{p.title}</h3>
                                             <p className="site-body">{p.text}</p>
                                             <ul className="site-list site-list--light" style={{ marginTop: 4 }}>
                                                  {p.items.map((it) => (
                                                       <li key={it} style={{ padding: "10px 0" }}>
                                                            <Check size={15} style={{ flex: "none" }} /> {it}
                                                       </li>
                                                  ))}
                                             </ul>
                                             {p.source && (
                                                  <span className="site-source" style={{ color: "rgba(255,255,255,0.7)" }}>
                                                       Source: <a href={p.source.href} target="_blank" rel="noreferrer">{p.source.label}</a>
                                                  </span>
                                             )}
                                        </div>
                                   </article>
                              ))}
                         </div>
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
                                        <Source items={m.sources} />
                                   </article>
                              ))}
                         </div>
                    </div>
               </section>
          </div>
     );
};

export default AwarenessPage;
