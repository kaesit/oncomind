import React, { useState } from "react";
import { Database, Filter, Play, Plus, Trash2 } from "lucide-react";
import { Button, Card, Checkbox, Dialog, Empty, Field, MediaImage, PageHeader, Pill, SearchInput, Select } from "../../dashboard/ui";

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
     const [filterType, setFilterType] = useState<string | null>(null);
     const [filterSize, setFilterSize] = useState<string | null>(null);

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
          <div className="om-page">
               <PageHeader title="Datasets" sub={`${datasets.length} datasets · ${selected.length} selected`}>
                    <SearchInput placeholder="Search dataset..." value={search} onChange={setSearch} width={220} />
                    <Button icon={<Filter size={16} />} onClick={() => setFilterPopup(true)}>
                         Filters
                    </Button>
               </PageHeader>

               {/* TOP ACTION BAR */}
               <div className="om-toolbar">
                    <Button variant="primary" icon={<Plus size={16} />} onClick={handleAdd}>
                         Add New
                    </Button>
                    <Button variant="lime" icon={<Play size={16} />} disabled={selected.length === 0} onClick={handleTrain}>
                         Train
                    </Button>
                    <Button variant="danger" icon={<Trash2 size={16} />} disabled={selected.length === 0} onClick={handleDelete}>
                         Delete
                    </Button>
               </div>

               {/* FILTER POPUP */}
               <Dialog
                    open={filterPopup}
                    onOpenChange={setFilterPopup}
                    title="Filter Datasets"
                    width={380}
                    footer={<Button variant="primary" onClick={() => setFilterPopup(false)}>Done</Button>}
               >
                    <div className="om-stack">
                         <Field label="Image Type">
                              <Select placeholder="Select Type" clearable items={["PNG", "JPG", "TIFF"]} value={filterType} onChange={setFilterType} />
                         </Field>
                         <Field label="Dataset Size">
                              <Select placeholder="Select Size" clearable items={["<100MB", "100-500MB", ">500MB", "1GB+"]} value={filterSize} onChange={setFilterSize} />
                         </Field>
                    </div>
               </Dialog>

               {/* DATASET GRID */}
               {filtered.length === 0 ? (
                    <Card>
                         <Empty icon={<Database size={28} />} title="No datasets match" />
                    </Card>
               ) : (
                    <div className="om-grid">
                         {filtered.map((ds) => (
                              <Card key={ds.id} selected={selected.includes(ds.id)} style={{ padding: 10 }}>
                                   <div className="om-media">
                                        <MediaImage src={ds.preview} alt={ds.name} />
                                        <div className="om-media-overlay">
                                             <Checkbox glass ariaLabel={`Select ${ds.name}`} checked={selected.includes(ds.id)} onChange={() => toggleSelection(ds.id)} />
                                             <Pill tone="glass">{ds.type}</Pill>
                                        </div>
                                   </div>
                                   <div className="om-item-body" style={{ padding: "12px 4px 4px" }}>
                                        <h3 className="om-item-title">{ds.name}</h3>
                                        <dl className="om-kv">
                                             <div><dt>Images</dt><dd>{ds.images}</dd></div>
                                             <div><dt>Size</dt><dd>{ds.size}</dd></div>
                                             <div><dt>Type</dt><dd>{ds.type}</dd></div>
                                             <div><dt>Downloaded</dt><dd>{ds.downloaded}</dd></div>
                                        </dl>
                                   </div>
                              </Card>
                         ))}
                    </div>
               )}
          </div>
     );
}
