import React, { useState, useEffect } from 'react';
import PieChart, {
     Series as PieSeries,
     Label as PieLabel,
     Connector,
     Legend,
     Font,
     Export
} from 'devextreme-react/pie-chart';
import Chart, {
     CommonSeriesSettings,
     Series as ChartSeries,
     ValueAxis,
     Tooltip,
     Grid,
     Legend as ChartLegend
} from 'devextreme-react/chart';
import DataGrid, { Column, Paging, Scrolling } from 'devextreme-react/data-grid';
import Button from "devextreme-react/button";
import "../../css/DashboardAnalytics.css";

// --- INTERFACES FOR OUR API DATA ---
interface DashboardData {
     kpis: {
          totalPatients: number;
          urgentCases: number;
          newPatients24h: number;
          totalDoctors: number;
     };
     charts: {
          statusDistribution: { status: string; count: number }[];
     };
     recentActivity: {
          id: string;
          name: string;
          status: string;
          time: string;
          date: string;
     }[];
}

// Initial Empty State
const initialData: DashboardData = {
     kpis: { totalPatients: 0, urgentCases: 0, newPatients24h: 0, totalDoctors: 0 },
     charts: { statusDistribution: [] },
     recentActivity: []
};
var myPalette = {
     Stable: '#4CAF50',
     Normal: '#2196F3',
     High: '#FF9800',
     Urgent: '#F44336'
};
export const DashboardAnalytics: React.FC = () => {
     const [data, setData] = useState<DashboardData>(initialData);
     const [loading, setLoading] = useState(true);

     // 1. Fetch Real Data on Load
     useEffect(() => {
          // Get the logged-in ID
          const currentDoctorId = localStorage.getItem("doctorId") || "";

          // Append it to the URL
          fetch(`http://localhost:5001/api/Dashboard/stats?doctorId=${currentDoctorId}`)
               .then(res => res.json())
               .then(fetchedData => {
                    setData(fetchedData);
                    setLoading(false);
               })
               .catch(err => console.error("Dashboard API Error:", err));
     }, []);

     // 2. Mock Image Logic (Still mock because we don't have an Image Database yet)
     const images = [
          { id: 1, name: "Scatter Analysis", url: "http://localhost:8000/scatter_line?x=1&x=2&x=3&y=2&y=5&y=3" },
          { id: 2, name: "Histogram View", url: "http://localhost:8000/hystogram" }
     ];
     const [imgIndex, setImgIndex] = useState(0);

     return (
          <div className="dashboard-container">

               {/* --- ROW 1: KPI CARDS --- */}
               <div className="kpi-section">
                    <div className="kpi-card" style={{ borderLeftColor: "#4facfe" }}>
                         <div className="kpi-title" style={{ color: "#4facfe" }}>Total Patients</div>
                         <div className="kpi-value">{data.kpis.totalPatients}</div>
                    </div>
                    <div className="kpi-card" style={{ borderLeftColor: "#ff5858" }}>
                         <div className="kpi-title" style={{ color: "#ff5858" }}>Urgent Cases</div>
                         <div className="kpi-value">{data.kpis.urgentCases}</div>
                    </div>
                    <div className="kpi-card" style={{ borderLeftColor: "#00f2fe" }}>
                         <div className="kpi-title" style={{ color: "#00f2fe" }}>New (24h)</div>
                         <div className="kpi-value">{data.kpis.newPatients24h}</div>
                    </div>
                    <div className="kpi-card" style={{ borderLeftColor: "#ffcc00" }}>
                         <div className="kpi-title" style={{ color: "#ffcc00" }}>Active Doctors</div>
                         <div className="kpi-value">{data.kpis.totalDoctors}</div>
                    </div>
               </div>

               {/* --- ROW 2: CHARTS --- */}

               {/* Chart 1: Real Data (Patient Status) */}
               <div className="chart-card">
                    <div className="card-header">Patient Status Distribution</div>
                    <div className="chart-container-fill">
                         <PieChart
                              id="status-pie"
                              type="doughnut"
                              palette="Ocean"
                              dataSource={data.charts.statusDistribution}
                         >

                              <PieSeries argumentField="status" valueField="count">
                                   <PieLabel visible={true} customizeText={(arg: any) => `${arg.argumentText} (${arg.valueText})`}>
                                        <Connector visible={true} />
                                        <Font size={16} />
                                   </PieLabel>
                              </PieSeries>
                              <Legend horizontalAlignment="center" verticalAlignment="bottom" />
                              <Export enabled={false} />
                         </PieChart>
                    </div>
               </div>

               {/* Chart 2: Mock Gene Data (Placeholder for AI Models) */}
               <div className="chart-card">
                    <div className="card-header">AI Model Confidence (Mock)</div>
                    <div className="chart-container-fill">
                         <Chart rotated={true} dataSource={[{ model: 'C-Net', acc: 94 }, { model: 'ResNet', acc: 88 }, { model: 'VGG16', acc: 82 }]}>
                              <CommonSeriesSettings type="bar" argumentField="model" valueField="acc" />
                              <ChartSeries name="Accuracy %" color="#00f2fe" />
                              <ValueAxis><Grid visible={true} opacity={0.1} /></ValueAxis>
                              <ChartLegend visible={false} />
                         </Chart>
                    </div>
               </div>

               {/* --- ROW 3: TOOLS & LISTS --- */}

               {/* Image Viewer */}
               <div className="image-section">
                    <div className="card-header">Analysis Viewer</div>
                    <div style={{ flex: 1, background: "black", borderRadius: "8px", overflow: "hidden", position: "relative" }}>
                         <img
                              src={images[imgIndex].url}
                              alt="Analysis"
                              style={{ width: "100%", height: "100%", objectFit: "contain" }}
                              onError={(e) => e.currentTarget.src = "https://via.placeholder.com/500x300?text=Analysis+Server+Offline"}
                         />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                         <Button icon="chevronleft" onClick={() => setImgIndex(i => i === 0 ? 1 : 0)} />
                         <span style={{ color: "#aaa", alignSelf: "center" }}>{images[imgIndex].name}</span>
                         <Button icon="chevronright" onClick={() => setImgIndex(i => i === 0 ? 1 : 0)} />
                    </div>
               </div>

               {/* Recent Patients List */}
               <div className="list-section">
                    <div className="card-header">Recent Patient Admissions</div>
                    <DataGrid
                         dataSource={data.recentActivity}
                         showBorders={false}
                         height="100%"
                         rowAlternationEnabled={true}
                    >
                         <Scrolling mode="virtual" />
                         <Column dataField="time" caption="Time" width={70} />
                         <Column dataField="name" caption="Patient Name" />
                         <Column
                              dataField="status"
                              caption="Status"
                              width={90}
                              cellRender={(e) => {
                                   const c = e.value === 'Urgent' ? '#ff5858' : '#4facfe';
                                   return <span style={{ color: c, fontWeight: 'bold' }}>{e.value}</span>
                              }}
                         />
                    </DataGrid>
               </div>

          </div>
     );
}