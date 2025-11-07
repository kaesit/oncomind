import React from "react";
import SpotlightCard from "../components/SpotlightCard";
import "../css/SignPage.css";

import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";


const DarkTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    color: "#D7DEDF", // yazı rengi
    fontFamily:
      'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
    backgroundColor: "rgba(35, 33, 33, 0.3)", // koyu arka plan
    borderRadius: "0.75rem",
  },
  "& label": {
    color: "#aaa", // varsayılan label
    fontFamily:
      'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
  },
  "& label.Mui-focused": {
    color: "#93b9e1", // accent focus
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.18)", // default border
    },
    "&:hover fieldset": {
      borderColor: "#93b9e1", // hover border
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3188b3", // focus border
      boxShadow: "0 0 12px rgba(147, 225, 158, 0.4)", // neon efekt
    },
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: "1.5rem",
  padding: "0.75rem 2rem",
  borderRadius: "0.75rem",
  textTransform: "none",
  fontWeight: 600,
  fontFamily:
    'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
  fontSize: "1rem",
  color: "#fff",
  backgroundColor: "#93b9e1",
  boxShadow: "0 4px 20px rgba(147,185,225,0.4)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#7ca6d1",
    boxShadow: "0 6px 25px rgba(147,185,225,0.6)",
  },
}));

const Signup: React.FC = () => {
  return (
    <div className="sign-page">
      {/* Sayfa Başlığı */}
      <header className="sign-page-header">
        <h1 className="sign-page-title">Sign up</h1>
      </header>

      {/* Spotlight Kartlar */}
      <div className="sign-form">
        <SpotlightCard
          className="custom-spotlight-card"
          spotlightColor="rgba(60, 36, 147, 0.25)"
          position={{ x: 12, y: 12 }}
        >
          <div className="sign-content">
            <img src={"logo"} alt="AI Icon" className="card-icon" />
            <DarkTextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <DarkTextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <DarkTextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <SubmitButton variant="contained" fullWidth>Sign up</SubmitButton>
          </div>
        </SpotlightCard>
      </div>
      {/* Footer */}
      <div style={{ position: "relative", zIndex: 1, paddingBottom: "0rem" }}>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Esad Abdullah Kösedağ. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;