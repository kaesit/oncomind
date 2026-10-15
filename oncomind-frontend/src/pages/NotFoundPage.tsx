import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Orb, Standalone } from "../site/parts";

const NotFoundPage: React.FC = () => {
  return (
    <Standalone>
      <Orb tone="pink" size={560} style={{ top: "10%", left: "8%" }} />
      <Orb tone="violet" size={520} style={{ bottom: "6%", right: "6%", animationDelay: "-8s" }} />
      <div className="site-dots" />

      <div className="site-above" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, textAlign: "center" }}>
        <span className="site-eyebrow">Error 404</span>
        <div className="site-dot-num site-gradient-text" style={{ fontSize: "clamp(120px, 26vw, 300px)" }}>404</div>
        <h1 className="site-h2">
          This page took a <span className="site-serif">different path</span>
        </h1>
        <p className="site-lead" style={{ margin: 0 }}>Page Not Found</p>
        <Link to="/" className="om-btn om-btn--primary" style={{ textDecoration: "none", "--h": "46px", padding: "0 22px" } as React.CSSProperties}>
          <ArrowLeft size={16} /> Go Home
        </Link>
      </div>
    </Standalone>
  );
};

export default NotFoundPage;
