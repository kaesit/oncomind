// components/BrutalistCard.tsx

import React from 'react';
import '../css/BrutalistCard.css';

type BrutalistCardProps = {
  /** The main heading for the card */
  title: string;
  /** The body text */
  children: React.ReactNode;
  /** An optional string for a small tag, e.g., "Phase 3" */
  tag?: string;
  /** Use our accent color for the border/shadow */
  isFeatured?: boolean;
};

export const BrutalistCard: React.FC<BrutalistCardProps> = ({
  title,
  children,
  tag,
  isFeatured = false,
}) => {
  
  const cardClasses = `brutalist-card-wrapper ${isFeatured ? 'featured' : ''}`.trim();

  return (
    <div className={cardClasses}>
      {tag && <span className="card-tag">{tag}</span>}
      <h3 className="card-title">{title}</h3>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};