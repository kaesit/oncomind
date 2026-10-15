// src/pages/Future.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, FlaskConical, Github, HeartPulse, Scaling, ShieldCheck } from "lucide-react";
import { StatusTag, useReveal, type ModuleStatus } from "../site/parts";
import { IMG, photo, photoSrcSet } from "../site/images";

/**
 * Optional hero footage. Drop a clip in `public/` (e.g. public/media/lab.mp4)
 * and set this to "/media/lab.mp4" — the hero then plays it instead of the
 * still, with the photo as the poster frame. Empty on purpose: we don't ship
 * borrowed stock footage.
 */
const HERO_VIDEO = "";

const REPO = "https://github.com/kaesit/oncomind";

/** React 18 only forwards the lowercase DOM attribute for fetch priority. */
const HIGH_PRIORITY = { fetchpriority: "high" } as unknown as React.ImgHTMLAttributes<HTMLImageElement>;

/* The three chapters, each with its own full-bleed backdrop. */
const CHAPTERS: { n: string; title: React.ReactNode; lead: string; points: string[]; image: string }[] = [
     {
          n: "01",
          title: <>One cancer is <em>not enough</em></>,
          lead: "Today the generator only knows leukemia. It was trained on inhibitors for leukemia-associated targets, so leukemia chemistry is the only chemistry it can speak.",
          points: [
               "Leukemia was the starting point because its targets are well documented in public bioactivity data.",
               "The same pipeline — curate, train, generate, screen — is not specific to leukemia. Other tumour types need their own curated corpora.",
               "The ambition: one workbench a researcher can point at the disease they actually work on.",
          ],
          image: IMG.cellsFluorescent,
     },
     {
          n: "02",
          title: <>Two architectures are <em>not enough</em></>,
          lead: "There are exactly two generators in the system: an LSTM that writes molecules as SMILES strings, and a graph model that builds them atom by atom. Each one fails in its own direction.",
          points: [
               "Sequence models stay close to what they were trained on; graph models wander off into structures nobody could synthesise.",
               "No single metric exposes that — a model can look excellent on validity while quietly memorising or degenerating.",
               "The goal is a third approach, designed from the start around the trade-off instead of around one headline number.",
          ],
          image: IMG.nucleiPurple,
     },
     {
          n: "03",
          title: <>A screen is <em>not enough</em></>,
          lead: "Every molecule here exists only in silico. Nothing has been synthesised, nothing has been tested in a lab, and nothing has been near a patient.",
          points: [
               "In-silico work earns its value only when it saves somebody real bench time — or real harm.",
               "That means being honest about what the software cannot do, as loudly as about what it can.",
               "The next step is collaboration with people who can take a candidate out of the screen and into glassware.",
          ],
          image: IMG.microscopeSilhouette,
     },
];

/* What a new generator would have to get right — all three at once. */
const TARGETS = [
     {
          icon: <FlaskConical size={20} />,
          title: "Synthetic accessibility",
          text: "A molecule that no chemist can actually make is a drawing, not a candidate. Synthesisability has to be part of how the model generates, not a filter bolted on afterwards.",
     },
     {
          icon: <Scaling size={20} />,
          title: "Drug-likeness",
          text: "Scoring well on drug-likeness while reproducing compounds from the training set is not discovery. Novelty against the training corpus has to count as much as the score itself.",
     },
     {
          icon: <ShieldCheck size={20} />,
          title: "Lower predicted toxicity",
          text: "Toxicity is screened today with ADMET-AI after generation. Pulling it forward — so the model avoids the liability instead of being told about it later — is the harder, better problem.",
     },
];

/* Honest horizon: what runs, what is being built, what is only an intention. */
const HORIZON: { when: string; title: string; text: string; status: ModuleStatus }[] = [
     {
          when: "Running today",
          title: "Leukemia candidate generation",
          text: "LSTM and graph generators, with drug-likeness and synthetic accessibility scoring on the output.",
          status: "working",
     },
     {
          when: "Running today",
          title: "ADMET toxicity screening",
          text: "Predicted organ-level toxicity for a candidate, shown on the body map in the dashboard.",
          status: "working",
     },
     {
          when: "Being built",
          title: "Imaging support",
          text: "CT-based detection work is in progress and is not wired into the clinical views yet.",
          status: "in-development",
     },
     {
          when: "Intention",
          title: "A new generator architecture",
          text: "One model optimising synthesisability, drug-likeness and predicted toxicity together, after the current comparison study is finished.",
          status: "planned",
     },
     {
          when: "Intention",
          title: "Beyond leukemia",
          text: "Curated corpora and trained generators for further tumour types, one target family at a time.",
          status: "planned",
     },
     {
          when: "Intention",
          title: "Bench collaboration",
          text: "Working with a wet lab so a generated candidate can finally be made and measured, not just scored.",
          status: "planned",
     },
];

export default function Future() {
     const reveal = useReveal<HTMLDivElement>();
     const heroRef = useRef<HTMLElement>(null);
     const [active, setActive] = useState(0);

     /* Cheap parallax: one rAF-throttled var write, no layout reads in the handler. */
     useEffect(() => {
          const hero = heroRef.current;
          if (!hero || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
          let frame = 0;
          const onScroll = () => {
               if (frame) return;
               frame = requestAnimationFrame(() => {
                    frame = 0;
                    const y = Math.min(window.scrollY, window.innerHeight);
                    hero.style.setProperty("--fut-shift", `${y * 0.18}px`);
               });
          };
          onScroll();
          window.addEventListener("scroll", onScroll, { passive: true });
          return () => {
               window.removeEventListener("scroll", onScroll);
               if (frame) cancelAnimationFrame(frame);
          };
     }, []);

     /* The backdrop behind the chapters swaps to whichever one is centred. */
     const chapterRefs = useRef<(HTMLElement | null)[]>([]);
     useEffect(() => {
          const nodes = chapterRefs.current.filter(Boolean) as HTMLElement[];
          if (!nodes.length || !("IntersectionObserver" in window)) return;
          const io = new IntersectionObserver(
               (entries) => {
                    entries.forEach((e) => {
                         if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
                    });
               },
               { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
          );
          nodes.forEach((n) => io.observe(n));
          return () => io.disconnect();
     }, []);

     return (
          <div className="site-fut" ref={reveal}>
               {/* ------------------------------------------------------- hero */}
               <section className="site-fut-hero" ref={heroRef}>
                    {HERO_VIDEO ? (
                         <video
                              className="site-fut-media"
                              src={HERO_VIDEO}
                              poster={photo(IMG.lightWave, 2400)}
                              autoPlay
                              muted
                              loop
                              playsInline
                         />
                    ) : (
                         <img
                              className="site-fut-media"
                              src={photo(IMG.lightWave, 2400)}
                              srcSet={photoSrcSet(IMG.lightWave)}
                              sizes="100vw"
                              alt=""
                              {...HIGH_PRIORITY}
                         />
                    )}
                    <div className="site-fut-grade" aria-hidden />

                    <div className="site-wrap site-fut-hero-inner">
                         <span className="site-eyebrow site-eyebrow--light">The road ahead</span>
                         <h1 className="site-fut-display">
                              This is <em>not enough</em>.
                         </h1>
                         <p className="site-fut-lead">
                              OncoMind can generate leukemia-focused molecules and screen them for predicted toxicity. That is a
                              beginning, not a destination. This page is the part of the project that has not been built yet — written
                              down so it can be argued with.
                         </p>
                         <a className="site-fut-cue" href="#chapters" style={{ textDecoration: "none" }}>
                              <ArrowDown size={15} /> Keep reading
                         </a>
                         <div className="site-fut-strip">
                              <span><b>Leukemia</b> targets only</span>
                              <span><b>Two</b> generator architectures</span>
                              <span><b>In silico</b> — nothing synthesised</span>
                              <span><b>Open source</b></span>
                         </div>
                    </div>
               </section>

               {/* --------------------------------------------------- chapters */}
               <div className="site-fut-stage" id="chapters">
                    <div className="site-fut-sticky" aria-hidden>
                         {CHAPTERS.map((c, i) => (
                              <img
                                   key={c.n}
                                   className="site-fut-layer"
                                   data-on={i === active}
                                   src={photo(c.image, 2400)}
                                   srcSet={photoSrcSet(c.image)}
                                   sizes="100vw"
                                   alt=""
                                   loading="lazy"
                              />
                         ))}
                         <div className="site-fut-grade" style={{ zIndex: 0 }} />
                    </div>

                    <div className="site-fut-chapters site-wrap">
                         {CHAPTERS.map((c, i) => (
                              <article
                                   key={c.n}
                                   className="site-fut-chapter"
                                   data-index={i}
                                   ref={(el) => { chapterRefs.current[i] = el; }}
                              >
                                   <div className="site-fut-panel">
                                        <span className="site-dot-num">{c.n}</span>
                                        <h2>{c.title}</h2>
                                        <p className="site-body">{c.lead}</p>
                                        <ul className="site-fut-points">
                                             {c.points.map((p) => <li key={p}>{p}</li>)}
                                        </ul>
                                   </div>
                              </article>
                         ))}
                    </div>
               </div>

               {/* ---------------------------------------------------- targets */}
               <section className="site-section">
                    <div className="site-wrap">
                         <div className="site-head site-reveal">
                              <div>
                                   <span className="site-eyebrow site-eyebrow--light">The algorithm I want to build</span>
                                   <h2 className="site-h2">Three things at <span className="site-serif">once</span></h2>
                              </div>
                              <p className="site-lead">
                                   Generators usually win on one axis by losing another: easy to synthesise but dull, or novel but
                                   impossible to make. A model worth building has to hold all three at the same time.
                              </p>
                         </div>

                         <div className="site-fut-grid">
                              {TARGETS.map((t, i) => (
                                   <div key={t.title} className="site-fut-card site-reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                                        <span className="site-icon">{t.icon}</span>
                                        <h3>{t.title}</h3>
                                        <p>{t.text}</p>
                                        <span className="site-fut-metric">Design target — not a result</span>
                                   </div>
                              ))}
                         </div>
                    </div>
               </section>

               {/* ---------------------------------------------------- horizon */}
               <section className="site-section" style={{ paddingTop: 0 }}>
                    <div className="site-wrap">
                         <div className="site-head site-reveal">
                              <div>
                                   <span className="site-eyebrow site-eyebrow--light">Horizon</span>
                                   <h2 className="site-h2">What runs, what is being built, what is only an <span className="site-serif">intention</span></h2>
                              </div>
                              <p className="site-lead">
                                   No dates, because promising one would be the easiest thing on this page to get wrong.
                              </p>
                         </div>

                         <div className="site-fut-track site-reveal">
                              {HORIZON.map((h) => (
                                   <div key={h.title} className="site-fut-row">
                                        <span>{h.when}</span>
                                        <div>
                                             <h4>{h.title}</h4>
                                             <p>{h.text}</p>
                                        </div>
                                        <StatusTag status={h.status} />
                                   </div>
                              ))}
                         </div>
                    </div>
               </section>

               {/* ------------------------------------------------------- note */}
               <section className="site-fut-note">
                    <img
                         src={photo(IMG.dandelionsSunset, 2400)}
                         srcSet={photoSrcSet(IMG.dandelionsSunset)}
                         sizes="100vw"
                         alt=""
                         loading="lazy"
                    />
                    <div className="site-fut-note-grade" aria-hidden />
                    <div className="site-wrap" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                         <span className="site-eyebrow site-eyebrow--light">Why bother</span>
                         <blockquote className="site-fut-quote">I don&rsquo;t want to help people only from behind a screen.</blockquote>
                         <p>
                              I am not trying to build something world-moving, and I am not chasing a company. I would like the papers
                              and the experimental code to end up as something that actually reaches a person — a candidate somebody can
                              make, a toxicity flag somebody catches early, a tool a researcher opens on a hard afternoon. That is the
                              whole ambition. It is enough to keep going, and it is why none of the current version feels like enough.
                         </p>
                         <span className="site-fut-sign"><i /> Esad Abdullah Kösedağ</span>
                    </div>
               </section>

               {/* ---------------------------------------------------- closing */}
               <section className="site-section">
                    <div className="site-wrap site-fut-end site-reveal">
                         <span className="site-eyebrow site-eyebrow--light">Come with us</span>
                         <h2 className="site-h2" style={{ maxWidth: "18ch" }}>
                              If you can tear a piece of this <span className="site-serif">apart</span>, please do
                         </h2>
                         <p className="site-lead" style={{ maxWidth: "62ch" }}>
                              Chemists, oncologists, ML people, students: the fastest way to make this better is to tell us where it is
                              wrong. Everything is open, and criticism is more useful than praise.
                         </p>
                         <div className="site-ctas">
                              <Link className="om-btn om-btn--primary" to="/contact" style={{ textDecoration: "none" }}>
                                   Write to us <ArrowUpRight size={16} />
                              </Link>
                              <a className="om-btn" href={REPO} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                                   <Github size={16} /> Read the code
                              </a>
                              <Link className="om-btn" to="/research" style={{ textDecoration: "none" }}>
                                   <HeartPulse size={16} /> What works today
                              </Link>
                         </div>
                    </div>
               </section>
          </div>
     );
}
