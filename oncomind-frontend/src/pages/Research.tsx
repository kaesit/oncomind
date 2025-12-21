// src/pages/LandingExact.tsx
import React from "react";
import DemoCard from "../components/DemoCard";
import "../css/Research.css";
import "../css/index.css";

export default function Research() {
     return (

          <>
               <main className="research_container">
                    <center>
                         <h1 className="research-page-title">Research</h1>
                    </center>
                    <section className="information-section">
                         <div className="information-card">
                              <h2 className="info-div-title">Prototyping</h2>
                              <img className="research-card-images" src="https://images.unsplash.com/photo-1582560469781-1965b9af903d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aGVhbHRoJTIwdGVjaHxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                              <code className="info-code-text">Prototyping is the key point of developing healthcare software, because what you develop is about people's life
                                   Prototyping is almost became a industry standart since the tools of ours are making jobs faster, more efficient and high quality.
                                   Therefore
                              </code>
                         </div>
                         <div className="information-card">
                              <h2 className="info-div-title">Custom Datasets and Models</h2>
                              <img className="research-card-images" src="https://images.unsplash.com/photo-1531956656798-56686eeef3d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmlvJTIwdGVjaHxlbnwwfDJ8MHx8fDA%3D" alt="" />
                              <code className="info-code-text">Prototyping is the key point of developing healthcare software, because what you develop is about people's life
                                   Prototyping is almost became a industry standart since the tools of ours are making jobs faster, more efficient and high quality.
                                   Therefore
                              </code>
                         </div>
                         <div className="information-card">
                              <h2 className="info-div-title">Real Bioinformatic Researches</h2>
                              <img className="research-card-images" src="https://plus.unsplash.com/premium_photo-1681843039768-0e22b7a031d5?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                              <code className="info-code-text">Prototyping is the key point of developing healthcare software, because what you develop is about people's life
                                   Prototyping is almost became a industry standart since the tools of ours are making jobs faster, more efficient and high quality.
                                   Therefore
                              </code>
                         </div>
                    </section>
                    <pre className="divider"></pre>
                    <section className="research-section">
                         <h2 className="title_for_sections">How we accomlish our researches</h2>
                         <code>You don't have to know the depths of bioinformatic,
                              genetic or human genome project to understand the platform we're building
                         </code>
                         <ul className="research-steps">
                              <li>🔬 Problem-driven hypothesis formulation</li>
                              <li>📊 Data acquisition & preprocessing (clinical, genomic, omics)</li>
                              <li>🤖 Model prototyping and rapid validation</li>
                              <li>🧪 Iterative testing with real biological constraints</li>
                              <li>🚀 Translation into usable healthcare tools</li>
                         </ul>
                    </section>
                    <pre className="divider"></pre>
                    <section className="publication-section">
                         <h2 className="title_for_sections">Publications & Resources</h2>

                         <div className="publication-list">
                              <a href="#">📄 AI-assisted diagnostics in bioinformatics (2024)</a>
                              <a href="#">🧬 Custom genomic dataset preprocessing framework</a>
                              <a href="#">📘 Research notes & methodology</a>
                              <a href="#">💻 Open-source tools on GitHub</a>
                         </div>
                    </section>
                    <footer className="lex-footer">
                         <div className="lex-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>© {new Date().getFullYear()} OncoMind</div>
                              <div><a className="footer-link" href="https://github.com/kaesit/oncomind" target="_blank" rel="noreferrer">GitHub</a></div>
                         </div>
                    </footer>
               </main>
          </>

     )
}