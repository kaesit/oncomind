// src/pages/Contact.tsx
import React from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button, Field, Input, Textarea } from "../dashboard/ui";
import notify from "../dashboard/ui/notify";
import { Orb, useReveal } from "../site/parts";

const details = [
     { icon: <Mail size={18} />, text: "oncomind@info.com" },
     { icon: <Phone size={18} />, text: "+1 111 111 11 11" },
     { icon: <MapPin size={18} />, text: "Elazığ, Türkiye" },
];

export default function Contact() {
     const ref = useReveal();

     // The form has no backend yet: don't reload the page or pretend it was sent.
     const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          notify("The contact form isn't connected yet — please email us at oncomind@info.com.", "info", 5000);
     };

     return (
          <div ref={ref}>
               <section className="site-hero">
                    <Orb tone="violet" size={560} style={{ top: -200, left: -160 }} />
                    <Orb tone="teal" size={420} style={{ bottom: -140, right: -100, animationDelay: "-9s" }} />
                    <div className="site-dots" />

                    <div className="site-wrap site-above site-split" style={{ alignItems: "start" }}>
                         {/* Left Column: Information */}
                         <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                              <span className="site-eyebrow">Collaborate</span>
                              <h1 className="site-display">
                                   Get in <span className="site-serif site-gradient-text">Touch</span>
                              </h1>
                              <p className="site-lead">
                                   We are always looking for partners in clinical research,
                                   bioinformatics, and healthcare technology.
                                   Whether you are a researcher, clinician, or developer,
                                   let's build the future of medicine together.
                              </p>
                              <ul className="site-list" style={{ maxWidth: 420 }}>
                                   {details.map((d) => (
                                        <li key={d.text} style={{ color: "var(--om-text)" }}>
                                             <span className="site-icon" style={{ width: 38, height: 38, borderRadius: 12 }}>{d.icon}</span>
                                             {d.text}
                                        </li>
                                   ))}
                              </ul>
                         </div>

                         {/* Right Column: The Form */}
                         <form className="site-tile site-reveal" onSubmit={handleSubmit} style={{ gap: 16, justifyContent: "flex-start", padding: "clamp(20px, 3vw, 32px)" }}>
                              <div className="om-form-grid">
                                   <Field label="Name" htmlFor="c-name">
                                        <Input id="c-name" type="text" placeholder="Name" autoComplete="name" />
                                   </Field>
                                   <Field label="Email" htmlFor="c-email">
                                        <Input id="c-email" type="email" placeholder="your@emailprovider.com" autoComplete="email" />
                                   </Field>
                                   <Field label="Subject" full htmlFor="c-subject">
                                        <Input id="c-subject" type="text" placeholder="Research Collaboration" />
                                   </Field>
                                   <Field label="Message" full htmlFor="c-message">
                                        <Textarea id="c-message" rows={6} placeholder="Tell us about your project..." />
                                   </Field>
                              </div>
                              <Button type="submit" variant="primary" block icon={<Send size={16} />} style={{ height: 48 }}>
                                   Send Message
                              </Button>
                         </form>
                    </div>
               </section>
          </div>
     );
}
