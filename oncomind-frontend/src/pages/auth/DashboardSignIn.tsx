import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form, { Item, Label, ButtonItem, RequiredRule, EmailRule } from "devextreme-react/form";
import { styled } from "@mui/material/styles";
import "../../css/DataSets.css"; // Ensure this imports your dark theme CSS

// --- STYLES ---
const AuthWrapper = styled("div")({
     height: "100vh",
     width: "100vw",
     display: "flex",
     justifyContent: "center",
     alignItems: "center",
     background: "radial-gradient(circle at top right, #1e1e2f, #0a0a12)",
     color: "#fff",
});

const GlassPanel = styled("div")({
     width: "400px",
     padding: "40px",
     borderRadius: "20px",
     background: "rgba(30, 30, 45, 0.7)",
     backdropFilter: "blur(15px)",
     border: "1px solid rgba(255, 255, 255, 0.1)",
     boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
});

const Title = styled("h2")({
     textAlign: "center",
     marginBottom: "10px",
     background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
     WebkitBackgroundClip: "text",
     WebkitTextFillColor: "transparent",
     fontWeight: 800,
     letterSpacing: "1px",
});

const SubTitle = styled("p")({
     textAlign: "center",
     color: "#94a3b8",
     marginBottom: "30px",
     fontSize: "0.9rem",
});

const LinkText = styled("span")({
     color: "#4facfe",
     cursor: "pointer",
     fontWeight: 600,
     "&:hover": { textDecoration: "underline" },
});

// --- COMPONENT ---
const Login = () => {
     const navigate = useNavigate();
     const [formData] = useState({ email: "", password: "" });
     const [isSignup, setIsSignup] = useState(false);

     const handleSubmit = async (e: any) => {
          e.preventDefault();

          
          // For now, we simulate a successful login
          console.log("Form Data:", formData);

          if (formData.email === "house@oncomind.com" && formData.password === "123") {
               // Simulate storing the Doctor ID (Dr. House's ID from seed)
               localStorage.setItem("doctorId", "69512e3ecf2f297c7d07f6ea");
               navigate("/admin/patients");
          } else {
               alert("Invalid credentials (Try: house@oncomind.com / 123)");
          }
     };

     return (
          <AuthWrapper>
               <GlassPanel>
                    <Title>OncoMind OS</Title>
                    <SubTitle>
                         {isSignup ? "Create your doctor profile" : "Secure access for medical personnel"}
                    </SubTitle>

                    <form onSubmit={handleSubmit}>
                         <Form formData={formData} labelMode="floating">

                              {isSignup && (
                                   <Item dataField="fullName" editorType="dxTextBox">
                                        <Label text="Full Name" />
                                        <RequiredRule message="Name is required" />
                                   </Item>
                              )}

                              <Item dataField="email" editorType="dxTextBox">
                                   <Label text="Email Address" />
                                   <RequiredRule message="Email is required" />
                                   <EmailRule message="Invalid email format" />
                              </Item>

                              <Item
                                   dataField="password"
                                   editorType="dxTextBox"
                                   editorOptions={{ mode: "password" }}
                              >
                                   <Label text="Password" />
                                   <RequiredRule message="Password is required" />
                              </Item>

                              <ButtonItem
                                   horizontalAlignment="center"
                                   buttonOptions={{
                                        text: isSignup ? "Create Account" : "Sign In",
                                        type: "default",
                                        useSubmitBehavior: true,
                                        width: "100%",
                                        elementAttr: { style: { marginTop: "20px", borderRadius: "10px", height: "45px" } }
                                   }}
                              />
                         </Form>
                    </form>

                    <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.85rem", color: "#ccc" }}>
                         {isSignup ? "Already have an account? " : "New to OncoMind? "}
                         <LinkText onClick={() => setIsSignup(!isSignup)}>
                              {isSignup ? "Sign In" : "Register"}
                         </LinkText>
                    </div>

               </GlassPanel>
          </AuthWrapper>
     );
};

export default Login;