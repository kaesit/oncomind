"use client";

import React, { useState } from "react";
import { Button } from "devextreme-react/button";
import { TextBox } from "devextreme-react/text-box";
import { SelectBox } from "devextreme-react/select-box";
import { Popup } from "devextreme-react/popup";
import CheckBox from "devextreme-react/check-box";

import "../../css/DataSets.css"; // Optional stylesheet for layout

// Example datasets (mock)
const initialDatasets = [
     {
          id: 1,
          name: "Roboflow Cancer Cells",
          images: 1240,
          size: "420MB",
          type: "PNG",
          downloaded: "2025-11-20",
          preview: "https://source.roboflow.com/0vK23Q33iDWrmXs6GgKXuWbkyOe2/JSHMyLCw6KruRqiv9HzU/annotation-c_c.png?v=2024-09-27T20:30:20.500Z"
     },
     {
          id: 2,
          name: "Kaggle Histopathology",
          images: 5432,
          size: "1.2GB",
          type: "JPG",
          downloaded: "2025-12-01",
          preview: "https://upload.wikimedia.org/wikipedia/commons/6/6b/MI_with_contraction_bands_very_high_mag.jpg"
     }
];

export default function DataSets() {
     const [datasets, setDatasets] = useState(initialDatasets);
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

          const matchType = !filterType || ds.type.toLowerCase() === filterType.toLowerCase();

          const matchSize = !filterSize || ds.size.includes(filterSize);

          return matchSearch && matchType && matchSize;
     });

     return (
          <div className="datasets-wrapper">
               {/* TITLE */}
               <h1 className="page-title">Datasets</h1>

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

                    <Button
                         text="Train"
                         icon="runner"
                         type="success"
                         disabled={selected.length === 0}
                         onClick={handleTrain}
                    />

                    {/* Spacer */}
                    <div style={{ flex: 1 }} />

                    <TextBox
                         placeholder="Search dataset..."
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
                                   <div><b>Images:</b> {ds.images}</div>
                                   <div><b>Size:</b> {ds.size}</div>
                                   <div><b>Type:</b> {ds.type}</div>
                                   <div><b>Downloaded:</b> {ds.downloaded}</div>
                              </div>
                         </div>
                    ))}
               </div>
          </div>
     );
}
