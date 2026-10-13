import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, FileText, HeartPulse, MapPin, Plus, Save, UserRound, Stethoscope } from "lucide-react";
import { patientService } from "../../services/patientService";
import { Button, Card, Dialog, Empty, Field, MediaImage, Pill, Select, StatusPill, Textarea, statusTone } from "../../dashboard/ui";
import notify from "../../dashboard/ui/notify";

/* ------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------ */
const PatientProfile: React.FC = () => {
     const { id } = useParams(); // 1. Get ID from URL (e.g., /admin/patients/659b...)
     const [patient, setPatient] = useState<any>(null);
     const [loading, setLoading] = useState(true);
     const [isPopupVisible, setPopupVisible] = useState(false);
     const [newAnalysis, setNewAnalysis] = useState({
          type: "Blood Test",
          summary: ""
     });

     // 2. Handle Save
     const handleSaveAnalysis = async () => {
          try {
               const doctorId = localStorage.getItem("doctorId");
               if (!doctorId || !patient) return;

               await patientService.addAnalysis({
                    patientId: patient.id,
                    doctorId: doctorId,
                    analysisType: newAnalysis.type,
                    summary: newAnalysis.summary
               });

               notify("Analysis added successfully!", "success", 2000);
               setPopupVisible(false);

               // Refresh Data to see new item
               if (id) fetchPatientData(id);

          } catch (error) {
               console.error(error);
               notify("Error saving analysis", "error", 2000);
          }
     };
     useEffect(() => {
          if (id) fetchPatientData(id);
     }, [id]);

     const fetchPatientData = async (patientId: string) => {
          setLoading(true);
          try {
               const p = await patientService.getById(patientId);

               if (p) {
                    setPatient({
                         id: p.id,
                         name: `${p.firstName} ${p.lastName}`,
                         age: p.age,
                         gender: p.gender,
                         status: p.emergencyStatus || "Stable",
                         room: p.admissionLocation || "Not Assigned",
                         admittedDate: p.treatmentStartAt ? new Date(p.treatmentStartAt).toLocaleDateString() : "N/A",
                         avatarUrl: p.profilePicture || "https://via.placeholder.com/150",
                         coverUrl: "https://images.unsplash.com/photo-1732046801426-f32529468176?q=80&w=1632",

                         examinations: p.examinations ? p.examinations.map((exam: any) => ({
                              id: exam.id,

                              // Backend sends 'date', not 'timestamp'
                              date: new Date(exam.date).toLocaleDateString(),

                              // Backend sends 'type', not 'analysisType'
                              type: exam.type || "General Analysis",

                              // Backend sends 'doctor' (ID or Name), use it!
                              doctor: exam.doctor || "System",

                              // Backend sends a clean 'summary' string now, not 'resultData' object
                              summary: exam.summary || "No details provided.",

                              imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300"
                         })) : []
                    });
               }
          } catch (error) {
               console.error("Failed to load patient", error);
          }
          setLoading(false);
     };

     if (loading)
          return (
               <div className="om-page">
                    <div className="om-skeleton" style={{ minHeight: 320, borderRadius: "var(--om-r-xl)" }} />
                    <div className="om-split">
                         <div className="om-skeleton" />
                         <div className="om-skeleton" />
                    </div>
               </div>
          );
     if (!patient)
          return (
               <Card>
                    <Empty icon={<UserRound size={28} />} title="Patient not found">
                         <Link to="/admin/patients" className="om-btn om-btn--sm" style={{ marginTop: 8, textDecoration: "none" }}>
                              <ArrowLeft size={14} /> Back to patients
                         </Link>
                    </Empty>
               </Card>
          );

     const p = patient;
     return (
          <div className="om-page">
               {/* --- HERO --- */}
               <section
                    style={{
                         position: "relative",
                         minHeight: 320,
                         borderRadius: "var(--om-r-xl)",
                         overflow: "hidden",
                         display: "flex",
                         alignItems: "flex-end",
                         backgroundImage: `linear-gradient(180deg, rgba(10,10,14,0.05) 0%, rgba(10,10,14,0.78) 100%), url(${p.coverUrl})`,
                         backgroundSize: "cover",
                         backgroundPosition: "center 40%",
                         color: "#fff",
                    }}
               >
                    <Link
                         to="/admin/patients"
                         className="om-btn om-btn--glass om-btn--sm"
                         style={{ position: "absolute", top: 16, left: 16, textDecoration: "none" }}
                    >
                         <ArrowLeft size={14} /> Patients
                    </Link>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 24, padding: 28, flexWrap: "wrap", width: "100%" }}>
                         <div
                              style={{
                                   width: 132,
                                   height: 132,
                                   borderRadius: 36,
                                   overflow: "hidden",
                                   flex: "none",
                                   boxShadow: "0 0 0 4px rgba(255,255,255,0.18), 0 20px 40px rgba(0,0,0,0.35)",
                              }}
                         >
                              <MediaImage src={p.avatarUrl} alt={p.name} />
                         </div>
                         <div style={{ flex: 1, minWidth: 240 }}>
                              <h1 style={{ margin: 0, fontSize: "clamp(34px, 5vw, 60px)", fontWeight: 500, letterSpacing: "-0.05em", lineHeight: 1 }}>{p.name}</h1>
                              <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                                   <span className="om-pill" style={{ background: statusTone(p.status), color: "#fff", boxShadow: "none" }}>
                                        <HeartPulse size={13} /> {p.status}
                                   </span>
                                   <Pill tone="glass"><MapPin size={13} /> {p.room}</Pill>
                                   <Pill tone="glass">{p.age} - {p.gender}</Pill>
                              </div>
                         </div>
                    </div>
               </section>

               {/* --- STATS --- */}
               <div className="om-split om-split--aside">
                    <Card aura="violet" className="om-stat">
                         <span className="om-stat-label" style={{ letterSpacing: "0.08em", fontSize: 11 }}>TOPLAM KAYIT</span>
                         <div className="om-dot-number om-dot-number--lg">{p.examinations.length}</div>
                         <span className="om-stat-label">Sistem Kayıtlı Muayene Sayısı</span>
                    </Card>
                    <Card style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
                         <span className="om-stat-label" style={{ letterSpacing: "0.08em", fontSize: 11 }}>SİSTEM RAPORU</span>
                         <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: "var(--om-text-2)", letterSpacing: "-0.01em" }}>
                              <span style={{ color: "var(--om-text)", fontWeight: 600 }}>Hasta Notu:</span> Hastanın hayati fonksiyonları stabilize edildi.
                              {p.room} numaralı ünitede aktif gözetim altında tutuluyor. Nörolojik tepkiler normal aralıkta.
                         </p>
                         <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              <Pill><CalendarDays size={12} /> {p.admittedDate}</Pill>
                              <StatusPill status={p.status} />
                         </div>
                    </Card>
               </div>

               {/* --- TIMELINE --- */}
               <div className="om-page-head" style={{ alignItems: "center" }}>
                    <div>
                         <h2 className="om-section-title">MUAYENE GEÇMİŞİ</h2>
                    </div>
                    <Button variant="primary" icon={<Plus size={16} />} onClick={() => setPopupVisible(true)}>
                         New Analysis
                    </Button>
               </div>

               {p.examinations.length === 0 ? (
                    <Card>
                         <Empty icon={<FileText size={28} />} title="No examinations yet" />
                    </Card>
               ) : (
                    <div className="om-stack" style={{ gap: 10 }}>
                         {p.examinations.map((exam: any) => (
                              <Card key={exam.id} className="om-exam">
                                   <div className="om-media">
                                        <img src={exam.imageUrl} alt="" loading="lazy" />
                                   </div>
                                   <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 8, padding: "6px 8px 6px 0", minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                             <Pill tone="lime"><CalendarDays size={12} /> {exam.date}</Pill>
                                             <Pill><Stethoscope size={12} /> {exam.doctor}</Pill>
                                        </div>
                                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 550, letterSpacing: "-0.02em" }}>{exam.type}</h3>
                                        <p style={{ margin: 0, color: "var(--om-text-2)", lineHeight: 1.6, fontSize: 14 }}>{exam.summary}</p>
                                   </div>
                              </Card>
                         ))}
                    </div>
               )}

               <Dialog
                    open={isPopupVisible}
                    onOpenChange={setPopupVisible}
                    title="Add New Medical Analysis"
                    width={500}
                    footer={
                         <>
                              <Button onClick={() => setPopupVisible(false)}>Cancel</Button>
                              <Button variant="primary" icon={<Save size={16} />} onClick={handleSaveAnalysis}>
                                   Save Record
                              </Button>
                         </>
                    }
               >
                    <div className="om-stack">
                         <Field label="Analysis Type">
                              <Select
                                   items={["Blood Test", "MRI Scan", "CT Scan", "X-Ray", "Genetic Sequencing", "Biopsy"]}
                                   value={newAnalysis.type}
                                   onChange={(v) => setNewAnalysis({ ...newAnalysis, type: v ?? newAnalysis.type })}
                              />
                         </Field>
                         <Field label="Clinical Summary" htmlFor="na-summary">
                              <Textarea
                                   id="na-summary"
                                   rows={5}
                                   placeholder="Enter findings..."
                                   value={newAnalysis.summary}
                                   onChange={(e) => setNewAnalysis({ ...newAnalysis, summary: e.target.value })}
                              />
                         </Field>
                    </div>
               </Dialog>
          </div>
     );
};

export default PatientProfile;
