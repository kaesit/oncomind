import React, { useState, useMemo, useEffect } from "react";
import TextBox from "devextreme-react/text-box";
import { Button } from "devextreme-react/button";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import { Popup } from "devextreme-react/popup";
import { SelectBox } from "devextreme-react/select-box";
import { useNavigate } from "react-router-dom"; // For navigation
import { patientService, PatientDto } from "../../services/patientService";
import "../../css/DataSets.css";
import Form, { Item, Label, RequiredRule, RangeRule } from "devextreme-react/form";
import notify from "devextreme/ui/notify"; // Nice toast notifications

/* ------------------------------------------------------
   UI STYLING (Kept exactly as you had it)
------------------------------------------------------ */
const CardContainer = styled("div")({
     position: "relative",
     background: "var(--dx-theme-background-color)",
     border: "1px solid rgba(255,255,255,0.07)",
     borderRadius: "12px",
     padding: "14px",
     display: "flex",
     flexDirection: "column",
     gap: "12px",
     transition: "0.2s",
     boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
     cursor: "pointer",
     color: "var(--dx-theme-base-text-color)",
     "&:hover": {
          borderColor: "var(--dx-theme-accent-color)",
          transform: "translateY(-2px)",
     },
});

const PreviewImg = styled("img")({
     width: "100%",
     height: "150px",
     objectFit: "cover",
     borderRadius: "8px",
});

const getStatusColor = (status: string) => {
     switch (status?.toUpperCase()) {
          case "STABLE": return "#4CAF50"; // Green
          case "NORMAL": return "#2196F3"; // Blue
          case "HIGH": return "#FF9800"; // Orange
          case "URGENT": return "#F44336"; // Red
          default: return "#9E9E9E"; // Grey
     }
};

const StatusBadge = styled("span")(({ status }: { status: string }) => ({
     padding: "4px 10px",
     borderRadius: "6px",
     fontSize: "12px",
     fontWeight: 700,
     alignSelf: "flex-start",
     background: `${getStatusColor(status)}22`,
     color: getStatusColor(status),
}));

/* ------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------ */
const Patients: React.FC = () => {
     const navigate = useNavigate(); // Hook for navigation

     // 1. STATE: Store real data here
     const [patients, setPatients] = useState<any[]>([]);
     const [loading, setLoading] = useState(true);

     const [search, setSearch] = useState("");
     const [selected, setSelected] = useState<number[]>([]);

     // Filter popup controls
     const [filterPopup, setFilterPopup] = useState(false);
     const [filterGender, setFilterGender] = useState(null);
     const [filterStatus, setFilterStatus] = useState(null);
     const [filterAdmitted, setFilterAdmitted] = useState(null);
     const [startDate, setStartDate] = useState("");
     const [endDate, setEndDate] = useState("");


     // 2. EFFECT: Fetch data from C# API on load
     useEffect(() => {
          loadData();
     }, []);

     const loadData = async () => {
          setLoading(true);
          const data = await patientService.getAll();

          // 3. MAPConvert C# Data Structure to UI Structure
          const mappedData = data.map((p: PatientDto) => {
               // Helper to handle mixed types safely
               let genderDisplay = "Other";
               const g = p.gender;

               // Check as string ("0") or word ("Male")
               if (g === "0" || g === "Male") genderDisplay = "Male";
               else if (g === "1" || g === "Female") genderDisplay = "Female";
               else genderDisplay = g; // Fallback

               return {
                    id: p.id,
                    name: `${p.firstName} ${p.lastName}`,
                    age: p.age,
                    gender: genderDisplay, // ✅ Fixed
                    treatmentStart: p.treatmentStartAt ? new Date(p.treatmentStartAt).toLocaleDateString() : "N/A",
                    status: p.emergencyStatus || "Stable",
                    room: p.admissionLocation || "Not Assigned",
                    admitted: p.isAdmitted, // ✅ Now valid (interface updated)
                    preview: p.profilePicture || "https://via.placeholder.com/500?text=No+Image"
               };
          });

          setPatients(mappedData);
          setLoading(false);
     };

     const toggleSelect = (id: number) => {
          setSelected((prev) =>
               prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
          );
     };


     const filteredPatients = useMemo(() => {
          return patients.filter((p) => {
               const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
               const matchesGender = !filterGender || p.gender === filterGender;
               const matchesStatus = !filterStatus || p.status === filterStatus;
               const matchesAdmitted = filterAdmitted === null
                    ? true
                    : filterAdmitted === "Yes" ? p.admitted : !p.admitted;

               return matchesSearch && matchesGender && matchesStatus && matchesAdmitted;
          });
     }, [patients, search, filterGender, filterStatus, filterAdmitted]);

     const [addPopupVisible, setAddPopupVisible] = useState(false);
     const [newPatient, setNewPatient] = useState({
          firstName: "",
          lastName: "",
          age: 30,
          gender: "Male",
          emergencyStatus: "Stable",
          admissionLocation: ""
     });

     // 2. Handle the "Save" Button click
     const handleSavePatient = async () => {
          try {
               // Get logged in Doctor ID (from our Login step earlier)
               const doctorId = localStorage.getItem("doctorId") || "";

               await patientService.create({
                    ...newPatient,
                    assignedDoctorId: doctorId
               });

               notify("Patient added successfully!", "success", 2000);
               setAddPopupVisible(false); // Close popup
               loadData(); // Refresh the list automatically!
          } catch (error) {
               console.error(error);
               notify("Error adding patient", "error", 2000);
          }
     };

     return (
          <div className="datasets-wrapper">
               <div className="datasets-actions">
                    <Button text="Add New" icon="add" type="default" onClick={() => setAddPopupVisible(true)} />
                    <Button text="Delete" icon="trash" type="danger" disabled={selected.length === 0} />
                    <TextBox placeholder="Search patient..." value={search} onValueChanged={(e) => setSearch(e.value)} width={260} />
                    <Button text="Filter" icon="filter" stylingMode="outlined" onClick={() => setFilterPopup(true)} />
               </div>

               <Popup
                    visible={addPopupVisible}
                    onHiding={() => setAddPopupVisible(false)}
                    dragEnabled={false}
                    hideOnOutsideClick={true}
                    showCloseButton={true}
                    showTitle={true}
                    title="Register New Patient"
                    width={500}
                    height={550}
               >
                    <div style={{ padding: 20 }}>
                         <Form formData={newPatient}>
                              <Item dataField="firstName">
                                   <RequiredRule message="First Name is required" />
                                   <Label text="First Name" />
                              </Item>
                              <Item dataField="lastName">
                                   <RequiredRule message="Last Name is required" />
                                   <Label text="Last Name" />
                              </Item>
                              <Item dataField="age" editorType="dxNumberBox">
                                   <RangeRule min={0} max={120} message="Age must be valid" />
                                   <Label text="Age" />
                              </Item>
                              <Item
                                   dataField="gender"
                                   editorType="dxSelectBox"
                                   editorOptions={{ items: ["Male", "Female"] }}
                              >
                                   <Label text="Gender" />
                              </Item>
                              <Item
                                   dataField="emergencyStatus"
                                   editorType="dxSelectBox"
                                   editorOptions={{ items: ["Stable", "Normal", "High", "Urgent"] }}
                              >
                                   <Label text="Initial Status" />
                              </Item>
                              <Item dataField="admissionLocation">
                                   <Label text="Room / Bed (Optional)" />
                              </Item>
                         </Form>

                         <div style={{ marginTop: 30, display: "flex", justifyContent: "flex-end", gap: 10 }}>
                              <Button text="Cancel" onClick={() => setAddPopupVisible(false)} />
                              <Button text="Save Patient" type="default" onClick={handleSavePatient} />
                         </div>
                    </div>
               </Popup>

               <Popup visible={filterPopup} onHiding={() => setFilterPopup(false)} showCloseButton={true} width={380} title="Filter Patients">
                    <div className="filter-popup-body">
                         <SelectBox label="Gender" placeholder="All" items={["Male", "Female"]} onValueChanged={(e) => setFilterGender(e.value)} />
                         <SelectBox label="Status" placeholder="All" items={["Stable", "Normal", "High", "Urgent"]} onValueChanged={(e) => setFilterStatus(e.value)} />
                         <SelectBox label="Admitted" placeholder="All" items={["Yes", "No"]} onValueChanged={(e) => setFilterAdmitted(e.value)} />
                    </div>
               </Popup>

               <div className="datasets-grid">
                    {loading ? <p style={{ color: 'white' }}>Loading patients...</p> : filteredPatients.map((p) => (
                         // 4. NAVIGATION: Pass ID to the details page
                         <div key={p.id} onClick={() => navigate(`/admin/patients/${p.id}`)} style={{ textDecoration: "none", color: "white" }}>
                              <CardContainer>
                                   <Checkbox checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} sx={{ position: "absolute", top: "10px", left: "10px", zIndex: 5, color: "var(--dx-theme-secondary-color)", "&.Mui-checked": { color: "var(--dx-theme-accent-color)" } }} />
                                   <PreviewImg src={p.preview} alt={p.name} />
                                   <h3 style={{ margin: 0 }}>{p.name}</h3>
                                   <StatusBadge status={p.status}>{p.status}</StatusBadge>
                                   <p style={{ margin: 0, opacity: 0.85 }}>Age: {p.age} | Gender: {p.gender}</p>
                                   <p style={{ margin: 0, opacity: 0.85 }}>{p.admitted ? p.room : "Not admitted"}</p>
                              </CardContainer>
                         </div>
                    ))}
               </div>
          </div>
     );
};

export default Patients;