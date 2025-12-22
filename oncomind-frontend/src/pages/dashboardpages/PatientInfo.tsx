import React from "react";
// DevExtreme Imports
import { Button } from "devextreme-react/button";

// Material UI Imports
import { styled, alpha } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid"; // Standart Grid Importu (v5 uyumlu)

// CSS Import
import "../../css/DataSets.css";

// Icons
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RoomIcon from "@mui/icons-material/Room";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

/* ------------------------------------------------------
   TYPES
------------------------------------------------------ */
interface Examination {
     id: number;
     date: string;
     summary: string;
     type: string;
     imageUrl: string;
     doctor: string;
}

interface PatientProfileData {
     id: number;
     name: string;
     age: number;
     gender: string;
     status: "LOW" | "NORMAL" | "URGENT" | "HIGH";
     room: string;
     admittedDate: string;
     avatarUrl: string;
     coverUrl: string;
     examinations: Examination[];
}

/* ------------------------------------------------------
   MOCK DATA
------------------------------------------------------ */
const mockPatientData: PatientProfileData = {
     id: 1,
     name: "Judie Carter",
     age: 6,
     gender: "Kadın",
     status: "LOW",
     room: "Blok A - 12",
     admittedDate: "12 Eylül 2024",
     // Daha "Retro" hissettiren bir avatar
     avatarUrl: "https://images.unsplash.com/photo-1631201036602-c557ad26828e?w=500",
     // Daha soyut/geometrik bir cover
     coverUrl: "https://images.unsplash.com/photo-1732046801426-f32529468176?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
     examinations: [
          {
               id: 101,
               date: "20.10.2024",
               type: "Kardiyoloji Kontrolü",
               doctor: "Dr. A. Yılmaz",
               summary: "Rutin EKG taraması yapıldı. Sinüs ritmi normal, ancak hafif taşikardi gözlendi. İlaç dozajı güncellendi.",
               imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&h=300&fit=crop",
          },
          {
               id: 102,
               date: "15.09.2024",
               type: "MR Görüntüleme",
               doctor: "Dr. S. Kaya",
               summary: "Lomber bölge MR çekimi. L4-L5 diskinde protrüzyon saptandı. Fizik tedavi önerildi.",
               imageUrl: "https://images.unsplash.com/photo-1666214276389-393fb7dbc75c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
          {
               id: 103,
               date: "02.08.2024",
               type: "Kan Tahlili",
               doctor: "Lab. Teknisyeni",
               summary: "Hemogram ve biyokimya paneli. Demir eksikliği anemisi bulguları mevcut. Ferritin seviyesi düşük.",
               imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=300&h=300&fit=crop",
          },
     ],
};

/* ------------------------------------------------------
   COLOR & STYLE UTILS
------------------------------------------------------ */
// Retro-Future Renk Paleti (Hex)
const THEME_COLORS = {
     gradientPrimary: "linear-gradient(90deg, #FF9966 0%, #FF5E62 100%)", // Sunset Orange
     gradientSecondary: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)", // Neon Cyan
     gradientText: "linear-gradient(90deg, #E2B0FF 0%, #9F44D3 100%)", // Mystic Purple
     glassBg: "rgba(20, 20, 30, 0.6)", // Koyu Glass
     glassBorder: "rgba(255, 255, 255, 0.08)",
     accentGold: "#FFD700",
};

const STATUS_COLORS = {
     URGENT: "#FF0055", // Neon Red
     HIGH: "#FF9900",   // Neon Orange
     NORMAL: "#00E5FF", // Neon Cyan
     LOW: "#00FF99",    // Neon Green
     DEFAULT: "#AAAAAA"
};

const getStatusColor = (status: string) => {
     // @ts-ignore
     return STATUS_COLORS[status] || STATUS_COLORS.DEFAULT;
};

/* ------------------------------------------------------
   STYLED COMPONENTS
------------------------------------------------------ */

const FullPageWrapper = styled("div")({
     width: "100%",
     minHeight: "100vh",
     // Derin uzay hissi veren koyu arkaplan
     background: "var(--bg)",
     color: "#ffffff",
     fontFamily: "var(--ff)", // Poiret One buraya çok yakışır
     paddingBottom: "80px",
     overflowX: "hidden",
});

// İstenilen Gradient Text Efekti
const GradientText = styled("span")<{ gradient?: string }>(({ gradient }) => ({
     background: gradient || "linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)",
     WebkitBackgroundClip: "text",
     backgroundClip: "text",
     WebkitTextFillColor: "transparent",
     display: "inline-block",
     fontWeight: 800,
}));

const HeroSection = styled("div")<{ imgUrl: string }>(({ imgUrl }) => ({
     width: "100%",
     height: "40vh",
     minHeight: "350px",
     // Resmin üzerine modern bir 'fade' atıyoruz
     backgroundImage: `
    linear-gradient(to bottom, rgba(15,15,26,0.2) 0%, rgba(15,15,26,1) 100%),
    url(${imgUrl})
  `,
     backgroundSize: "cover",
     backgroundPosition: "center 40%",
     position: "relative",
     display: "flex",
     alignItems: "flex-end",
     paddingBottom: "20px",
     // Alt kısmı hafif oval yapıyoruz (Mid-century touch)
     borderBottomLeftRadius: "50px",
     borderBottomRightRadius: "50px",
     boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
     zIndex: 1,
}));

const ContainerFluid = styled("div")({
     width: "100%",
     maxWidth: "1400px",
     margin: "0 auto",
     padding: "0 40px",
     position: "relative",
     zIndex: 2,
});

const ProfileOverlay = styled("div")({
     display: "flex",
     alignItems: "flex-end",
     gap: "40px",
     width: "100%",
     marginBottom: "-20px", // Avatarı çizgiden yukarı taşır
});

const StyledAvatar = styled(Avatar)({
     width: "180px",
     height: "180px",
     // Çift çerçeve efekti (Space Suit Helmet gibi)
     border: "4px solid rgba(255,255,255,0.1)",
     boxShadow: "0 0 30px rgba(0,242,254,0.3)", // Neon glow
     backgroundColor: "#0f0f1a",
});

const NameTitle = styled("h1")({
     fontFamily: "var(--ff)",
     fontSize: "4rem",
     lineHeight: 1,
     fontWeight: "bold",
     margin: 0,
     letterSpacing: "2px",
     textTransform: "uppercase",
});

const MetaRow = styled("div")({
     display: "flex",
     gap: "15px",
     marginTop: "20px",
     flexWrap: "wrap",
});

// Retro-Future Pill Badge
const RetroBadge = styled("div")<{ borderColor?: string; glow?: boolean }>(({ borderColor, glow }) => ({
     padding: "8px 20px",
     borderRadius: "50px", // Tam kapsül şekli
     border: `1px solid ${borderColor || "rgba(255,255,255,0.2)"}`,
     background: "rgba(255,255,255,0.03)",
     backdropFilter: "blur(5px)",
     color: borderColor || "#ccc",
     fontFamily: "var(--ff)",
     fontWeight: "bold",
     display: "flex",
     alignItems: "center",
     gap: "8px",
     boxShadow: glow ? `0 0 15px ${alpha(borderColor || "#fff", 0.4)}` : "none",
     transition: "0.3s",
     "&:hover": {
          background: alpha(borderColor || "#fff", 0.1),
          transform: "translateY(-2px)",
     }
}));

// Kartlar için Glassmorphism Container
const GlassCard = styled(Box)({
     background: THEME_COLORS.glassBg,
     backdropFilter: "blur(12px)",
     border: `1px solid ${THEME_COLORS.glassBorder}`,
     borderRadius: "30px", // Büyük radius (Mid-century style)
     padding: "30px",
     height: "100%",
     transition: "0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
     position: "relative",
     overflow: "hidden",
     "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 15px 30px rgba(0,0,0,0.4)",
          borderColor: "rgba(255,255,255,0.2)",
          "&::before": {
               opacity: 1,
          }
     },
     // Kartın üzerinde hafif bir parlama efekti (Cyberpunk light leak)
     "&::before": {
          content: '""',
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 60%)",
          opacity: 0,
          transition: "0.5s",
          pointerEvents: "none",
     }
});

const SectionTitle = styled("h2")({
     fontFamily: "var(--ff)",
     fontSize: "2.5rem",
     marginTop: "60px",
     marginBottom: "30px",
     paddingLeft: "20px",
     borderLeft: "6px solid #FF0055", // Neon çizgi
     letterSpacing: "1px",
     color: "#fff",
     display: "flex",
     alignItems: "center",
     gap: "15px",
});

// Timeline Kartı (Asimetrik ve Modern)
const ExamCard = styled("div")({
     display: "flex",
     width: "100%",
     background: "linear-gradient(100deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
     border: "1px solid rgba(255,255,255,0.05)",
     borderRadius: "24px",
     marginBottom: "25px",
     overflow: "hidden",
     transition: "all 0.3s ease",
     position: "relative",
     backdropFilter: "blur(5px)",
     "&:hover": {
          borderColor: "rgba(6, 182, 212, 0.5)", // Hover rengi (Cyan)
          boxShadow: "0 0 20px rgba(6, 182, 212, 0.15)",
          transform: "scale(1.01)",
     },
});

const ExamImage = styled("div")<{ img: string }>(({ img }) => ({
     width: "200px",
     minWidth: "200px",
     backgroundImage: `url(${img})`,
     backgroundSize: "cover",
     backgroundPosition: "center",
     filter: "grayscale(40%) contrast(120%)", // Retro film look
     transition: "0.3s",
     // Resme eğik bir kesim verelim (Futuristic cut)
     clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
     // Hoverda renkli olsun
     [`${ExamCard}:hover &`]: {
          filter: "grayscale(0%)",
     }
}));

const ExamContent = styled("div")({
     flex: 1,
     padding: "20px 20px 20px 0", // Soldaki boşluk clip-path yüzünden az olabilir
     display: "flex",
     flexDirection: "column",
     justifyContent: "center",
     gap: "10px",
});

const ExamAction = styled("div")({
     width: "120px",
     display: "flex",
     alignItems: "center",
     justifyContent: "center",
     borderLeft: "1px solid rgba(255,255,255,0.05)",
     background: "rgba(0,0,0,0.2)",
});

/* ------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------ */
const PatientProfile: React.FC = () => {
     const p = mockPatientData;
     const statusColor = getStatusColor(p.status);

     return (
          <FullPageWrapper>
               {/* --- HERO SECTION --- */}
               <HeroSection imgUrl={p.coverUrl}>
                    <ContainerFluid>
                         <ProfileOverlay>
                              <StyledAvatar src={p.avatarUrl} alt={p.name} />

                              <Box sx={{ pb: 2, flex: 1 }}>
                                   {/* Gradient Text Kullanımı */}
                                   <NameTitle>
                                        <GradientText gradient="linear-gradient(90deg, #ffffff 0%, #a5b4fc 100%)">
                                             {p.name}
                                        </GradientText>
                                   </NameTitle>

                                   <MetaRow>
                                        {/* Status Badge (Neon Style) */}
                                        <RetroBadge borderColor={statusColor} glow>
                                             <MonitorHeartIcon fontSize="small" />
                                             {p.status}
                                        </RetroBadge>

                                        <RetroBadge>
                                             <RoomIcon fontSize="small" />
                                             {p.room}
                                        </RetroBadge>

                                        <RetroBadge borderColor="#64748b">
                                             {p.age} YIL • {p.gender.toUpperCase()}
                                        </RetroBadge>
                                   </MetaRow>
                              </Box>
                         </ProfileOverlay>
                    </ContainerFluid>
               </HeroSection>

               {/* --- CONTENT SECTION --- */}
               <ContainerFluid>

                    {/* İSTATİSTİK GRID */}
                    <Grid container spacing={4} sx={{ mt: 4, mb: 6 }}>

                         <Grid>
                              <GlassCard>
                                   <Typography variant="overline" sx={{ color: "#94a3b8", letterSpacing: "2px" }}>
                                        TOPLAM KAYIT
                                   </Typography>
                                   <Typography variant="h2" sx={{ fontFamily: "var(--ff)", fontWeight: "bold" }}>
                                        <GradientText gradient={THEME_COLORS.gradientSecondary}>
                                             {p.examinations.length < 10 ? `0${p.examinations.length}` : p.examinations.length}
                                        </GradientText>
                                   </Typography>
                                   <Typography variant="caption" sx={{ color: "#64748b", display: "block", mt: 1 }}>
                                        Sistem Kayıtlı Muayene Sayısı
                                   </Typography>
                              </GlassCard>
                         </Grid>

                         <Grid>
                              <GlassCard sx={{ display: 'flex', alignItems: 'center' }}>
                                   <Box>
                                        <Typography variant="overline" sx={{ color: "#94a3b8", letterSpacing: "2px", mb: 1, display: "block" }}>
                                             SİSTEM RAPORU
                                        </Typography>
                                        <Typography sx={{ fontSize: "1.1rem", color: "#e2e8f0", lineHeight: 1.6 }}>
                                             <span style={{ color: THEME_COLORS.accentGold }}>Hasta Notu:</span> Hastanın hayati fonksiyonları stabilize edildi.
                                             {p.room} numaralı ünitede aktif gözetim altında tutuluyor. Nörolojik tepkiler normal aralıkta.
                                        </Typography>
                                   </Box>
                              </GlassCard>
                         </Grid>
                    </Grid>

                    {/* --- TIMELINE LIST --- */}
                    <SectionTitle>
                         <GradientText gradient="linear-gradient(90deg, #F472B6 0%, #DBDFAE 100%)">
                              MUAYENE GEÇMİŞİ
                         </GradientText>
                    </SectionTitle>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                         {p.examinations.map((exam) => (
                              <ExamCard key={exam.id}>
                                   {/* 1. Sol: Resim (Açılı Kesim) */}
                                   <ExamImage img={exam.imageUrl} />

                                   {/* 2. Orta: İçerik */}
                                   <ExamContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                                             <RetroBadge borderColor="#38bdf8" style={{ padding: "4px 12px", fontSize: "0.8rem" }}>
                                                  <CalendarMonthIcon style={{ fontSize: 16 }} />
                                                  {exam.date}
                                             </RetroBadge>

                                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: "#94a3b8", fontSize: "0.9rem" }}>
                                                  <AccessTimeIcon style={{ fontSize: 18 }} />
                                                  {exam.doctor}
                                             </Box>
                                        </Box>

                                        <Typography variant="h5" sx={{
                                             fontFamily: 'var(--ff)',
                                             fontWeight: 600,
                                             letterSpacing: "1px",
                                             textTransform: "uppercase"
                                        }}>
                                             <GradientText gradient="linear-gradient(90deg, #fff 0%, #94a3b8 100%)">
                                                  {exam.type}
                                             </GradientText>
                                        </Typography>

                                        <Typography variant="body1" sx={{ color: '#cbd5e1', opacity: 0.8, mt: 1, maxWidth: '95%', lineHeight: 1.6 }}>
                                             {exam.summary}
                                        </Typography>
                                   </ExamContent>

                                   {/* 3. Sağ: Buton */}
                                   <ExamAction>
                                        <Button
                                             icon="arrowright"
                                             type="default"
                                             stylingMode="text"
                                             onClick={() => console.log(exam.id)}
                                             elementAttr={{
                                                  style: {
                                                       borderRadius: '50%',
                                                       width: '60px',
                                                       height: '60px',
                                                       color: '#fff',
                                                       border: '1px solid rgba(255,255,255,0.2)'
                                                  }
                                             }}
                                        />
                                   </ExamAction>
                              </ExamCard>
                         ))}
                    </Box>

               </ContainerFluid>
          </FullPageWrapper>
     );
};

export default PatientProfile;