import React, { useState, useMemo } from "react";
import TextBox from "devextreme-react/text-box";
import { Button } from "devextreme-react/button";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import { Popup } from "devextreme-react/popup";
import { SelectBox } from "devextreme-react/select-box";
import "../../css/DataSets.css";

/* ------------------------------------------------------
   UPDATED MOCK PATIENT DATA
------------------------------------------------------ */
const mockPatients = [
     {
          id: 1,
          name: "Judie Carter",
          age: 6,
          gender: "Female",
          treatmentStart: "2024-09-15",
          status: "LOW",
          room: "Block A - Room 12",
          admitted: true,
          preview:
               "https://images.unsplash.com/photo-1631201036602-c557ad26828e?w=500",
     },
     {
          id: 2,
          name: "Emily Watson",
          age: 32,
          gender: "Female",
          treatmentStart: "2024-11-03",
          status: "URGENT",
          room: "Block C - Room 5",
          admitted: true,
          preview:
               "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500",
     },
     {
          id: 3,
          name: "Jacob Myers",
          age: 41,
          gender: "Male",
          treatmentStart: "2023-02-20",
          status: "NORMAL",
          admitted: false,
          preview:
               "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500",
     },
     {
          id: 4,
          name: "Geraldo Piet",
          age: 29,
          gender: "Male",
          treatmentStart: "2024-05-12",
          status: "HIGH",
          admitted: true,
          room: "Block B - Room 8",
          preview:
               "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500",
     },
];

/* ------------------------------------------------------
   UI STYLING
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
     switch (status) {
          case "LOW":
               return "#4CAF50";
          case "NORMAL":
               return "#2196F3";
          case "URGENT":
               return "#FF9800";
          case "HIGH":
               return "#F44336";
          default:
               return "var(--dx-theme-secondary-color)";
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
     const [search, setSearch] = useState("");
     const [selected, setSelected] = useState<number[]>([]);

     // Filter popup controls
     const [filterPopup, setFilterPopup] = useState(false);
     const [filterGender, setFilterGender] = useState(null);
     const [filterStatus, setFilterStatus] = useState(null);
     const [filterAdmitted, setFilterAdmitted] = useState(null);
     const [startDate, setStartDate] = useState("");
     const [endDate, setEndDate] = useState("");

     const toggleSelect = (id: number) => {
          setSelected((prev) =>
               prev.includes(id)
                    ? prev.filter((x) => x !== id)
                    : [...prev, id]
          );
     };

     /* ------------------------------------------------------
        FILTERING LOGIC
     ------------------------------------------------------ */
     const filteredPatients = useMemo(() => {
          return mockPatients.filter((p) => {
               const matchesSearch = p.name
                    .toLowerCase()
                    .includes(search.toLowerCase());

               const matchesGender =
                    !filterGender || p.gender === filterGender;

               const matchesStatus =
                    !filterStatus || p.status === filterStatus;

               const matchesAdmitted =
                    filterAdmitted === null
                         ? true
                         : filterAdmitted === "Yes"
                              ? p.admitted
                              : !p.admitted;

               const matchesStartDate =
                    !startDate || new Date(p.treatmentStart) >= new Date(startDate);

               const matchesEndDate =
                    !endDate || new Date(p.treatmentStart) <= new Date(endDate);

               return (
                    matchesSearch &&
                    matchesGender &&
                    matchesStatus &&
                    matchesAdmitted &&
                    matchesStartDate &&
                    matchesEndDate
               );
          });
     }, [search, filterGender, filterStatus, filterAdmitted, startDate, endDate]);

     return (
          <div className="datasets-wrapper">
               {/* ----------- TOP ACTIONS ----------- */}
               <div className="datasets-actions">
                    <Button text="Add New" icon="add" type="default" />
                    <Button
                         text="Delete"
                         icon="trash"
                         type="danger"
                         disabled={selected.length === 0}
                    />

                    <TextBox
                         placeholder="Search patient..."
                         value={search}
                         onValueChanged={(e) => setSearch(e.value)}
                         width={260}
                    />

                    <Button
                         text="Filter"
                         icon="filter"
                         stylingMode="outlined"
                         onClick={() => setFilterPopup(true)}
                    />
               </div>

               {/* -------- FILTER POPUP -------- */}
               <Popup
                    visible={filterPopup}
                    hideOnOutsideClick={true}
                    onHiding={() => setFilterPopup(false)}
                    showCloseButton={true}
                    width={380}
                    title="Filter Patients"
               >
                    <div className="filter-popup-body">
                         <SelectBox
                              label="Gender"
                              placeholder="All"
                              items={["Male", "Female"]}
                              onValueChanged={(e) => setFilterGender(e.value)}
                         />

                         <SelectBox
                              label="Status"
                              placeholder="All"
                              items={["LOW", "NORMAL", "URGENT", "HIGH"]}
                              onValueChanged={(e) => setFilterStatus(e.value)}
                         />

                         <SelectBox
                              label="Admitted"
                              placeholder="All"
                              items={["Yes", "No"]}
                              onValueChanged={(e) => setFilterAdmitted(e.value)}
                         />

                         <TextBox
                              label="Treatment Start (From)"
                              value={startDate}
                              onValueChanged={(e) => setStartDate(e.value)}
                         />

                         <TextBox
                              label="Treatment Start (To)"
                              value={endDate}
                              onValueChanged={(e) => setEndDate(e.value)}
                         />
                    </div>
               </Popup>

               {/* ----------- CARD GRID ----------- */}
               <div className="datasets-grid">
                    {filteredPatients.map((p) => (
                         <CardContainer key={p.id}>
                              <Checkbox
                                   checked={selected.includes(p.id)}
                                   onChange={() => toggleSelect(p.id)}
                                   sx={{
                                        position: "absolute",
                                        top: "10px",
                                        left: "10px",
                                        zIndex: 5,
                                        color: "var(--dx-theme-secondary-color)",
                                        "&.Mui-checked": {
                                             color: "var(--dx-theme-accent-color)",
                                        },
                                   }}
                              />

                              <PreviewImg src={p.preview} alt={p.name} />

                              <h3 style={{ margin: 0 }}>{p.name}</h3>
                              <StatusBadge status={p.status}>{p.status}</StatusBadge>

                              <p style={{ margin: 0, opacity: 0.85 }}>
                                   Age: {p.age} | Gender: {p.gender}
                              </p>

                              <p style={{ margin: 0, opacity: 0.85 }}>
                                   Treatment Start: {p.treatmentStart}
                              </p>

                              <p style={{ margin: 0, opacity: 0.85 }}>
                                   {p.admitted ? p.room : "Not admitted"}
                              </p>
                         </CardContainer>
                    ))}
               </div>
          </div>
     );
};

export default Patients;
