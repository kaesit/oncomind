import React, { useState, useEffect } from "react";
import DataGrid, {
  Column,
  Selection,
  FilterRow,
  HeaderFilter,
  Scrolling,
  Summary,
  TotalItem,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import "../css/admin-dashboard.css";
import "../styles/dx.generic.custom-scheme.css";

export default function AdminDashboard() {
  const [gridData, setGridData] = useState<any[]>([]);

  useEffect(() => {
    console.log("Fetching Patient Data...");

    fetch("http://localhost:5001/api/Patient")
      .then((res) => {
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Handle if data is wrapped in an object or direct array
        const list = Array.isArray(data) ? data : (data.value || []);

        // Map the data using your EXACT backend structure
        const enrichedData = list.map((p: any) => enrichPatientData(p));
        setGridData(enrichedData);
      })
      .catch((err) => console.error("Fetch Failed:", err));
  }, []);

  const enrichPatientData = (patient: any) => {
    // 1. EXACT MAPPING FROM YOUR JSON
    const id = patient.id;
    const name = `${patient.firstName} ${patient.lastName}`; // Combine names
    const room = patient.admissionLocation || "Not Admitted"; // "Room 24C3"
    const status = patient.emergencyStatus || "Normal"; // "Normal"
    const age = patient.age;

    // 2. MOCK AI LOGIC (Client Side) based on real Status
    // Deterministic seed for consistent "random" numbers
    const seed = (id.length) + (name.length);

    let diagnosis = "Benign";
    let confidence = 0.15;

    // If status is not Normal, AI suspects Malignant
    if (status !== "Normal" && status !== "Stable") {
      diagnosis = "Malignant";
      confidence = 0.88 + (seed % 10) / 100; // High confidence
    } else {
      // Normal patients = Benign or Low confidence
      confidence = 0.05 + (seed % 20) / 100;
    }

    return {
      id,
      name,
      age,
      room,
      status,
      diagnosis,
      confidence
    };
  };

  // --- RENDERERS ---
  const renderStatus = (data: any) => {
    let color = "#1b1d1eff";
    const val = data.value;
    if (val === "Urgent" || val === "Critical") color = "#ff7675";
    if (val === "Normal") color = "#00b894";

    return <span style={{ color, fontWeight: 600 }}>{val}</span>;
  };

  const renderConfidence = (data: any) => {
    const val = (data.value * 100).toFixed(1) + "%";
    // Red if high confidence of cancer
    const color = data.value > 0.8 ? "#ff7675" : "#00b894";
    return <span style={{ color, fontWeight: "bold" }}>{val}</span>;
  };

  const renderDiagnosis = (data: any) => {
    const d = data.value;
    const bg = d === "Malignant" ? "rgba(255, 118, 117, 0.1)" : "rgba(0, 184, 148, 0.1)";
    const color = d === "Malignant" ? "#ff7675" : "#00b894";

    return (
      <span style={{ backgroundColor: bg, color: color, padding: "2px 8px", borderRadius: "4px" }}>
        {d}
      </span>
    );
  }

  return (
    <div className="admin-minimal">
      <div className="header-row">
        <div>
          <h2 className="title">All Patients</h2>
          <p className="subtitle">Database Connection: <span style={{ color: '#00b894' }}>● Active</span></p>
        </div>
        <div className="actions">
          <Button text="Refresh List" stylingMode="contained" type="default" onClick={() => window.location.reload()} />
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-item">
          <span className="label">Total Patients</span>
          <span className="val">{gridData.length}</span>
        </div>
        <div className="stat-item">
          <span className="label">Occupied Rooms</span>
          <span className="val" style={{ color: '#fdcb6e' }}>
            {gridData.filter(p => p.room !== "Not Admitted").length}
          </span>
        </div>
        <div className="stat-item">
          <span className="label">Urgent Status</span>
          <span className="val" style={{ color: '#ff7675' }}>
            {gridData.filter(p => p.status !== 'Normal').length}
          </span>
        </div>
      </div>

      <div className="grid-wrapper">
        <DataGrid
          dataSource={gridData}
          showBorders={false}
          rowAlternationEnabled={true}
          columnAutoWidth={true}
          height="100%"
          hoverStateEnabled={true}
        >
          <Scrolling mode="virtual" />
          <Selection mode="multiple" showCheckBoxesMode="always" />
          <FilterRow visible={true} />
          <HeaderFilter visible={true} />

          <Column dataField="id" caption="Patient ID" width={220} />
          <Column dataField="name" caption="Full Name" />
          <Column dataField="age" caption="Age" width={60} alignment="center" />
          <Column dataField="room" caption="Location" width={120} alignment="center" />

          <Column dataField="diagnosis" caption="AI Diagnosis (Est.)" cellRender={renderDiagnosis} width={140} />
          <Column dataField="confidence" caption="Confidence" alignment="center" cellRender={renderConfidence} width={110} />

          <Column dataField="status" caption="Status" alignment="center" cellRender={renderStatus} width={130} />

          <Summary>
            <TotalItem column="id" summaryType="count" displayFormat="Total: {0}" />
          </Summary>
        </DataGrid>
      </div>
    </div>
  );
}