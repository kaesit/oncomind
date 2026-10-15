import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button, Field, Input } from "../dashboard/ui";
import { Orb, Standalone } from "./parts";

type FieldDef = { label: string; type?: string; autoComplete?: string };

/**
 * Shared look for the public /signin and sign-up forms. These forms have no
 * backend wiring (unchanged from before) — doctors use the dashboard login.
 */
export function SimpleAuth({ title, fields, submit }: { title: string; fields: FieldDef[]; submit: string }) {
     return (
          <Standalone>
               <Orb tone="violet" size={560} style={{ top: -200, left: -160 }} />
               <Orb tone="pink" size={460} style={{ bottom: -180, right: -120, animationDelay: "-7s" }} />
               <div className="site-dots" />

               <div className="om-auth site-above">
                    <aside className="om-auth-aura om-aura om-aura--violet">
                         <Link to="/" className="site-brand" style={{ color: "#fff" }}>
                              <span className="om-brand-mark" style={{ background: "rgba(255,255,255,0.3)" }} />
                              OncoMind
                         </Link>
                         <div>
                              <div className="site-serif" style={{ fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1 }}>Always one step ahead</div>
                              <p style={{ margin: "12px 0 0", color: "rgba(255,255,255,0.85)", fontSize: 14 }}>Semper Procedere • 常に前進 • Her zaman ileriye</p>
                         </div>
                    </aside>

                    <div className="om-auth-form">
                         <h1 className="om-page-title" style={{ fontSize: 34 }}>{title}</h1>
                         <form className="om-stack" style={{ gap: 12 }} onSubmit={(e) => e.preventDefault()}>
                              {fields.map((f) => {
                                   const id = `sa-${f.label.toLowerCase().replace(/\s+/g, "-")}`;
                                   return (
                                        <Field key={f.label} label={f.label} htmlFor={id}>
                                             <Input id={id} type={f.type ?? "text"} autoComplete={f.autoComplete} />
                                        </Field>
                                   );
                              })}
                              <Button type="submit" variant="primary" block icon={<ArrowRight size={16} />} style={{ marginTop: 8, height: 46 }}>
                                   {submit}
                              </Button>
                         </form>
                         <p className="site-muted" style={{ fontSize: 13, margin: 0, textAlign: "center" }}>
                              Doctor or researcher? <Link to="/login" style={{ color: "var(--om-text)", fontWeight: 600 }}>Sign in to the dashboard</Link>
                         </p>
                         <p className="site-muted" style={{ fontSize: 12, margin: 0, textAlign: "center" }}>
                              © {new Date().getFullYear()} Esad Abdullah Kösedağ. All rights reserved.
                         </p>
                    </div>
               </div>
          </Standalone>
     );
}
