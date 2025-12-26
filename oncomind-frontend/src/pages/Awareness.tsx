import React from 'react';
import '../css/Awareness.css';
import Footer from '../components/Footer';

const AwarenessPage = () => {
     return (
          <div className="awareness-page-container">

               {/* --- HERO SECTION --- */}
               <section className="awareness-hero">
                    <div className="content-wrapper">
                         <span className="badge-pill">Patient Education</span>
                         <h1 className="hero-title">Your Health, Your Journey</h1>
                         <p className="hero-description">
                              Cancer awareness is more than just a ribbon. It is about knowing your body,
                              understanding your risks, and nurturing your mental well-being in the dark times.
                         </p>
                         <div className="hero-actions">
                              <button className="btn-primary">Get Screened</button>
                         </div>
                    </div>
               </section>

               {/* --- PILLARS SECTION --- */}
               <section className="awareness-pillars">
                    <div className="content-wrapper">
                         <div className="pillars-grid">

                              <div className="pillar-card">
                                   <div className="pillar-icon">🩺</div>
                                   <h3>Early Detection</h3>
                                   <p>Finding cancer early often allows for more treatment options. Don't wait for symptoms to become severe.</p>
                                   <ul className="pillar-list">
                                        <li>Perform monthly self-exams</li>
                                        <li>Schedule regular screenings</li>
                                        <li>Know your family history</li>
                                   </ul>
                              </div>

                              <div className="pillar-card highlight-card">
                                   <div className="pillar-icon">🧠</div>
                                   <h3>Mental Resilience</h3>
                                   <p>A cancer diagnosis affects the mind as much as the body. Your emotional health is a vital part of recovery.</p>
                                   <ul className="pillar-list">
                                        <li>Manage anxiety & stress</li>
                                        <li>Seek support groups</li>
                                        <li>Practice mindfulness</li>
                                   </ul>
                              </div>

                              <div className="pillar-card">
                                   <div className="pillar-icon">🛡️</div>
                                   <h3>Active Prevention</h3>
                                   <p>Up to 50% of cancers are preventable. Small lifestyle changes today can lower your risk tomorrow.</p>
                                   <ul className="pillar-list">
                                        <li>Quit tobacco products</li>
                                        <li>Sun safety & SPF</li>
                                        <li>Plant-based nutrition</li>
                                   </ul>
                              </div>

                         </div>
                    </div>
               </section>

               {/* --- SCREENING GUIDELINES --- */}
               <section className="screening-section">
                    <div className="content-wrapper">
                         <div className="screening-box">
                              <h2 className="section-heading">Screening Guidelines</h2>
                              <p className="section-subtext">General estimates for adults (consult your doctor):</p>

                              <div className="checklist-grid">
                                   <div className="check-item">
                                        <span className="age-tag">Age 21+</span>
                                        <div className="check-details">
                                             <strong>Cervical Health</strong>
                                             <p>Pap tests every 3 years.</p>
                                        </div>
                                   </div>

                                   <div className="check-item">
                                        <span className="age-tag">Age 40+</span>
                                        <div className="check-details">
                                             <strong>Breast Health</strong>
                                             <p>Annual mammograms.</p>
                                        </div>
                                   </div>

                                   <div className="check-item">
                                        <span className="age-tag">Age 45+</span>
                                        <div className="check-details">
                                             <strong>Colorectal Health</strong>
                                             <p>Colonoscopy tests.</p>
                                        </div>
                                   </div>

                                   <div className="check-item">
                                        <span className="age-tag">Age 50+</span>
                                        <div className="check-details">
                                             <strong>Prostate Health</strong>
                                             <p>PSA blood test discussion.</p>
                                        </div>
                                   </div>
                              </div>

                              <div className="disclaimer-box">
                                   <small>* These are general estimates. High-risk individuals need earlier screening.</small>
                              </div>
                         </div>
                    </div>
               </section>

               {/* --- MYTHS vs FACTS --- */}
               <section className="myths-section">
                    <div className="content-wrapper">
                         <h2 className="section-heading">Debunking Myths</h2>
                         <div className="myth-grid">

                              <div className="myth-card">
                                   <div className="myth-header">
                                        <span className="myth-badge">MYTH</span>
                                        <p>"If no one in my family has cancer, I'm not at risk."</p>
                                   </div>
                                   <div className="fact-reveal">
                                        <span className="fact-badge">FACT</span>
                                        <p>Only 5-10% of cancers are hereditary. Most are caused by aging and lifestyle factors.</p>
                                   </div>
                              </div>

                              <div className="myth-card">
                                   <div className="myth-header">
                                        <span className="myth-badge">MYTH</span>
                                        <p>"Sugar causes cancer to grow faster."</p>
                                   </div>
                                   <div className="fact-reveal">
                                        <span className="fact-badge">FACT</span>
                                        <p>Sugar doesn't directly speed up growth, but high sugar intake leads to obesity, a major risk factor.</p>
                                   </div>
                              </div>

                         </div>
                    </div>
               </section>
               <Footer />
          </div>
     );
};

export default AwarenessPage;