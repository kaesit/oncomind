import React, { useState, useEffect } from "react";
import { Filter, FlaskConical, Plus, ShieldAlert, Sparkles, Trash2 } from "lucide-react";
import { Button, Card, Checkbox, Dialog, Empty, Field, Input, PageHeader, Pill, SearchInput } from "../../dashboard/ui";
import notify from "../../dashboard/ui/notify";

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
     const [newCandidates, setNewCandidates] = useState({
          id: 12345,
          name: "New AI Candidate",
          smiles: "CC(C)CC(=O)Nc1n...",
          qed: 0.8,
          mw: 361,
          date_of_generation: "",
          downloaded: new Date().toLocaleDateString(),
          preview: ""

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

     const handleAdd = async () => {
          setPopupVisible(true);
          try {

               const res = await fetch("", {
                    method: "POST"
               });
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

               /*setNewCandidates([...formattedMolecule]);*/ // Will be fixed soon

               notify("Candidate Molecule added succesfully", "success", 2000);
               setPopupVisible(false);
               loadCandidates();
          }catch(error){
               console.error(error);
               notify("Error adding candidate molecule", "error", 2000);
          }
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

     const setField = (k: keyof typeof newCandidates, v: any) => setNewCandidates((c) => ({ ...c, [k]: v }));
     // the old form's range rules, shown inline
     const qedError = newCandidates.qed < 0.5 || newCandidates.qed > 1 ? "QED must be valid" : null;
     const mwError = newCandidates.mw < 0 || newCandidates.mw > 500 ? "MW must be valid" : null;

     return (
          <div className="om-page">
               <PageHeader title="Drug Candidates" sub={`${datasets.length} molecules generated · ${selected.length} selected`}>
                    <SearchInput placeholder="Search molecule..." value={search} onChange={setSearch} width={220} />
                    {/* NOTE: filterPopup has no dialog wired yet (unchanged from before) */}
                    <Button icon={<Filter size={16} />} onClick={() => setFilterPopup(true)}>
                         Filters
                    </Button>
               </PageHeader>

               <div className="om-toolbar">
                    {/* AI GENERATE BUTTON */}
                    <Button variant="primary" icon={<Sparkles size={16} />} loading={loading} onClick={handleGenerateAI}>
                         {loading ? "Generating..." : "Generate AI Candidate"}
                    </Button>
                    <Button icon={<Plus size={16} />} onClick={handleAdd}>
                         Add Manually
                    </Button>
                    <Button variant="danger" icon={<Trash2 size={16} />} disabled={selected.length === 0} onClick={handleDelete}>
                         Delete
                    </Button>
               </div>

               {/* ADD NEW POPUP */}
               <Dialog
                    open={isPopupVisible}
                    onOpenChange={setPopupVisible}
                    title="Add New Medical Analysis"
                    description="Manually Add"
                    width={500}
                    footer={
                         <>
                              <Button onClick={() => setPopupVisible(false)}>Cancel</Button>
                              <Button variant="primary" onClick={handleAdd}>Save Candidate</Button>
                         </>
                    }
               >
                    <div className="om-form-grid">
                         <Field label="Smiles" full htmlFor="dc-smiles">
                              <Input id="dc-smiles" className="om-mono" value={newCandidates.smiles} onChange={(e) => setField("smiles", e.target.value)} />
                         </Field>
                         <Field label="QED" error={qedError} htmlFor="dc-qed">
                              <Input id="dc-qed" type="number" step="0.01" min={0.5} max={1} value={newCandidates.qed} invalid={!!qedError} onChange={(e) => setField("qed", e.target.valueAsNumber)} />
                         </Field>
                         <Field label="MW" error={mwError} htmlFor="dc-mw">
                              <Input id="dc-mw" type="number" min={0} max={500} value={newCandidates.mw} invalid={!!mwError} onChange={(e) => setField("mw", e.target.valueAsNumber)} />
                         </Field>
                         <Field label="Date of generation" full htmlFor="dc-date">
                              <Input id="dc-date" type="date" value={newCandidates.date_of_generation} onChange={(e) => setField("date_of_generation", e.target.value)} />
                         </Field>
                    </div>
               </Dialog>

               {filtered.length === 0 ? (
                    <Card>
                         <Empty icon={<FlaskConical size={28} />} title="No candidates yet">
                              Generate one with the AI or add it manually.
                         </Empty>
                    </Card>
               ) : (
                    <div className="om-grid">
                         {filtered.map((ds) => (
                              <Card key={ds.id} selected={selected.includes(ds.id)} style={{ padding: 10 }}>
                                   <div className="om-media om-media--contain" style={{ aspectRatio: "4 / 3" }}>
                                        {ds.preview ? <img src={ds.preview} alt="molecule" loading="lazy" /> : <Empty icon={<FlaskConical size={24} />} title="No preview" />}
                                        <div className="om-media-overlay">
                                             <Checkbox ariaLabel="Select candidate" checked={selected.includes(ds.id)} onChange={() => toggleSelection(ds.id)} />
                                             <Pill tone="lime">QED {typeof ds.QED === "number" ? ds.QED.toFixed(2) : ds.QED}</Pill>
                                        </div>
                                   </div>
                                   <div className="om-item-body" style={{ padding: "12px 4px 4px" }}>
                                        <h3 className="om-item-title">{ds.name}</h3>
                                        <div className="om-mono" style={{ fontSize: 12, color: "var(--om-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={ds.smiles}>
                                             {ds.smiles ? ds.smiles.substring(0, 15) + "..." : "N/A"}
                                        </div>
                                        <dl className="om-kv">
                                             <div><dt>QED</dt><dd>{ds.QED}</dd></div>
                                             <div><dt>MW</dt><dd>{ds.MW}</dd></div>
                                             <div style={{ gridColumn: "1 / -1" }}><dt>Date</dt><dd>{ds.downloaded}</dd></div>
                                        </dl>
                                        <div className="om-item-actions">
                                             <Button size="sm" icon={<ShieldAlert size={15} />} onClick={() => setPopupVisible(true)}>
                                                  Toxicity
                                             </Button>
                                        </div>
                                   </div>
                              </Card>
                         ))}
                    </div>
               )}
          </div>
     );
}
