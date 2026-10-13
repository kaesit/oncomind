import React from "react";
import { Button, Card, CardHead, Field, Input, PageHeader, RadioGroup, Select, Switch } from "../../dashboard/ui";

const dataSource = ['Low', 'Normal', 'Urgent', 'High'];
const dataSource2 = ['Mail', 'SMS', 'Slack', 'Teams'];

function SwitchRow({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
     return (
          <div className="om-switch-row">
               <span className="om-label">{label}</span>
               <Switch defaultChecked={defaultChecked} ariaLabel={label} />
          </div>
     );
}

function Actions() {
     return (
          <div className="om-toolbar" style={{ justifyContent: "flex-end" }}>
               <Button>Reset</Button>
               <Button variant="primary">Save Settings</Button>
          </div>
     );
}

const settingsGrid: React.CSSProperties = {
     display: "grid",
     gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
     gap: 14,
     alignItems: "start",
};

export default function DashboardSettings() {
     return (
          <div className="om-page">
               <PageHeader title="Dashboard Settings" sub="System, preferences and emergency behaviour" />

               {/* ===== SYSTEM SETTINGS ===== */}
               <div style={settingsGrid}>
                    <Card>
                         <CardHead title="System Configuration" />
                         <div className="om-stack">
                              <Field label="System Name">
                                   <Input placeholder="My Dashboard" />
                              </Field>
                              <Field label="Theme">
                                   <Select items={["Light", "Men", "Auto"]} placeholder="Select Theme" />
                              </Field>
                              <Field label="Model">
                                   <Select items={["GPT-5", "ONCOMIND", "GEMINI-3", "CLAUDE 3", "LLAMA"]} placeholder="Select a default model" />
                              </Field>
                              <SwitchRow label="Enable Logs" defaultChecked />
                         </div>
                    </Card>

                    {/* ===== USER PREFERENCES ===== */}
                    <Card>
                         <CardHead title="User Preferences" />
                         <div className="om-stack">
                              <Field label="Language">
                                   <Select items={["English", "Spanish", "German"]} />
                              </Field>
                              <SwitchRow label="Notifications" />
                              <Field label="Dashboard Welcome Message">
                                   <Input placeholder="Type a custom message..." />
                              </Field>
                         </div>
                    </Card>

                    <Card>
                         <CardHead title="System Emergency Preferences" />
                         <div className="om-stack" style={{ gap: 18 }}>
                              <Field label="What is the level of emergency of your patients need">
                                   <RadioGroup items={dataSource} defaultValue="Low" />
                              </Field>
                              <Field label="Choose the system power level by emergency level">
                                   <RadioGroup items={dataSource} defaultValue="Low" />
                              </Field>
                              <SwitchRow label="Open at Background" />
                         </div>
                    </Card>
               </div>
               <Actions />

               {/* ===== API SETTINGS ===== */}
               <h2 className="om-section-title" style={{ marginTop: 12 }}>API Settings</h2>
               <div style={settingsGrid}>
                    <Card>
                         <CardHead title="API Configurations" />
                         <div className="om-stack">
                              <Field label="Environment Name">
                                   <Input placeholder="My Environment" />
                              </Field>
                              <Field label="Theme">
                                   <Select items={["Jupyter", "Colab", "Kaggle"]} placeholder="Select Notebook Type" />
                              </Field>
                              <Field label="Mail API Provider">
                                   <Select items={["SMTP2Go", "Postmark", "Yandex Mail", "Brevo"]} placeholder="Select a default mail transaction service" />
                              </Field>
                              <SwitchRow label="Enable Logs" defaultChecked />
                         </div>
                    </Card>

                    <Card>
                         <CardHead title="User Preferences" />
                         <div className="om-stack">
                              <Field label="Log-Backup Period">
                                   <Select items={["1 Day", "1 Week", "1 Month", "Never(Not Recommended)"]} />
                              </Field>
                              <SwitchRow label="Mail Notifications" />
                              <SwitchRow label="SMS Notifications" />
                              <SwitchRow label="Slack Notifications" />
                              <SwitchRow label="Teams Notifications" />
                         </div>
                    </Card>

                    <Card>
                         <CardHead title="System Traffic Preferences" />
                         <div className="om-stack" style={{ gap: 18 }}>
                              <Field label="Are you using API benefits lot?">
                                   <RadioGroup items={dataSource} defaultValue="Low" />
                              </Field>
                              <Field label="What is the API tool you use most">
                                   <RadioGroup items={dataSource2} defaultValue="Mail" />
                              </Field>
                         </div>
                    </Card>
               </div>
               <Actions />
          </div>
     );
}
