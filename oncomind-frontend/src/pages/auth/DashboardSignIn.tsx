import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button, Field, Input, Select } from "../../dashboard/ui";
import { useOmTheme } from "../../dashboard/ui/theme";
import notify from "../../dashboard/ui/notify";
import "../../dashboard/styles/dashboard.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- COMPONENT ---
const Login = () => {
     const navigate = useNavigate();
     useOmTheme(); // apply the saved dashboard theme here too
     const [isSignup, setIsSignup] = useState(false);
     const [touched, setTouched] = useState(false);

     // 1. Fixed State Management
     const [formData, setFormData] = useState({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          specialization: "Oncologist",
          profilePicture: ""
     });

     // Date state (allowed to be undefined initially)
     const [birthDate, setBirthDate] = useState<Date | undefined>(new Date());

     // 2. Handle Input Changes
     const handleFieldChange = (dataField: keyof typeof formData, value: string) => {
          setFormData({ ...formData, [dataField]: value });
     };

     // validation rules carried over from the old form
     const errors = {
          firstName: isSignup && !formData.firstName.trim() ? "Name is required" : null,
          lastName: isSignup && !formData.lastName.trim() ? "Name is required" : null,
          email: !formData.email.trim() ? "Email is required" : !EMAIL_RE.test(formData.email) ? "Invalid email format" : null,
          password: !formData.password ? "Password is required" : null,
     };
     const show = (k: keyof typeof errors) => (touched ? errors[k] : null);

     // 4. THE REAL SUBMIT LOGIC
     const handleSubmit = async (e: any) => {
          e.preventDefault();
          setTouched(true);
          if (Object.values(errors).some(Boolean)) return;

          const url = isSignup
               ? "http://localhost:5001/api/Auth/register"
               : "http://localhost:5001/api/Auth/login";

          // Prepare payload dynamically
          const payload = isSignup ? {
               firstName: formData.firstName,
               lastName: formData.lastName,
               email: formData.email,
               password: formData.password,
               specialization: formData.specialization,
               dateOfBirth: birthDate,
               profilePicture: formData.profilePicture
          } : {
               email: formData.email,
               password: formData.password
          };

          try {
               const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
               });

               const data = await response.json();

               if (!response.ok) {
                    notify(data.message || "Authentication failed", "error", 3000);
                    return;
               }

               // Success!
               notify(isSignup ? "Account created! Please log in." : "Welcome back!", "success", 2000);

               if (isSignup) {
                    // If register success, switch to login mode automatically
                    setIsSignup(false);
                    setTouched(false);
               } else {
                    // If login success, save ID and redirect
                    localStorage.setItem("doctorId", data.doctorId);
                    localStorage.setItem("doctorName", data.name); // Optional: Save name for UI
                    localStorage.setItem("doctorSpecialization", data.specialization || "Doctor")
                    localStorage.setItem("doctorImage", data.image)
                    navigate("/admin");
               }

          } catch (error) {
               console.error("Error:", error);
               notify("Network error. Is the Backend running?", "error", 3000);
          }
     };

     const dateValue = birthDate ? birthDate.toISOString().slice(0, 10) : "";

     return (
          <div className="om-root" style={{ display: "grid", placeItems: "center", gridTemplateColumns: "1fr", padding: 16 }}>
               <div className="om-auth">
                    <aside className="om-auth-aura om-aura om-aura--pink">
                         <div className="om-brand" style={{ color: "#fff", padding: 0 }}>
                              <span className="om-brand-mark" style={{ background: "rgba(255,255,255,0.3)" }} />
                              OncoMind
                         </div>
                         <div>
                              <div style={{ fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 400, letterSpacing: "-0.05em", lineHeight: 1 }}>OncoMind OS</div>
                              <p style={{ margin: "12px 0 0", color: "rgba(255,255,255,0.85)", fontSize: 14, maxWidth: 280 }}>
                                   Drug discovery, patient analytics and personalized treatment in one workspace.
                              </p>
                         </div>
                    </aside>

                    <div className="om-auth-form">
                         <div>
                              <h1 className="om-page-title" style={{ fontSize: 32 }}>{isSignup ? "Create account" : "Sign in"}</h1>
                              <p className="om-page-sub">{isSignup ? "Create your doctor profile" : "Secure access for medical personnel"}</p>
                         </div>

                         <form onSubmit={handleSubmit} noValidate className="om-stack" style={{ gap: 12 }}>
                              {isSignup && (
                                   <div className="om-form-grid">
                                        <Field label="First Name" error={show("firstName")} htmlFor="su-first">
                                             <Input id="su-first" value={formData.firstName} invalid={!!show("firstName")} onChange={(e) => handleFieldChange("firstName", e.target.value)} autoComplete="given-name" />
                                        </Field>
                                        <Field label="Last Name" error={show("lastName")} htmlFor="su-last">
                                             <Input id="su-last" value={formData.lastName} invalid={!!show("lastName")} onChange={(e) => handleFieldChange("lastName", e.target.value)} autoComplete="family-name" />
                                        </Field>
                                   </div>
                              )}

                              <Field label="Email Address" error={show("email")} htmlFor="su-email">
                                   <Input id="su-email" type="email" value={formData.email} invalid={!!show("email")} onChange={(e) => handleFieldChange("email", e.target.value)} autoComplete="email" />
                              </Field>

                              <Field label="Password" error={show("password")} htmlFor="su-pass">
                                   <Input
                                        id="su-pass"
                                        type="password"
                                        value={formData.password}
                                        invalid={!!show("password")}
                                        onChange={(e) => handleFieldChange("password", e.target.value)}
                                        autoComplete={isSignup ? "new-password" : "current-password"}
                                   />
                              </Field>

                              {isSignup && (
                                   <>
                                        <div className="om-form-grid">
                                             <Field label="Specialization">
                                                  <Select
                                                       items={["Oncologist", "Bioinformatics", "Genetics", "Researcher"]}
                                                       value={formData.specialization}
                                                       onChange={(v) => handleFieldChange("specialization", v ?? "Oncologist")}
                                                  />
                                             </Field>
                                             <Field label="Date of Birth" htmlFor="su-dob">
                                                  <Input
                                                       id="su-dob"
                                                       type="date"
                                                       value={dateValue}
                                                       onChange={(e) => setBirthDate(e.target.value ? new Date(e.target.value) : undefined)}
                                                  />
                                             </Field>
                                        </div>
                                        <Field label="Profile Picture URL" htmlFor="su-pic">
                                             <Input id="su-pic" value={formData.profilePicture} placeholder="https://…" onChange={(e) => handleFieldChange("profilePicture", e.target.value)} />
                                        </Field>
                                   </>
                              )}

                              <Button type="submit" variant="primary" block icon={<ArrowRight size={16} />} style={{ marginTop: 8, height: 46 }}>
                                   {isSignup ? "Create Account" : "Sign In"}
                              </Button>
                         </form>

                         <div style={{ textAlign: "center", fontSize: 13, color: "var(--om-muted)" }}>
                              {isSignup ? "Already have an account? " : "New to OncoMind? "}
                              <button
                                   type="button"
                                   onClick={() => {
                                        setIsSignup(!isSignup);
                                        setTouched(false);
                                   }}
                                   style={{ all: "unset", cursor: "pointer", color: "var(--om-text)", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3 }}
                              >
                                   {isSignup ? "Sign In" : "Register"}
                              </button>
                         </div>
                    </div>
               </div>
          </div>
     );
};

export default Login;
