import React from "react";
import { TextBox } from "devextreme-react/text-box";
import { Switch } from "devextreme-react/switch";
import { SelectBox } from "devextreme-react/select-box";
import { Button } from "devextreme-react/button";
import "../../css/DashboardSettings.css";
import { RadioGroup } from 'devextreme-react/radio-group';

const dataSource = ['Low', 'Normal', 'Urgent', 'High'];
const dataSource2 = ['Mail', 'SMS', 'Slack', 'Teams'];


export default function DashboardSettings() {
     return (
          <div className="settings-page">

               <h2 className="page-title">Dashboard Settings</h2>
               {/* ===== SYSTEM SETTINGS CARD ===== */}
               <div className="page-grid">


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
                    {/* ===== USER PREFERENCES CARD ===== */}
                    <div>
                         <div className="settings-card">
                              <h3 className="card-title">User Preferences</h3>

                              <div className="settings-grid">
                                   <div className="field">
                                        <label>Language</label>
                                        <SelectBox items={["English", "Spanish", "German"]} />
                                   </div>

                                   <div className="field">
                                        <label>Notifications</label>
                                        <Switch>
                                        </Switch>
                                   </div>

                                   <div className="field full">
                                        <label>Dashboard Welcome Message</label>
                                        <TextBox placeholder="Type a custom message..." />
                                   </div>
                              </div>
                         </div>

                         {/* ==== SAVE BUTTON BAR ===== */}

                    </div>
                    <div>
                         <div className="card-dx">
                              <h3 className="card-title">System Emergency Preferences</h3>
                              <div className="settings-grid">
                                   <div className="field">
                                        <label>What is the level of emergency of your patients need</label>
                                        <RadioGroup
                                             dataSource={dataSource}
                                             defaultValue={"Low"}
                                        />
                                   </div>
                                   <div className="field">
                                        <label>Choose the system power level by emergency level</label>
                                        <RadioGroup
                                             dataSource={dataSource}
                                             defaultValue={"Low"}
                                        />
                                   </div>
                                   <div className="field">
                                        <label>Open at Background</label>
                                        <Switch></Switch>
                                   </div>
                              </div>

                         </div>
                    </div>
                    <div className="settings-actions">
                         <Button text="Save Settings" type="default" stylingMode="contained" />
                         <Button text="Reset" type="normal" />
                    </div>
               </div>
               <h2 className="page-title">API Settings</h2>
               <div className="page-grid">
                    <div className="settings-card">
                         <h3 className="card-title">API Configurations</h3>

                         <div className="settings-grid">
                              <div className="field">
                                   <label>Environment Name</label>
                                   <TextBox placeholder="My Environment" />
                              </div>

                              <div className="field">
                                   <label>Theme</label>
                                   <SelectBox
                                        items={["Jupyter", "Colab", "Kaggle"]}
                                        placeholder="Select Notebook Type"
                                   />
                              </div>

                              <div className="field">
                                   <label>Mail API Provider</label>
                                   <SelectBox
                                        items={["SMTP2Go", "Postmark", "Yandex Mail", "Brevo"]}
                                        placeholder="Select a default mail transaction service"
                                   />
                              </div>

                              <div className="field">
                                   <label>Enable Logs</label>
                                   <Switch defaultValue={true} />
                              </div>
                         </div>
                    </div>
                    {/* ===== USER PREFERENCES CARD ===== */}
                    <div>
                         <div className="settings-card">
                              <h3 className="card-title">User Preferences</h3>

                              <div className="settings-grid">
                                   <div className="field">
                                        <label>Log-Backup Period</label>
                                        <SelectBox items={["1 Day", "1 Week", "1 Month", "Never(Not Recommended)"]} />
                                   </div>

                                   <div className="field">
                                        <label>Mail Notifications</label>
                                        <Switch>
                                        </Switch>
                                   </div>

                                   <div className="field">
                                        <label>SMS Notifications</label>
                                        <Switch>
                                        </Switch>
                                   </div>
                                   <div className="field">
                                        <label>Slack Notifications</label>
                                        <Switch>
                                        </Switch>
                                   </div>
                                   <div className="field">
                                        <label>Teams Notifications</label>
                                        <Switch>
                                        </Switch>
                                   </div>
                              </div>
                         </div>
                    </div>
                    <div>
                         <div className="card-dx">
                              <h3 className="card-title">System Traffic Preferences</h3>
                              <div className="settings-grid">
                                   <div className="field">
                                        <label>Are you using API benefits lot?</label>
                                        <RadioGroup
                                             dataSource={dataSource}
                                             defaultValue={"Low"}
                                        />
                                   </div>
                                   <div className="field">
                                        <label>What is the API tool you use most</label>
                                        <RadioGroup
                                             dataSource={dataSource2}
                                             defaultValue={"Mail"}
                                        />
                                   </div>
                              </div>

                         </div>
                    </div>
                    <div className="settings-actions">
                         <Button text="Save Settings" type="default" stylingMode="contained" />
                         <Button text="Reset" type="normal" />
                    </div>
               </div>
          </div>

     );
}
