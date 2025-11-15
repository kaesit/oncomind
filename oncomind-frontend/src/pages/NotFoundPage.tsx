import React from "react";
import { Link } from "react-router-dom";

// We can remove React.CSSProperties, which was causing the issue.
// TypeScript will infer the types correctly.
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100%",
    backgroundColor: "#0a0a0a",
    color: "#f5ecec",
    fontFamily: '"Cascadia Code", monospace',
  },
  title: {
    fontSize: "6rem",
    fontWeight: 700,
    color: "#60a5fa", // Your primary color
    margin: 0,
  },
  message: {
    fontSize: "1.5rem",
    color: "#f5ecec",
    marginBottom: "30px",
  },
  link: {
    fontSize: "1rem",
    color: "#f5ecec",
    backgroundColor: "#17171c",
    padding: "10px 20px",
    borderRadius: "15px",
    textDecoration: "none",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "all 0.3s ease",
  },
  // We removed 'linkHover' from here, as we'll use a CSS class.
};

const NotFoundPage: React.FC = () => {
  return (
    // We add a <style> tag to handle the hover, which is cleaner
    // and requires a React.Fragment (the <>) wrapper.
    <>
      <style>
        {`
          .notFoundLink:hover {
            color: #60a5fa !important; /* Your hover color */
            border-color: #60a5fa !important; /* Your hover border */
          }
        `}
      </style>

      <div style={styles.container as React.CSSProperties}>
        <h1 style={styles.title}>// 404</h1>
        <p style={styles.message}>[Page Not Found]</p>
        <Link
          to="/"
          style={styles.link as React.CSSProperties}
          className="notFoundLink" // We give it a class
          // No more onMouseEnter or onMouseLeave!
        >
          &lt; Go Home /&gt;
        </Link>
      </div>
    </>
  );
};

export default NotFoundPage;