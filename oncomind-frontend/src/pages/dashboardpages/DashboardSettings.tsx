import React from "react";
import { TextBox } from "devextreme-react/text-box";
import { Switch } from "devextreme-react/switch";
import { SelectBox } from "devextreme-react/select-box";
import { Button } from "devextreme-react/button";
import "../../css/DashboardSettings.css";

export default function DashboardSettings() {
     return (
          <div className="settings-page">

               <h2 className="page-title">Dashboard Settings</h2>

               {/* ===== SYSTEM SETTINGS CARD ===== */}
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
                                   items={["Light", "Dark", "Auto"]}
                                   placeholder="Select Theme"
                              />
                         </div>

                         <div className="field">
                              <label>Timezone</label>
                              <SelectBox
                                   items={["UTC", "EST", "CST", "MST", "PST"]}
                                   placeholder="Select Timezone"
                              />
                         </div>

                         <div className="field">
                              <label>Enable Logs</label>
                              <Switch defaultValue={true} />
                         </div>
                    </div>
               </div>
               {/* ===== USER PREFERENCES CARD ===== */}
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
               <div className="settings-actions">
                    <Button text="Save Settings" type="default" stylingMode="contained" />
                    <Button text="Reset" type="normal" />
               </div>
               <div className="card-dx">
                    fksdlkflşsdkşlfds
               </div>
          </div>

     );
}
