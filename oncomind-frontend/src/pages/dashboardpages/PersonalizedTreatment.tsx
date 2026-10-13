import React, { useState } from "react";
import { ArrowUpRight, Atom, Dna, FlaskConical, Orbit, ScanLine, Skull } from "lucide-react";
import { Button, Card, PageHeader, Pill } from "../../dashboard/ui";
import ToxicityAnalysisPopup from "../../components/ToxicityAnalysisPopup";
import CTImagePopup from "../../components/CTImagePopup";

type Tile = {
   title: string;
   icon: React.ReactNode;
   aura: "green" | "orange" | "pink" | "violet" | "blue" | "teal";
   onOpen?: () => void;
};

function FeatureTile({ title, icon, aura, onOpen }: Tile) {
   return (
      <Card aura={aura} interactive={!!onOpen} onClick={onOpen} style={{ minHeight: 210, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span className="om-stat-icon" style={{ width: 40, height: 40, borderRadius: 14 }}>{icon}</span>
            {onOpen ? <Pill tone="glass">Available</Pill> : <Pill tone="glass">Coming soon</Pill>}
         </div>
         <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 24, fontWeight: 500, letterSpacing: "-0.035em", lineHeight: 1.1 }}>{title}</h3>
            <Button
               variant="glass"
               size="sm"
               icon={<ArrowUpRight size={15} />}
               disabled={!onOpen}
               onClick={(e) => {
                  e.stopPropagation();
                  onOpen?.();
               }}
            >
               Search
            </Button>
         </div>
      </Card>
   );
}

/* ------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------ */
const PersonalizedTreatment: React.FC = () => {
   const [isPopupVisible, setPopupVisible] = useState(false);
   const [isPopupVisible2, setPopupVisible2] = useState(false);

   const main: Tile[] = [
      { title: "Drugs", icon: <FlaskConical size={20} />, aura: "violet", onOpen: () => setPopupVisible(true) },
      { title: "CT Images", icon: <ScanLine size={20} />, aura: "blue", onOpen: () => setPopupVisible2(true) },
      { title: "Genomic Profiling", icon: <Dna size={20} />, aura: "teal" },
   ];
   const experimental: Tile[] = [
      { title: "Particle Based Drug Simulation", icon: <Atom size={20} />, aura: "orange" },
      { title: "Toxicity", icon: <Skull size={20} />, aura: "pink" },
      { title: "Lab (Latent Space Explorer)", icon: <Orbit size={20} />, aura: "green" },
   ];

   const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 };

   return (
      <div className="om-page">
         <PageHeader
            title="Personalized Treatment"
            sub={
               <>
                  This page is under construction — this page will provide very first experimental features of future personalized treatment options
               </>
            }
         >
            <Pill tone="lime">Preview</Pill>
         </PageHeader>

         <div>
            <h2 className="om-section-title">Main</h2>
         </div>
         <div style={grid}>
            {main.map((t) => (
               <FeatureTile key={t.title} {...t} />
            ))}
         </div>

         <div>
            <h2 className="om-section-title">Experimental Features</h2>
         </div>
         <div style={grid}>
            {experimental.map((t) => (
               <FeatureTile key={t.title} {...t} />
            ))}
         </div>

         <ToxicityAnalysisPopup
            visible={isPopupVisible}
            onHide={() => setPopupVisible(false)}
         />
         <CTImagePopup
            visible={isPopupVisible2}
            onHide={() => setPopupVisible2(false)}
         />
      </div>
   );
};

export default PersonalizedTreatment;
