import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react/button";
import { useParams } from "react-router-dom";
import "../../css/DashboardSignPage.css";
import Form, { Item, Label, ButtonItem, RequiredRule, EmailRule } from "devextreme-react/form";
import "../../css/DashboardSettings.css";
import { RadioGroup } from 'devextreme-react/radio-group';

const dataSource = ['Low', 'Normal', 'Urgent', 'High'];
const dataSource2 = ['Mail', 'SMS', 'Slack', 'Teams'];


const DashboardSignIn: React.FC = () => {
     return (
          <>
               <div className="sign_page_container">
                    <center>
                         <h1 className="sign_page_title">
                              Dashboard SignIn
                         </h1>
                         <div className="form-grid">
                              <div className="panel">
                                   <form method="POST">
                                        <h1 className="form_title">
                                             Dashboard SignIn
                                        </h1>
                                        <Form labelMode="floating">


                                             {/*AI GENERATED CODE WILL BE DEBUGGED*/}
                                             {/*{isSignup && (
                                             <Item dataField="fullName" editorType="dxTextBox">
                                                  <Label text="Full Name" />
                                                  <RequiredRule message="Name is required" />
                                             </Item>
                                        )} */}

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
                                                       text: "Sign In",
                                                       type: "default",
                                                       useSubmitBehavior: true,
                                                       width: "100%",
                                                       elementAttr: { style: { marginTop: "20px", borderRadius: "10px", height: "45px" } }
                                                  }}
                                             />
                                        </Form>
                                   </form>
                              </div>
                         </div>
                    </center>
               </div>

          </>
     );
};



export default DashboardSignIn;