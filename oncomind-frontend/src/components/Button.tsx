// BrutalistButton.tsx

import React from 'react';
import '../css/Button.css'; // Importing the updated styles

<style>
@import url('https://fonts.googleapis.com/css2?family=M+PLUS+1+Code:wght@100..700&display=swap');
</style>
// Define the component's props
type BrutalistButtonProps = {
  /** Sets the component's width. */
  width?: string;
  /** Sets the component's height. */
  height?: string;
  /**
   * Sets the transition timing function (e.g., 'ease-in', 'linear', 'cubic-bezier(...)').
   * Note: The duration is set in BrutalistButton.css (default: 0.15s).
   */
  transition_effect?: string;
  font_size?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>; // Extend standard button props

/**
 * An "official" brutalist-style button for dark blue themes.
 * Accepts all standard <button> props, plus width, height, and transition_effect.
 */
export const BrutalistButton: React.FC<BrutalistButtonProps> = ({
  children,
  className,
  width,
  height,
  transition_effect,
  font_size,
  style, // Capture any existing style prop
  ...rest // All other standard button props (onClick, disabled, etc.)
}) => {
  // Combine our base class with any custom classes
  const buttonClassName = `brutalist-button ${className || ''}`.trim();

  // Create the style object from props
  // We merge it with any 'style' prop the user might also pass
  const inlineStyles: React.CSSProperties = {
    ...style,
    width: width,
    height: height,
    transitionTimingFunction: transition_effect,
    fontSize: font_size
  };

  return (
    <button className={buttonClassName} style={inlineStyles} {...rest}>
      {children}
    </button>
  );
};

export default BrutalistButton;