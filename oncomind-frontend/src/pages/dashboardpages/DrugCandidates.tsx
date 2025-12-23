"use client";

import React, { useState } from "react";
import { Button } from "devextreme-react/button";
import { TextBox } from "devextreme-react/text-box";
import { SelectBox } from "devextreme-react/select-box";
import { Popup } from "devextreme-react/popup";
import CheckBox from "devextreme-react/check-box";
import candidateMoleculeImage from "../../img/molecules/Cc1c(F)cncc1-c1ccc2nc(NC(=O)[C@@H]3C[C@@H]3F)c(Cl)n2c1.png";
import candidateMoleculeImage2 from "../../img/molecules/CC(C)n1nc(-c2ccc(C(N)=O)c(Cl)c2)c2c(N)ncnc21.png";
import candidateMoleculeImage3 from "../../img/molecules/CC(C)(C)C(=O)N1Cc2c(NC(=O)c3cc(F)cc(F)c3)n[nH]c2C1(C)C.png";

import "../../css/DataSets.css"; // Optional stylesheet for layout

// Example datasets (mock)
const initialMolecules = [
     {
          id: 1,
          name: "Drug Candidate",
          smiles: "Cc1c(F)cncc1-c1ccc2nc(NC(=O)[C@@H]3C[C@@H]3F)c(Cl)n2c1",
          downloaded: "2025-11-20",
          QED: 0.77,
          MW: 362.8,
          preview: candidateMoleculeImage
     },
     {
          id: 2,
          name: "Drug Candidate",
          smiles: "CC(C)n1nc(-c2ccc(C(N)=O)c(Cl)c2)c2c(N)ncnc21",
          downloaded: "2025-11-20",
          QED: 0.77,
          MW: 330.8,
          preview: candidateMoleculeImage2
     },
     {
          id: 3,
          name: "Drug Candidate",
          smiles: "CC(C)(C)C(=O)N1Cc2c(NC(=O)c3cc(F)cc(F)c3)n[nH]c2C1(C)C",
          downloaded: "2025-11-20",
          QED: 0.84,
          MW: 376.4,
          preview: candidateMoleculeImage3
     }
];

export default function DrugCandidates() {
     const [datasets, setDatasets] = useState(initialMolecules);
     const [selected, setSelected] = useState<number[]>([]);
     const [search, setSearch] = useState("");

     const [filterPopup, setFilterPopup] = useState(false);
     const [filterType, setFilterType] = useState(null);
     const [filterSize, setFilterSize] = useState(null);

     // -------------------------
     // Checkbox selection logic
     // -------------------------
     const toggleSelection = (id: number) => {
          setSelected((prev) =>
               prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
          );
     };

     // -------------------------
     // Button handlers (hook API)
     // -------------------------
     const handleAdd = () => {
          console.log("RUN PYTHON: Download Kaggle / Roboflow dataset");
     };

     const handleDelete = () => {
          console.log("DELETE DATASETS:", selected);
          setDatasets(datasets.filter((d) => !selected.includes(d.id)));
          setSelected([]);
     };

     const handleTrain = () => {
          console.log("TRAIN ON SELECTED DATASETS:", selected);
          console.log("Model selected, image type, etc...");
     };

     // -------------------------
     // Search filtering
     // -------------------------
     const filtered = datasets.filter((ds) => {
          const matchSearch =
               search.trim().length === 0 ||
               ds.name.toLowerCase().includes(search.toLowerCase());

          const matchType = !filterType || ds.name.toLowerCase() === filterType.toLowerCase();

          const matchSize = !filterSize || ds.downloaded.includes(filterSize);

          return matchSearch && matchType && matchSize;
     });

     return (
          <div className="datasets-wrapper">
               {/* TITLE */}
               <h1 className="page-title">Drug Candidates</h1>

               {/* TOP ACTION BAR */}
               <div className="datasets-actions dx-card">
                    <Button
                         text="Add New"
                         icon="add"
                         type="default"
                         onClick={handleAdd}
                    />

                    <Button
                         text="Delete"
                         icon="trash"
                         type="danger"
                         disabled={selected.length === 0}
                         onClick={handleDelete}
                    />
                    {/* Spacer */}
                    <div style={{ flex: 1 }} />

                    <TextBox
                         placeholder="Search molecule..."
                         value={search}
                         onValueChanged={(e) => setSearch(e.value)}
                         mode="search"
                         width={220}
                    />

                    <Button
                         text="Filters"
                         icon="filter"
                         stylingMode="contained"
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
                    title="Filter Molecules"
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

               {/* DATASET GRID */}
               <div className="datasets-grid">
                    {filtered.map((ds) => (
                         <div className="dataset-card dx-card" key={ds.id}>
                              <div className="dataset-card-header">
                                   <CheckBox
                                        value={selected.includes(ds.id)}
                                        onValueChanged={() => toggleSelection(ds.id)}
                                   />
                                   <h3 className="dataset-name">{ds.name}</h3>
                              </div>

                              <img src={ds.preview} className="dataset-preview" />

                              <div className="dataset-details">
                                   <div><b>Smiles:</b> {ds.smiles}</div>
                                   <div><b>QED:</b> {ds.QED}</div>
                                   <div><b>MW:</b> {ds.MW}</div>
                                   <div><b>Downloaded:</b> {ds.downloaded}</div>
                              </div>
                         </div>
                    ))}
               </div>
          </div>
     );
}
