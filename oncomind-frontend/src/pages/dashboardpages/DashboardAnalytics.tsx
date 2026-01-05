import React, { useState, useEffect } from "react";
import PieChart, {
     Series as PieSeries,
     Label as PieLabel,
     Connector,
     Legend,
} from "devextreme-react/pie-chart";
import Chart, {
     CommonSeriesSettings,
     Series as ChartSeries,
     ValueAxis,
     Grid,
     Legend as ChartLegend,
     Tooltip,
     Font,
} from "devextreme-react/chart";
import DataGrid, { Column, Scrolling } from "devextreme-react/data-grid";
import SelectBox from "devextreme-react/select-box";
import Button from "devextreme-react/button";
import notify from "devextreme/ui/notify";
import "../../css/DashboardAnalytics.css";

// --- INTERFACES ---
interface DashboardData {
     kpis: {
          totalPatients: number;
          urgentCases: number;
          newPatients24h: number;
          totalDoctors: number;
     };
     charts: { statusDistribution: { status: string; count: number }[] };
     recentActivity: any[];
}

const initialData: DashboardData = {
     kpis: {
          totalPatients: 0,
          urgentCases: 0,
          newPatients24h: 0,
          totalDoctors: 0,
     },
     charts: { statusDistribution: [] },
     recentActivity: [],
};

const trainingStats = [
     { metric: "Epochs", value: 1000 },
     { metric: "Raw Molecule", value: 57619 },
     { metric: "Canonized Molecule", value: 32437 },
     { metric: "Accuracy", value: 86 },
];

export const DashboardAnalytics: React.FC = () => {
     const [data, setData] = useState<DashboardData>(initialData);
     const [availableModels, setAvailableModels] = useState<string[]>([]);
     const [selectedModel, setSelectedModel] = useState<string>("");
     const [imgIndex, setImgIndex] = useState(0);
     const [refreshKey, setRefreshKey] = useState(Date.now());

     // Dynamic Views based on selection
     const modelViews = selectedModel
          ? [
               {
                    id: 1,
                    name: "Inference Speed Benchmark",
                    url: `http://localhost:8000/inference_benchmark?model_name=${selectedModel}`,
               },
               {
                    id: 2,
                    name: "Neuron Activations (C-Atom)",
                    url: `http://localhost:8000/activation_map?model_name=${selectedModel}`,
               },
               {
                    id: 3,
                    name: "LSTM Weight Heatmap",
                    url: `http://localhost:8000/model_heatmap?layer=lstm&model_name=${selectedModel}`,
               },
          ]
          : [];
     const customizePiePoint = (point: any) => {
          switch (point.argument) {
               case "Urgent":
                    return { color: "#ff5252" }; // Red
               case "Critical":
                    return { color: "#ff0000" }; // Darker Red
               case "High":
                    return { color: "#ff7979" }; // Light Red

               case "Normal":
                    return { color: "#4facfe" }; // Blue
               case "Stable":
                    return { color: "#2ecc71" }; // Green
               case "Recovering":
                    return { color: "#00b894" }; // Teal

               default:
                    return { color: "#636e72" }; // Grey fallback
          }
     };

     // Load Data
     useEffect(() => {
          const docId = localStorage.getItem("doctorId") || "";
          fetch(`http://localhost:5001/api/Dashboard/stats?doctorId=${docId}`)
               .then((res) => res.json())
               .then(setData)
               .catch(console.error);

          fetch("http://localhost:8000/list_models")
               .then((res) => res.json())
               .then((d) => {
                    if (d.models?.length) {
                         setAvailableModels(d.models);
                         setSelectedModel(d.models[0]);
                    }
               })
               .catch(() => setAvailableModels(["Default"]));
     }, []);

     const handleNext = () => setImgIndex((p) => (p + 1) % modelViews.length);
     const handleRefresh = () => {
          setRefreshKey(Date.now());
          notify("Refreshing analysis...", "info", 1000);
     };

     return (
          <div className="analytics-page dark-mode">
               {/* 1. HEADER ROW */}
               <header className="analytics-header">
                    <div>
                         <h2 className="page-title">OncoMind AI Dashboard</h2>
                         <p className="page-subtitle">
                              Real-time Drug Discovery & Patient Analytics
                         </p>
                    </div>

                    <div className="model-selector-wrapper">
                         <span className="label">Active Model:</span>
                         <SelectBox
                              items={availableModels}
                              value={selectedModel}
                              onValueChanged={(e) => {
                                   setSelectedModel(e.value);
                                   setRefreshKey(Date.now());
                              }}
                              width={220}
                              className="dark-selectbox"
                              placeholder="Select AI Model..."
                         />
                    </div>
               </header>

               {/* 2. KPI ROW (Auto-fit) */}
               <div className="kpi-grid">
                    <div className="kpi-card glow-blue">
                         <div className="icon-box">👥</div>
                         <div className="kpi-content">
                              <h3>Total Patients</h3>
                              <p>{data.kpis.totalPatients}</p>
                         </div>
                    </div>
                    <div className="kpi-card glow-red">
                         <div className="icon-box">🚨</div>
                         <div className="kpi-content">
                              <h3>Urgent Cases</h3>
                              <p>{data.kpis.urgentCases}</p>
                         </div>
                    </div>
                    <div className="kpi-card glow-cyan">
                         <div className="icon-box">➕</div>
                         <div className="kpi-content">
                              <h3>New (24h)</h3>
                              <p>{data.kpis.newPatients24h}</p>
                         </div>
                    </div>
                    <div className="kpi-card glow-orange">
                         <div className="icon-box">👨‍⚕️</div>
                         <div className="kpi-content">
                              <h3>Active Doctors</h3>
                              <p>{data.kpis.totalDoctors}</p>
                         </div>
                    </div>
               </div>

               {/* 3. MAIN DASHBOARD GRID (2 Columns, responsive) */}
               <div className="main-grid">
                    {/* LEFT COLUMN */}
                    <div className="grid-column">
                         {/* Chart 1: Status */}
                         <div className="card chart-card">
                              <div className="card-header">Patient Status Distribution</div>
                              <div className="chart-wrapper">
                                   <PieChart
                                        type="doughnut"
                                        dataSource={data.charts.statusDistribution}
                                        resolveLabelOverlapping="shift"
                                        customizePoint={customizePiePoint} // 👈 LINKED HERE
                                   >
                                        <PieSeries argumentField="status" valueField="count">
                                             <PieLabel
                                                  visible={true}
                                                  customizeText={(e: any) =>
                                                       `${e.argumentText}: ${e.valueText}`
                                                  }
                                             >
                                                  <Connector visible={true} />
                                             </PieLabel>
                                        </PieSeries>
                                        <Legend visible={false} />
                                   </PieChart>
                              </div>
                         </div>

                         {/* Chart 2: Metrics */}
                         <div className="card chart-card">
                              <div className="card-header">Model Training Metrics</div>
                              <div className="chart-wrapper">
                                   <Chart rotated={false} dataSource={trainingStats}>
                                        <CommonSeriesSettings
                                             type="bar"
                                             argumentField="metric"
                                             valueField="value"
                                             color="#9be9fe"
                                        />
                                        <ChartSeries />

                                        {/* Use Logarithmic scale so small values (86) are visible next to big ones (50k) */}
                                        <ValueAxis type="logarithmic">
                                             <Grid visible={true} opacity={0.1} color="#555" />
                                        </ValueAxis>

                                        <ChartLegend visible={false} />

                                        {/* 👇 FIX: Dark Background + White Text */}
                                        <Tooltip
                                             enabled={true}
                                             color="#2d3436" /* Dark Grey Background */
                                             customizeTooltip={(arg: any) => {
                                                  return {
                                                       text: `${arg.argumentText}: ${arg.valueText}`,
                                                  };
                                             }}
                                        >
                                             {/* Force Text Color to White */}
                                             <Font color="#ffffff" size={14} weight={600} />
                                        </Tooltip>
                                   </Chart>
                              </div>
                         </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="grid-column">
                         {/* Live AI Analysis */}
                         <div className="card image-card">
                              <div className="card-header-row">
                                   <span>Live Model Analysis</span>
                                   <Button
                                        icon="refresh"
                                        stylingMode="text"
                                        onClick={handleRefresh}
                                   />
                              </div>

                              <div className="image-viewer-dark">
                                   {modelViews.length > 0 ? (
                                        <>
                                             <img
                                                  src={`${modelViews[imgIndex].url}&t=${refreshKey}`}
                                                  alt="Analysis"
                                                  onError={(e) =>
                                                  (e.currentTarget.src =
                                                       "https://via.placeholder.com/400x300/000000/FFFFFF?text=Offline")
                                                  }
                                             />
                                             <div className="image-overlay">
                                                  {modelViews[imgIndex].name}
                                             </div>
                                        </>
                                   ) : (
                                        <div className="placeholder-text">Loading Model...</div>
                                   )}
                              </div>

                              <div className="image-controls">
                                   <Button
                                        icon="chevronleft"
                                        onClick={() => handleNext()}
                                        type="normal"
                                        stylingMode="outlined"
                                   />
                                   <Button
                                        icon="chevronright"
                                        onClick={handleNext}
                                        type="normal"
                                        stylingMode="outlined"
                                   />
                              </div>
                         </div>

                         {/* Recent List */}
                         <div className="card list-card">
                              <div className="card-header">Recent Admissions</div>
                              <DataGrid
                                   dataSource={data.recentActivity}
                                   showBorders={false}
                                   height="100%"
                                   rowAlternationEnabled={true}
                                   columnAutoWidth={true}
                              >
                                   <Scrolling mode="virtual" />
                                   <Column dataField="time" width={80} alignment="center" />
                                   <Column dataField="name" />
                                   <Column
                                        dataField="status"
                                        width={100}
                                        cellRender={(e) => (
                                             <span
                                                  className={`status-badge ${e.value === "Urgent" ? "urgent" : "normal"
                                                       }`}
                                             >
                                                  {e.value}
                                             </span>
                                        )}
                                   />
                              </DataGrid>
                         </div>
                    </div>
               </div >
          </div >
     );
};