import React from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, Github, ShieldAlert } from "lucide-react";
import DemoCard from "../components/DemoCard";
import { PhotoHero, StatusTag, useReveal } from "../site/parts";
import { IMG } from "../site/images";

export default function Home() {
  const ref = useReveal();

  return (
    <div ref={ref}>
      <PhotoHero
        image={IMG.iridescent}
        tint="teal"
        eyebrow="Developer demo"
        title={<>Prediction <span className="site-serif">demo</span></>}
        lead="A small developer demo that calls the API's /predict route. It isn't connected to a model yet, so running it will show an error — the working tools live in the dashboard."
      >
        <div className="site-ctas">
          <Link className="om-btn om-btn--primary" to="/login" style={{ textDecoration: "none" }}>
            Open the dashboard <ArrowUpRight size={16} />
          </Link>
          <a className="om-btn" href="#demo" style={{ textDecoration: "none" }}>
            See the demo <ArrowDown size={16} />
          </a>
          <a className="om-btn" href="https://github.com/kaesit/oncomind" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <Github size={16} /> GitHub
          </a>
        </div>
        <p style={{ fontSize: 13, margin: 0, color: "rgba(255,255,255,0.75)" }}>
          Türkçe: OncoMind, kanser araştırmalarını yapay zekâ ile desteklemeyi amaçlayan deneysel bir araştırma projesidir.
        </p>
      </PhotoHero>

      <section id="demo" className="site-section">
        <div className="site-wrap site-split" style={{ alignItems: "start" }}>
          <div className="site-tile site-reveal" style={{ minHeight: 0, justifyContent: "flex-start" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <span className="site-eyebrow">How the demo works</span>
              <StatusTag status="in-development" />
            </div>
            <h2 className="site-h2" style={{ fontSize: 36 }}>About the <span className="site-serif">demo</span></h2>
            <ol className="site-list">
              <li><span className="site-list-num">01</span>Choose a sample index and click Run demo.</li>
              <li><span className="site-list-num">02</span>The UI calls the C# API, which is meant to forward the request to the ML service.</li>
              <li><span className="site-list-num">03</span>The ML service has no /predict model behind it yet, so today you'll see the error it returns.</li>
            </ol>
          </div>

          <DemoCard />
        </div>
      </section>

      <section className="site-section" style={{ paddingTop: 0 }}>
        <div className="site-wrap">
          <div className="site-tile site-reveal" style={{ minHeight: 0, flexDirection: "row", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <span className="site-icon"><ShieldAlert size={20} /></span>
            <div style={{ flex: 1, minWidth: 240, display: "flex", flexDirection: "column", gap: 6 }}>
              <h3 className="site-h3">About &amp; Ethics</h3>
              <p className="site-body">
                OncoMind is an in-silico research demo. It does not provide clinical advice and does not include any protocol for drug production or administration.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
