"use client";
import React, { useState } from "react";
import { Button } from "devextreme-react/button";
import { TextBox } from "devextreme-react/text-box";
import { SelectBox } from "devextreme-react/select-box";
import { Popup } from "devextreme-react/popup";
import CheckBox from "devextreme-react/check-box";
import "../../css/Models.css";

const initialDatasets = [
     {
          id: 1,
          name: "Heathy - Unhealthy",
          epoch:100,
          batch: 8,
          mosaic: 0.0,
          flipud:0.0,
          fliplr:0.5,
          size: "14MB",
          type: "PyTorch",
          trained: "2025-11-20",
          preview: "https://b2633864.smushcdn.com/2633864/wp-content/uploads/2021/05/what_is_pytorch_logo.png?lossy=2&strip=1&webp=1"
     },
     {
          id: 2,
          name: "Smile Notation Generator",
          epoch:60,
          batch: 128,
          mosaic: 0.0,
          flipud:0.0,
          fliplr:0.5,
          size: "14MB",
          type: "GNN",
          trained: "2025-12-01",
          preview: "https://plus.unsplash.com/premium_photo-1681487118711-2c8e629d4313?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG5hfGVufDB8fDB8fHww"
     }
];

export default function Models() {
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
          <div className="models-wrapper">
               {/* TITLE */}
               <h1 className="page-title">Models</h1>

               {/* TOP ACTION BAR */}
               <div className="models-actions dx-card">
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
                    title="Filter Models"
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
               <div className="models-grid">
                    {filtered.map((ds) => (
                         <div className="model-card dx-card" key={ds.id}>
                              <div className="model-card-header">
                                   <CheckBox
                                        value={selected.includes(ds.id)}
                                        onValueChanged={() => toggleSelection(ds.id)}
                                   />
                                   <h3 className="model-name">{ds.name}</h3>
                              </div>

                              <img src={ds.preview} className="model-preview" />

                              <div className="model-details">
                                   <div><b>Name:</b> {ds.name}</div>
                                   <div><b>Size:</b> {ds.size}</div>
                                   <div><b>Type:</b> {ds.type}</div>
                                   <div><b>Trained:</b> {ds.trained}</div>
                              </div>
                         </div>
                    ))}
               </div>
          </div>
     );
}
