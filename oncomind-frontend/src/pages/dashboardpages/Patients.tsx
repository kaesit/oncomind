import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { ArrowUpRight, ClipboardPlus, Filter, MapPin, Plus, UserRound, Users } from "lucide-react";
import { patientService, PatientDto } from "../../services/patientService";
import { Button, Card, Checkbox, Dialog, Empty, Field, Input, MediaImage, PageHeader, Pill, SearchInput, Select, StatusPill } from "../../dashboard/ui";
import notify from "../../dashboard/ui/notify";

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
     const [filterGender, setFilterGender] = useState<string | null>(null);
     const [filterStatus, setFilterStatus] = useState<string | null>(null);
     const [filterAdmitted, setFilterAdmitted] = useState<string | null>(null);

     // 2. EFFECT: Fetch data from C# API on load
     useEffect(() => {
          const token = localStorage.getItem("doctorId");
          if (!token) {
               navigate("/login"); // Kick them out if not logged in
               return;
          }
          loadData();
     }, []);

     const loadData = async () => {
          setLoading(true);

          // 1. Check who is logged in
          const currentDoctorId = localStorage.getItem("doctorId");

          let rawData: PatientDto[] = [];

          if (currentDoctorId) {
               // 2. Fetch ONLY this doctor's patients
               console.log("Fetching patients for Doctor ID:", currentDoctorId);
               rawData = await patientService.getByDoctor(currentDoctorId);
          } else {
               // Fallback: If no one is logged in, maybe redirect to login?
               // For testing now, we can still fetch all or return empty
               console.warn("No doctor logged in. Fetching all patients (Debug mode).");
               rawData = await patientService.getAll();
          }

          // 3. Map the data
          const mappedData = rawData.map((p: PatientDto) => {
               let genderDisplay = "Other";
               const g = String(p.gender);
               if (g === "0" || g === "Male") genderDisplay = "Male";
               else if (g === "1" || g === "Female") genderDisplay = "Female";
               else genderDisplay = g;

               return {
                    id: p.id,
                    name: `${p.firstName} ${p.lastName}`,
                    age: p.age,
                    gender: genderDisplay,
                    treatmentStart: p.treatmentStartAt ? new Date(p.treatmentStartAt).toLocaleDateString() : "N/A",
                    status: p.emergencyStatus || "Stable",
                    room: p.admissionLocation || "Not Assigned",
                    admitted: p.isAdmitted,
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
          profilePicture: "",
          admissionLocation: ""
     });
     const [touched, setTouched] = useState(false);
     const set = (k: keyof typeof newPatient, v: any) => setNewPatient((p) => ({ ...p, [k]: v }));

     // validation rules carried over from the old form
     const errors = {
          firstName: !newPatient.firstName.trim() ? "First Name is required" : null,
          lastName: !newPatient.lastName.trim() ? "Last Name is required" : null,
          age: newPatient.age < 0 || newPatient.age > 120 || Number.isNaN(newPatient.age) ? "Age must be valid" : null,
     };
     const hasErrors = Object.values(errors).some(Boolean);

     // 2. Handle the "Save" Button click
     const handleSavePatient = async () => {
          setTouched(true);
          if (hasErrors) return;
          try {
               // Get logged in Doctor ID (from our Login step earlier)
               const currentDoctorId = localStorage.getItem("doctorId");

               // Safety Check: Ensure they are actually logged in
               if (!currentDoctorId) {
                    notify("Session expired. Please log in again.", "error", 3000);
                    return;
               }

               await patientService.create({
                    ...newPatient,
                    assignedDoctorId: currentDoctorId
               });

               notify("Patient added successfully!", "success", 2000);
               setAddPopupVisible(false); // Close popup
               setTouched(false);
               loadData(); // Refresh the list automatically!
          } catch (error) {
               console.error(error);
               notify("Error adding patient", "error", 2000);
          }
     };

     const activeFilters = [filterGender, filterStatus, filterAdmitted].filter(Boolean).length;

     return (
          <div className="om-page">
               <PageHeader title="Patients" sub={loading ? "Loading…" : `${filteredPatients.length} of ${patients.length} patients`}>
                    <SearchInput placeholder="Search patient..." value={search} onChange={setSearch} width={260} />
                    <Button icon={<Filter size={16} />} onClick={() => setFilterPopup(true)}>
                         Filter{activeFilters ? ` · ${activeFilters}` : ""}
                    </Button>
                    <Button variant="primary" icon={<Plus size={16} />} onClick={() => setAddPopupVisible(true)}>
                         Add New
                    </Button>
               </PageHeader>

               <Dialog
                    open={addPopupVisible}
                    onOpenChange={setAddPopupVisible}
                    title="Register New Patient"
                    description="The patient is assigned to you automatically."
                    width={560}
                    footer={
                         <>
                              <Button onClick={() => setAddPopupVisible(false)}>Cancel</Button>
                              <Button variant="primary" onClick={handleSavePatient}>Save Patient</Button>
                         </>
                    }
               >
                    <div className="om-form-grid">
                         <Field label="First Name" error={touched ? errors.firstName : null} htmlFor="np-first">
                              <Input id="np-first" value={newPatient.firstName} invalid={touched && !!errors.firstName} onChange={(e) => set("firstName", e.target.value)} />
                         </Field>
                         <Field label="Last Name" error={touched ? errors.lastName : null} htmlFor="np-last">
                              <Input id="np-last" value={newPatient.lastName} invalid={touched && !!errors.lastName} onChange={(e) => set("lastName", e.target.value)} />
                         </Field>
                         <Field label="Age" error={touched ? errors.age : null} htmlFor="np-age">
                              <Input id="np-age" type="number" min={0} max={120} value={newPatient.age} invalid={touched && !!errors.age} onChange={(e) => set("age", e.target.valueAsNumber)} />
                         </Field>
                         <Field label="Gender">
                              <Select items={["Male", "Female"]} value={newPatient.gender} onChange={(v) => set("gender", v)} />
                         </Field>
                         <Field label="Initial Status">
                              <Select items={["Stable", "Normal", "High", "Urgent"]} value={newPatient.emergencyStatus} onChange={(v) => set("emergencyStatus", v)} />
                         </Field>
                         <Field label="Room / Bed (Optional)" htmlFor="np-room">
                              <Input id="np-room" value={newPatient.admissionLocation} onChange={(e) => set("admissionLocation", e.target.value)} />
                         </Field>
                         <Field label="Picture" hint="Image URL" full htmlFor="np-pic">
                              <Input id="np-pic" value={newPatient.profilePicture} placeholder="https://…" onChange={(e) => set("profilePicture", e.target.value)} />
                         </Field>
                    </div>
               </Dialog>

               <Dialog
                    open={filterPopup}
                    onOpenChange={setFilterPopup}
                    title="Filter Patients"
                    width={400}
                    footer={
                         <>
                              <Button
                                   variant="ghost"
                                   onClick={() => {
                                        setFilterGender(null);
                                        setFilterStatus(null);
                                        setFilterAdmitted(null);
                                   }}
                              >
                                   Reset
                              </Button>
                              <Button variant="primary" onClick={() => setFilterPopup(false)}>Done</Button>
                         </>
                    }
               >
                    <div className="om-stack">
                         <Field label="Gender">
                              <Select placeholder="All" clearable items={["Male", "Female"]} value={filterGender} onChange={setFilterGender} />
                         </Field>
                         <Field label="Status">
                              <Select placeholder="All" clearable items={["Stable", "Normal", "High", "Urgent"]} value={filterStatus} onChange={setFilterStatus} />
                         </Field>
                         <Field label="Admitted">
                              <Select placeholder="All" clearable items={["Yes", "No"]} value={filterAdmitted} onChange={setFilterAdmitted} />
                         </Field>
                    </div>
               </Dialog>

               {loading ? (
                    <div className="om-grid">
                         {Array.from({ length: 6 }, (_, i) => (
                              <div key={i} className="om-skeleton" style={{ minHeight: 320 }} />
                         ))}
                    </div>
               ) : filteredPatients.length === 0 ? (
                    <Card>
                         <Empty icon={<Users size={28} />} title={patients.length ? "No patients match" : "No patients yet"}>
                              {patients.length ? "Try a different search or reset the filters." : "Register your first patient with Add New."}
                         </Empty>
                    </Card>
               ) : (
                    <div className="om-grid">
                         {filteredPatients.map((p) => (
                              <Card key={p.id} selected={selected.includes(p.id)} style={{ padding: 10 }}>
                                   <div className="om-media">
                                        <MediaImage src={p.preview} alt={p.name} />
                                        <div className="om-media-overlay">
                                             <Checkbox glass ariaLabel={`Select ${p.name}`} checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} />
                                             <StatusPill solid status={p.status} />
                                        </div>
                                   </div>
                                   <div className="om-item-body" style={{ padding: "12px 6px 4px" }}>
                                        <h3 className="om-item-title">{p.name}</h3>
                                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                             <Pill><UserRound size={12} /> {p.age} · {p.gender}</Pill>
                                             <Pill><MapPin size={12} /> {p.admitted ? p.room : "Not admitted"}</Pill>
                                        </div>
                                        <div className="om-item-actions">
                                             <Button size="sm" variant="primary" icon={<ArrowUpRight size={15} />} onClick={() => navigate(`/admin/patients/${p.id}`)}>
                                                  Go Page
                                             </Button>
                                             <Button size="sm" icon={<ClipboardPlus size={15} />} onClick={() => navigate(`/admin/patients/${p.id}`)}>
                                                  Register for T.E.
                                             </Button>
                                        </div>
                                   </div>
                              </Card>
                         ))}
                    </div>
               )}
          </div>
     );
};

export default Patients;
