import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Form, { Item, Label, ButtonItem, RequiredRule, EmailRule } from "devextreme-react/form";
import DateBox from 'devextreme-react/date-box';
import notify from 'devextreme/ui/notify';
import { styled } from "@mui/material/styles";
import "../../css/DataSets.css";

// --- STYLES (Kept exactly as you had them) ---
const dateBoxLabel = { 'aria-label': 'Date' };
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
     const [isSignup, setIsSignup] = useState(false);

     // 1. Fixed State Management
     const [formData, setFormData] = useState({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          specialization: "Oncologist",
          profilePicture: ""
     });

     // Date state (allowed to be undefined initially)
     const [birthDate, setBirthDate] = useState<Date | undefined>(new Date());

     // 2. Handle Input Changes from DevExtreme Form
     const handleFieldChange = (e: any) => {
          setFormData({ ...formData, [e.dataField]: e.value });
     };

     // 3. Handle Date Change
     const onDateChange = useCallback(({ value }: { value?: Date }) => {
          setBirthDate(value);
     }, []);

     // 4. THE REAL SUBMIT LOGIC
     const handleSubmit = async (e: any) => {
          e.preventDefault();

          const url = isSignup
               ? "http://localhost:5001/api/Auth/register"
               : "http://localhost:5001/api/Auth/login";

          // Prepare payload dynamically
          const payload = isSignup ? {
               firstName: formData.firstName,
               lastName: formData.lastName,
               email: formData.email,
               password: formData.password,
               specialization: formData.specialization,
               dateOfBirth: birthDate,
               profilePicture: formData.profilePicture
          } : {
               email: formData.email,
               password: formData.password
          };

          try {
               const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
               });

               const data = await response.json();

               if (!response.ok) {
                    notify(data.message || "Authentication failed", "error", 3000);
                    return;
               }

               // Success!
               notify(isSignup ? "Account created! Please log in." : "Welcome back!", "success", 2000);

               if (isSignup) {
                    // If register success, switch to login mode automatically
                    setIsSignup(false);
               } else {
                    // If login success, save ID and redirect
                    localStorage.setItem("doctorId", data.doctorId);
                    localStorage.setItem("doctorName", data.name); // Optional: Save name for UI
                    localStorage.setItem("doctorSpecialization", data.specialization || "Doctor")
                    localStorage.setItem("doctorImage", data.image)
                    navigate("/admin");
               }

          } catch (error) {
               console.error("Error:", error);
               notify("Network error. Is the Backend running?", "error", 3000);
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
                         <Form
                              formData={formData}
                              labelMode="floating"
                              onFieldDataChanged={handleFieldChange} // 👈 Keeps state in sync
                         >

                              {isSignup && (
                                   <Item dataField="firstName" editorType="dxTextBox">
                                        <Label text="First Name" />
                                        <RequiredRule message="Name is required" />
                                   </Item>
                              )}
                              {isSignup && (
                                   <Item dataField="lastName" editorType="dxTextBox">
                                        <Label text="Last Name" />
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

                              {isSignup && (
                                   <Item
                                        dataField="specialization"
                                        editorType="dxSelectBox"
                                        editorOptions={{ items: ["Oncologist", "Bioinformatics", "Genetics", "Researcher"] }}
                                   >
                                        <Label text="Specialization" />
                                   </Item>
                              )}

                              {/* Custom Item for DateBox because it's not a standard Form Item editorType */}
                              {isSignup && (
                                   <Item>
                                        <div style={{ marginBottom: 15 }}>
                                             <DateBox
                                                  label="Date of Birth"
                                                  labelMode="floating"
                                                  value={birthDate}
                                                  onValueChanged={onDateChange}
                                                  inputAttr={dateBoxLabel}
                                                  type="date"
                                             />
                                        </div>
                                   </Item>
                              )}

                              {isSignup && (
                                   <Item dataField="profilePicture" editorType="dxTextBox">
                                        <Label text="Profile Picture URL" />
                                   </Item>
                              )}

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