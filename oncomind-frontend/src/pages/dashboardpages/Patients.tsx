import React, { useState, useMemo } from "react";
import TextBox from "devextreme-react/text-box";
import { Button } from "devextreme-react/button";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import { Popup } from "devextreme-react/popup";
import { SelectBox } from "devextreme-react/select-box";
import "../../css/DataSets.css";

/* ------------------------------------------------------
   MOCK PATIENT DATA (no data.ts extra file)
------------------------------------------------------ */
const mockPatients = [
     {
          id: 1,
          name: "Judie Carter",
          status: "LOW",
          room: "Block A - Room 12",
          admitted: true,
          preview:
               "https://images.unsplash.com/photo-1631201036602-c557ad26828e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGNhbmNlciUyMHBhdGllbnR8ZW58MHx8MHx8fDA%3D",
     },
     {
          id: 2,
          name: "Emily Watson",
          status: "URGENT",
          room: "Block C - Room 5",
          admitted: true,
          preview:
               "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=60",
     },
     {
          id: 3,
          name: "Jacob Myers",
          status: "NORMAL",
          admitted: false,
          preview:
               "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=60",
     },
     {
          id: 4,
          name: "Sarah Kim",
          status: "HIGH",
          admitted: true,
          room: "Block B - Room 8",
          preview:
               "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=500&q=60",
     },
];

/* ------------------------------------------------------
   MUI CARD STYLING WITH DX THEME VARIABLES
------------------------------------------------------ */
const CardContainer = styled("div")({
     position: "relative",   // <-- add this
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

/* Dynamic status color */
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
   MAIN PATIENT PAGE COMPONENT
------------------------------------------------------ */
const Patients: React.FC = () => {
     const [search, setSearch] = useState("");
     const [selected, setSelected] = useState<number[]>([]);

     const filteredPatients = useMemo(() => {
          const term = search.toLowerCase();
          return mockPatients.filter((p) =>
               p.name.toLowerCase().includes(term)
          );
     }, [search]);

     const toggleSelect = (id: number) => {
          setSelected((prev) =>
               prev.includes(id)
                    ? prev.filter((x) => x !== id)
                    : [...prev, id]
          );
     };

     const [filterPopup, setFilterPopup] = useState(false);
     const [filterType, setFilterType] = useState(null);
     const [filterSize, setFilterSize] = useState(null);
     return (
          <div className="datasets-wrapper">

               {/* ----------- TOP ACTIONS ----------- */}
               <div className="datasets-actions">

                    <Button
                         text="Add New"
                         icon="add"
                         type="default"
                    />
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
               {/* FILTER POPUP */}
               <Popup
                    visible={filterPopup}
                    dragEnabled={false}
                    hideOnOutsideClick={true}
                    onHiding={() => setFilterPopup(false)}
                    showCloseButton={true}
                    width={360}
                    height="auto"
                    title="Filter Datasets"
               >
                    <div className="filter-popup-body">
                         <SelectBox
                              label="Image Type"
                              placeholder="Select Type"
                              items={["PNG", "JPG", "TIFF"]}
                              onValueChanged={(e) => setFilterType(e.value)}
                         />

                         <SelectBox
                              label="Dataset Size"
                              placeholder="Select Size"
                              items={["<100MB", "100-500MB", ">500MB", "1GB+"]}
                              onValueChanged={(e) => setFilterSize(e.value)}
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
                                   {p.admitted ? p.room : "Not admitted"}
                              </p>
                         </CardContainer>
                    ))}
               </div>
          </div>
     );
};

export default Patients;
