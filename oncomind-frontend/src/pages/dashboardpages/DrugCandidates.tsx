"use client";

import React, { useState, useEffect } from "react"; // Added useEffect
import { Button } from "devextreme-react/button";
import { TextBox } from "devextreme-react/text-box";
import { SelectBox } from "devextreme-react/select-box";
import { Popup } from "devextreme-react/popup";
import CheckBox from "devextreme-react/check-box";
import TextArea from "devextreme-react/text-area";
import FileUploader from 'devextreme-react/file-uploader';
import notify from 'devextreme/ui/notify'; // Added for notifications

import "../../css/DataSets.css";

// 👇 FIX: REMOVED BROKEN IMAGE IMPORTS
// We will use a placeholder for now, or just let the database provide images.

export default function DrugCandidates() {
     // Start with empty array, data comes from API
     const [datasets, setDatasets] = useState<any[]>([]);
     const [selected, setSelected] = useState<number[]>([]);
     const [search, setSearch] = useState("");
     const [loading, setLoading] = useState(false); // Added loading state

     const [filterPopup, setFilterPopup] = useState(false);
     const [filterType, setFilterType] = useState<string | null>(null);
     const [filterSize, setFilterSize] = useState<string | null>(null);

     const [isPopupVisible, setPopupVisible] = useState(false);
     const [newAnalysis, setNewAnalysis] = useState({
          type: "Blood Test",
          summary: ""
     });

     // 1. Load Data on Mount
     useEffect(() => {
          loadCandidates();
     }, []);

     const loadCandidates = async () => {
          try {
               const res = await fetch("http://localhost:5001/api/DrugCandidate");
               const data = await res.json();
               // Map backend data to frontend structure if necessary, 
               // assuming backend sends { id, smiles, qedScore, mwScore, moleculeImage, createdAt }
               const formattedData = data.map((d: any) => ({
                    id: d.id,
                    name: "Drug Candidate", // You can customize this
                    smiles: d.smiles,
                    QED: d.qedScore,
                    MW: d.mwScore,
                    downloaded: new Date(d.createdAt).toLocaleDateString(),
                    preview: d.moleculeImage // Base64 string from DB
               }));
               setDatasets(formattedData);
          } catch (err) {
               console.error("Failed to load candidates", err);
          }
     };

     // 2. The AI Generation Handler
     const handleGenerateAI = async () => {
          setLoading(true);
          notify("AI is dreaming up a new molecule...", "info", 3000);

          try {
               const res = await fetch("http://localhost:5001/api/DrugCandidate/generate", {
                    method: "POST"
               });

               if (!res.ok) throw new Error("Generation failed");

               const newMolecule = await res.json();

               // Format the new molecule to match our grid structure
               const formattedMolecule = {
                    id: newMolecule.id,
                    name: "New AI Candidate",
                    smiles: newMolecule.smiles,
                    QED: newMolecule.qedScore,
                    MW: newMolecule.mwScore,
                    downloaded: new Date().toLocaleDateString(),
                    preview: newMolecule.moleculeImage
               };

               setDatasets(prev => [formattedMolecule, ...prev]);
               notify("New Drug Candidate Discovered!", "success", 3000);

          } catch (error) {
               console.error(error);
               notify("AI Generation failed. Check backend logs.", "error", 3000);
          } finally {
               setLoading(false);
          }
     };

     const toggleSelection = (id: number) => {
          setSelected((prev) =>
               prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
          );
     };

     const handleAdd = () => {
          setPopupVisible(true);
     };

     const handleDelete = () => {
          setDatasets(datasets.filter((d) => !selected.includes(d.id)));
          setSelected([]);
     };

     const filtered = datasets.filter((ds) => {
          const matchSearch =
               search.trim().length === 0 ||
               ds.name.toLowerCase().includes(search.toLowerCase());

          const matchType = !filterType || ds.name.toLowerCase() === filterType.toLowerCase();
          const matchSize = !filterSize || ds.downloaded.includes(filterSize);

          return matchSearch && matchType && matchSize;
     });

     const fileUploaderLabel = { 'aria-label': 'Select Model' };

     return (
          <div className="datasets-wrapper">
               <h1 className="page-title">Drug Candidates</h1>

               <div className="datasets-actions dx-card">
                    {/* 👇 AI GENERATE BUTTON */}
                    <Button
                         text={loading ? "Generating..." : "Generate AI Candidate"}
                         icon={loading ? "spinup" : "box"}
                         type="default"
                         onClick={handleGenerateAI}
                         disabled={loading}
                    />

                    <Button text="Add Manually" icon="add" stylingMode="outlined" onClick={handleAdd} />

                    <Button text="Delete" icon="trash" type="danger" disabled={selected.length === 0} onClick={handleDelete} />

                    <div style={{ flex: 1 }} />

                    <TextBox placeholder="Search molecule..." value={search} onValueChanged={(e) => setSearch(e.value)} mode="search" width={220} />
                    <Button text="Filters" icon="filter" stylingMode="contained" onClick={() => setFilterPopup(true)} />
               </div>

               {/* ... (Keep your Popups same as before) ... */}

               {/* ADD NEW POPUP */}
               <Popup
                    visible={isPopupVisible}
                    onHiding={() => setPopupVisible(false)}
                    dragEnabled={false}
                    showTitle={true}
                    title="Add New Medical Analysis"
                    width={500}
                    height={400}
                    showCloseButton={true}
               >
                    {/* ... your popup content ... */}
               </Popup>

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

                              {/* Preview Image */}
                              <img src={ds.preview} className="dataset-preview" alt="molecule" />

                              <div className="dataset-details">
                                   <div><b>Smiles:</b> {ds.smiles ? ds.smiles.substring(0, 15) + "..." : "N/A"}</div>
                                   <div><b>QED:</b> {ds.QED}</div>
                                   <div><b>MW:</b> {ds.MW}</div>
                                   <div><b>Date:</b> {ds.downloaded}</div>
                              </div>
                         </div>
                    ))}
               </div>
          </div>
     );
}