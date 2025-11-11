// BrutalistHero.tsx

import React from 'react';
import { BrutalistButton } from './BrutalistButton'; // Import our button
import '../css/BrutalistHero.css'; // Import the hero styles

// Define the type for a single logo
type Logo = {
  src: string;
  alt: string;
};

// Define the Hero component's props
type BrutalistHeroProps = {
  // === Content Props ===
  headingText: React.ReactNode;
  paragraphText: React.ReactNode;
  buttonText: string;
  imageUrl: string;
  imageAlt?: string;
  /** An array of logo objects for the "logo cloud" */
  logos?: Logo[];
  logoCloudHeading?: string;

  // === Style Props ===
  /** Sets the width for the entire hero container (e.g., '100%', '1200px') */
  width?: string;
  /** Sets the height for the entire hero container (e.g., '80vh', '700px') */
  height?: string;
  /** Sets the font size for the main <h1> heading */
  headingFontSize?: string;
  /** Sets the font size for the <p> paragraph text */
  paragraphFontSize?: string;

  // === Event Handlers ===
  onButtonClick?: () => void;
};

/**
 * A full brutalist hero section component.
 */
export const BrutalistHero: React.FC<BrutalistHeroProps> = ({
  headingText,
  paragraphText,
  buttonText,
  imageUrl,
  imageAlt = 'Hero visual',
  logos,
  logoCloudHeading = 'As Seen On',
  width,
  height,
  headingFontSize,
  paragraphFontSize,
  onButtonClick,
}) => {
  // Create inline styles from props for dynamic control
  const containerStyle: React.CSSProperties = {
    width,
    height,
  };

  const headingStyle: React.CSSProperties = {
    fontSize: headingFontSize,
  };

  const paragraphStyle: React.CSSProperties = {
    fontSize: paragraphFontSize,
  };

  return (
    <section className="brutalist-hero-container" style={containerStyle}>
      
      {/* --- Main Hero Content (2-column) --- */}
      <div className="brutalist-hero-main">
        {/* Left Side: Image */}
        <div className="hero-image-wrapper">
          <img src={imageUrl} alt={imageAlt} className="hero-image" />
        </div>

        {/* Right Side: Content */}
        <div className="hero-content-wrapper">
          <h1 style={headingStyle}>{headingText}</h1>
          <p style={paragraphStyle}>{paragraphText}</p>
          <BrutalistButton onClick={onButtonClick}>
            {buttonText}
          </BrutalistButton>
        </div>
      </div>

      {/* --- Optional Logo Cloud Section --- */}
      {logos && logos.length > 0 && (
        <div className="brutalist-logo-cloud">
          <h3 className="logo-cloud-heading">{logoCloudHeading}</h3>
          <div className="logo-grid">
            {logos.map((logo, index) => (
              <div className="logo-item" key={index}>
                <img src={logo.src} alt={logo.alt} />
              </div>
            ))}
          </div>
        </div>
      )}

    </section>
  );
};

export default BrutalistHero;