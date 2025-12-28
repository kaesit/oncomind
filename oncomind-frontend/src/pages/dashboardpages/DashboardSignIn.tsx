import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react/button";
import { styled, alpha } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import "../../css/DashboardSignPage.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RoomIcon from "@mui/icons-material/Room";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { TextBox } from "devextreme-react/text-box";
import { Switch } from "devextreme-react/switch";
import { SelectBox } from "devextreme-react/select-box";
import "../../css/DashboardSettings.css";
import { RadioGroup } from 'devextreme-react/radio-group';

const dataSource = ['Low', 'Normal', 'Urgent', 'High'];
const dataSource2 = ['Mail', 'SMS', 'Slack', 'Teams'];


const DashboardSignIn: React.FC = () => {
     return (
          <>
               <div className="sign_page_container">
                    <center>
                         <h1>
                              Dashboard SignIn
                         </h1>
                         <div className="form-grid">
                              <div className="settings-card">
                                   <h3 className="card-title">System Configuration</h3>

                                   <div className="settings-grid">
                                        <div className="field">
                                             <label>System Name</label>
                                             <TextBox placeholder="My Dashboard" />
                                        </div>

                                        <div className="field">
                                             <label>Theme</label>
                                             <SelectBox
                                                  items={["Light", "Men", "Auto"]}
                                                  placeholder="Select Theme"
                                             />
                                        </div>

                                        <div className="field">
                                             <label>Model</label>
                                             <SelectBox
                                                  items={["GPT-5", "ONCOMIND", "GEMINI-3", "CLAUDE 3", "LLAMA"]}
                                                  placeholder="Select a default model"
                                             />
                                        </div>

                                        <div className="field">
                                             <label>Enable Logs</label>
                                             <Switch defaultValue={true} />
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </center>
               </div>

          </>
     );
};



export default DashboardSignIn;