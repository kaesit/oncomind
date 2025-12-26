// src/pages/Research.tsx
import React from "react";
import "../css/Research.css";
import "../css/index.css";
import Footer from "../components/Footer";

export default function Research() {
     return (
          <>
               <center className="research_container">
                    <h1 className="research-page-title">Research</h1>

                    <section className="information-section">
                         <div className="information-card">
                              <h2 className="info-div-title">Rapid Prototyping</h2>
                              <img
                                   className="research-card-images"
                                   src="https://images.unsplash.com/photo-1582560469781-1965b9af903d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aGVhbHRoJTIwdGVjaHxlbnwwfHwwfHx8MA%3D%3D"
                                   alt="Healthcare technology prototyping visualization"
                              />
                              <p className="info-description-text">
                                   We build and test healthcare software rapidly to ensure safety and efficacy.
                                   Our prototyping approach allows us to validate clinical assumptions early,
                                   iterate based on real-world feedback, and deliver tools that genuinely improve
                                   patient outcomes. Speed meets precision in every build.
                              </p>
                         </div>

                         <div className="information-card">
                              <h2 className="info-div-title">Custom ML Models</h2>
                              <img
                                   className="research-card-images"
                                   src="https://images.unsplash.com/photo-1531956656798-56686eeef3d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmlvJTIwdGVjaHxlbnwwfDJ8MHx8fDA%3D"
                                   alt="Bioinformatics and machine learning datasets"
                              />
                              <p className="info-description-text">
                                   Generic models fall short in healthcare. We develop specialized datasets
                                   tailored to oncology, genomics, and clinical diagnostics. Our custom-trained
                                   models understand the nuances of medical data, delivering accuracy and insights
                                   that generic AI simply cannot match.
                              </p>
                         </div>

                         <div className="information-card">
                              <h2 className="info-div-title">Bioinformatic Research</h2>
                              <img
                                   className="research-card-images"
                                   src="https://plus.unsplash.com/premium_photo-1681843039768-0e22b7a031d5?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                   alt="Molecular biology and genomic research"
                              />
                              <p className="info-description-text">
                                   From genomic sequencing to protein structure prediction, we conduct real
                                   bioinformatics research that bridges computational biology and clinical medicine.
                                   Our work transforms raw biological data into actionable insights that advance
                                   precision oncology and personalized treatment strategies.
                              </p>
                         </div>
                    </section>

                    <div className="divider"></div>

                    <section className="research-section">
                         <h2 className="title_for_sections">Our Research Methodology</h2>
                         <p>
                              You don't need a PhD in bioinformatics to understand our mission.
                              We translate complex genomic and clinical data into practical healthcare solutions
                              through rigorous, iterative research.
                         </p>
                         <ul className="research-steps">
                              <li>🔬 Problem-driven hypothesis formulation</li>
                              <li>📊 Data acquisition & preprocessing (clinical, genomic, omics)</li>
                              <li>🤖 Model prototyping and rapid validation</li>
                              <li>🧪 Iterative testing with real biological constraints</li>
                              <li>🚀 Translation into usable healthcare tools</li>
                         </ul>
                    </section>

                    <div className="divider"></div>

                    <section className="publication-section">
                         <h2 className="title_for_sections">Publications & Resources</h2>
                         <div className="publication-list">
                              <a href="#" aria-label="Read our 2024 paper on AI-assisted diagnostics">
                                   📄 AI-assisted diagnostics in bioinformatics (2024)
                              </a>
                              <a href="#" aria-label="Explore our genomic preprocessing framework">
                                   🧬 Custom genomic dataset preprocessing framework
                              </a>
                              <a href="#" aria-label="View research methodology notes">
                                   📘 Research notes & methodology
                              </a>
                              <a href="#" aria-label="Visit our GitHub repository">
                                   💻 Open-source tools on GitHub
                              </a>
                         </div>
                    </section>

                    <Footer></Footer>
               </center>
          </>
     );
}