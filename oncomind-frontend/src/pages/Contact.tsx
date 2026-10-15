// src/pages/Contact.tsx
import React, { useState } from "react";
import { ArrowUpRight, Copy, Github, MapPin, MessageSquarePlus, Send } from "lucide-react";
import { Button, Field, Input, Textarea } from "../dashboard/ui";
import notify from "../dashboard/ui/notify";
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

type Draft = { name: string; email: string; subject: string; message: string };
const EMPTY: Draft = { name: "", email: "", subject: "", message: "" };

/** Formats the draft the same way whether it is sent or copied. */
function compose(d: Draft) {
     const lines = [d.message.trim(), "", "---", `From: ${d.name.trim() || "(not given)"}`];
     if (d.email.trim()) lines.push(`Reply to: ${d.email.trim()}`);
     lines.push("Sent from the OncoMind contact form.");
     return lines.join("\n");
}

export default function Contact() {
     const ref = useReveal();
     const [draft, setDraft] = useState<Draft>(EMPTY);

     const set = (k: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          setDraft((d) => ({ ...d, [k]: e.target.value }));

     /**
      * There is no mail server behind this site, so the form doesn't pretend to
      * send anything by itself: it opens a GitHub issue with everything already
      * filled in, and you press submit there. That way the message really arrives.
      */
     const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          if (!draft.message.trim()) {
               notify("Please write a message first.", "warning", 3500);
               return;
          }
          const title = draft.subject.trim() || `Message from ${draft.name.trim() || "a visitor"}`;
          const url = `${REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(compose(draft))}`;
          window.open(url, "_blank", "noopener,noreferrer");
          notify("GitHub opened with your message filled in — press Submit there to send it.", "info", 6000);
     };

     const handleCopy = async () => {
          if (!draft.message.trim()) {
               notify("Please write a message first.", "warning", 3500);
               return;
          }
          try {
               await navigator.clipboard.writeText(compose(draft));
               notify("Message copied to your clipboard.", "success", 3000);
          } catch {
               notify("Your browser blocked the clipboard — please select the text and copy it.", "error", 4000);
          }
     };

     return (
          <div ref={ref}>
               <PhotoHero
                    image={IMG.fluidSwirl}
                    tint="violet"
                    eyebrow="Collaborate"
                    title={<>Get in <span className="site-serif">Touch</span></>}
                    lead="Researchers, clinicians, chemists, developers, students — if you want to work on this with us, pull it apart, or just ask what it does, write to us."
               >
                    <div className="site-proof-row">
                         <span className="site-glass-chip"><MapPin size={14} /> Elazığ, Türkiye</span>
                    </div>
               </PhotoHero>

               <section className="site-section">
                    <div className="site-wrap site-split" style={{ alignItems: "start" }}>
                         {/* The form */}
                         <form
                              className="site-tile site-reveal"
                              onSubmit={handleSubmit}
                              style={{ gap: 16, justifyContent: "flex-start", padding: "clamp(20px, 3vw, 32px)", minHeight: 0 }}
                         >
                              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                   <h2 className="site-h2" style={{ fontSize: "clamp(26px, 2.6vw, 36px)" }}>Write to us</h2>
                                   <p className="site-muted" style={{ fontSize: 13.5, margin: 0, lineHeight: 1.5 }}>
                                        We don&rsquo;t run a mail server yet, so this form doesn&rsquo;t send mail on its own. It opens a
                                        GitHub issue with your message already filled in — you press submit there, and it really arrives.
                                        Prefer not to use GitHub? Copy the message and send it however you like.
                                   </p>
                              </div>

                              <div className="om-form-grid">
                                   <Field label="Name" htmlFor="c-name">
                                        <Input id="c-name" type="text" placeholder="Name" autoComplete="name" value={draft.name} onChange={set("name")} />
                                   </Field>
                                   <Field label="Email (optional)" htmlFor="c-email">
                                        <Input id="c-email" type="email" placeholder="your@emailprovider.com" autoComplete="email" value={draft.email} onChange={set("email")} />
                                   </Field>
                                   <Field label="Subject" full htmlFor="c-subject">
                                        <Input id="c-subject" type="text" placeholder="Research collaboration" value={draft.subject} onChange={set("subject")} />
                                   </Field>
                                   <Field label="Message" full htmlFor="c-message">
                                        <Textarea id="c-message" rows={6} placeholder="Tell us about your project..." value={draft.message} onChange={set("message")} />
                                   </Field>
                              </div>

                              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                   <Button type="submit" variant="primary" icon={<Send size={16} />} style={{ height: 48, flex: "1 1 220px" }}>
                                        Send via GitHub
                                   </Button>
                                   <Button type="button" icon={<Copy size={16} />} onClick={handleCopy} style={{ height: 48 }}>
                                        Copy message
                                   </Button>
                              </div>
                              <p className="site-muted" style={{ fontSize: 12, margin: 0 }}>
                                   Anything you type stays in your browser until you submit it on GitHub.
                              </p>
                         </form>

                         {/* The other ways to reach us */}
                         <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                              {channels.map((c, i) => (
                                   <a
                                        key={c.title}
                                        href={c.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="site-tile site-link-tile site-reveal"
                                        style={{ minHeight: 0, gap: 12, textDecoration: "none", transitionDelay: `${i * 80}ms` }}
                                   >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                             <span className="site-icon">{c.icon}</span>
                                             <ArrowUpRight size={22} className="site-muted" />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                             <h3 className="site-h3">{c.title}</h3>
                                             <p className="site-body">{c.text}</p>
                                             <span className="om-pill om-pill--ink" style={{ alignSelf: "flex-start", marginTop: 4 }}>{c.cta}</span>
                                        </div>
                                   </a>
                              ))}
                         </div>
                    </div>
               </section>
          </div>
     );
}
