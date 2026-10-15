import React, { useState } from "react";
import { ArrowUpRight, Atom, CircleCheck, Clock, Dna, FlaskConical, Lock, Orbit, ScanLine, Skull } from "lucide-react";
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
   // Not ready yet: flat, muted, dashed and explicitly labelled — no gradient, no button.
   if (!onOpen) {
      return (
         <div className="om-tile-soon" aria-disabled="true">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
               <span className="om-tile-soon-icon">{icon}</span>
               <span className="om-pill"><Clock size={12} /> Coming soon</span>
            </div>
            <div>
               <h3 className="om-tile-title">{title}</h3>
               <p className="om-tile-note"><Lock size={12} /> In development — not available yet</p>
            </div>
         </div>
      );
   }

   return (
      <Card aura={aura} interactive onClick={onOpen} style={{ minHeight: 210, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span className="om-stat-icon" style={{ width: 40, height: 40, borderRadius: 14 }}>{icon}</span>
            <Pill tone="glass"><CircleCheck size={12} /> Available</Pill>
         </div>
         <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
            <h3 className="om-tile-title">{title}</h3>
            <Button
               variant="glass"
               size="sm"
               icon={<ArrowUpRight size={15} />}
               onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
               }}
            >
               Open
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
      { title: "Drug Toxicity Analysis", icon: <FlaskConical size={20} />, aura: "violet", onOpen: () => setPopupVisible(true) },
      { title: "CT Images", icon: <ScanLine size={20} />, aura: "blue", onOpen: () => setPopupVisible2(true) },
      { title: "Genomic Profiling", icon: <Dna size={20} />, aura: "teal" },
   ];
   const experimental: Tile[] = [
      { title: "Particle Based Drug Simulation", icon: <Atom size={20} />, aura: "orange" },
      { title: "Toxicity Records", icon: <Skull size={20} />, aura: "pink" },
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
