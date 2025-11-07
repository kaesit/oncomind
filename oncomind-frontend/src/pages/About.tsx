import React from "react";
import SpotlightCard from "../components/SpotlightCard";
import Footer from "../components/Footer";
import "../css/About.css";

{/*const items = [
  {
    image: "https://i.pravatar.cc/300?img=1",
    title: "Sarah Johnson",
    subtitle: "Frontend Developer",
    handle: "@sarahjohnson",
    borderColor: "#3B82F6",
    gradient: "linear-gradient(145deg, #3B82F6, #000)",
    url: "https://github.com/sarahjohnson",
  },
  {
    image: liberty_icon,
    title: "Mike Chen",
    subtitle: "Backend Engineer",
    handle: "@mikechen",
    borderColor: "#10B981",
    gradient: "linear-gradient(180deg, #10B981, #000)",
    url: "https://linkedin.com/in/mikechen",
  },
];
*/}


const About: React.FC = () => {
     return (
          <div className="about-page">
               {/* Sayfa Başlığı */}
               <header className="about-header">
                    <h1 className="about-title">OncoMind</h1>
                    <p className="about-subtitle">Open Source AI Driven Cancer Analysis and Drug Sensitivity Platform</p>
               </header>

               {/* 
      
      <div className="about-cards">
        <SpotlightCard
          className="about-spotlight-card"
          spotlightColor="rgba(75, 218, 232, 0.75)"
          position={{ x: 12, y: 12 }}
        >
          <div className="card-content">
            <img src={ai_icon} alt="AI Icon" className="card-icon" />
            <h3>AI Solutions</h3>
            <p>
              Building intelligent systems and smart automation tools to empower
              businesses and modern workflows.
            </p>
          </div>
        </SpotlightCard>

        <SpotlightCard
          className="about-spotlight-card"
          spotlightColor="rgba(125, 232, 75, 0.75)"
          position={{ x: 32, y: 32 }}
        >
          <div className="card-content">
            <img
              src={innovation_icon}
              alt="Innovation Icon"
              className="card-icon"
            />
            <h3>Innovation</h3>
            <p>
              Creating forward-thinking solutions, experimenting with new
              technologies, and pushing boundaries of software development.
            </p>
          </div>
        </SpotlightCard>

        <SpotlightCard
          className="about-spotlight-card"
          spotlightColor="rgba(232, 75, 127, 0.75)"
          position={{ x: 24, y: 24 }}
        >
          <div className="card-content">
            <img src={liberty_icon} alt="Liberty Icon" className="card-icon" />
            <h3>Liberty</h3>
            <p>
              Advocating open-source, ethical coding practices, and freedom of
              choice in tech solutions.
            </p>
          </div>
        </SpotlightCard>
      </div>
      
      
      */}



               {/* Footer */}
               <div style={{ position: "relative", zIndex: 1, paddingBottom: "0rem" }}>
                    {/* Navbar, RotatingText, SpotlightCards vs */}
                    <Footer />
               </div>
          </div>
     );
};

export default About;