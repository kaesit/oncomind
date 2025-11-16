// components/BrutalistCard.tsx

import React from 'react';
import '../css/BrutalistCard.css'; // Make sure the path is correct

type BrutalistCardProps = {
  /** The main heading for the card */
  title: string;
  /** The body text */
  children: React.ReactNode;
  /** An optional string for a small tag, e.g., "Phase 3" */
  tag?: string;
  /** Use our accent color for the border/shadow */
  isFeatured?: boolean;
  /** An optional URL for a background image */
  backgroundImageUrl?: string;
};

export const BrutalistCard: React.FC<BrutalistCardProps> = ({
  title,
  children,
  tag,
  isFeatured = false,
  backgroundImageUrl,
}) => {

  // Add 'has-bg-image' class if the prop is provided
  const cardClasses = `brutalist-card-wrapper ${isFeatured ? 'featured' : ''} ${backgroundImageUrl ? 'has-bg-image' : ''
    }`.trim();

  // Pass the image URL as a CSS custom property
  const cardStyles: React.CSSProperties = {
    // This variable is only used if 'has-bg-image' class is present
    '--card-bg-image': `url(${backgroundImageUrl})`,
  };

  return (
    <div className={cardClasses} style={backgroundImageUrl ? cardStyles : {}}>
      {tag && <span className="card-tag">{tag}</span>}
      <h3 className="card-title">{title}</h3>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};