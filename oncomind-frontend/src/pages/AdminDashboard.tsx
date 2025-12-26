import React, { useMemo, useState, useEffect } from "react";
import DataGrid, { Column, Paging, SearchPanel } from "devextreme-react/data-grid";
import Chart, { Series, CommonSeriesSettings, ArgumentAxis, Tooltip, Legend } from "devextreme-react/chart";
import Button from "devextreme-react/button";
import CircularGauge, { Scale, RangeContainer, ValueIndicator } from "devextreme-react/circular-gauge";
import Papa from "papaparse";
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";

import "../css/admin-dashboard.css";
import "../styles/dx.generic.custom-scheme.css";
/* ---------------- MOCK DATA ---------------- */

const predictions = new Array(30).fill(0).map((_, i) => ({
  id: i + 1,
  sample: `S-${1000 + i}`,
  score: +(Math.random() * 0.9).toFixed(3),
  ts: new Date(Date.now() - i * 3600 * 1000).toISOString(),
}));

const chartData = [
  { day: "Mon", preds: 12 },
  { day: "Tue", preds: 18 },
  { day: "Wed", preds: 10 },
  { day: "Thu", preds: 25 },
  { day: "Fri", preds: 14 },
];

const highRiskPatients = [
  { id: 1, name: "John Carter", status: "HIGH", probability: 0.89 },
  { id: 2, name: "Emily Stone", status: "URGENT", probability: 0.76 },
  { id: 3, name: "Mark Philips", status: "NORMAL", probability: 0.45 },
  { id: 4, name: "Sarah Young", status: "LOW", probability: 0.12 },
  { id: 5, name: "David Morris", status: "HIGH", probability: 0.81 },
];

const activity = [
  "Model X updated — accuracy improved +3.1%",
  "5 new samples processed",
  "Anomaly detected in sample S-1394",
  "User Dr. Smith exported model logs",
  "Background training job finished",
];

/* ---------------------------------------------------- */

export default function AdminDashboard() {
  const [gridData] = useState(predictions);

  const kpis = useMemo(() => [
    { id: 1, title: "Patients scanned (24h)", value: 58 },
    { id: 2, title: "AI classifications", value: 342 },
    { id: 3, title: "Model anomalies", value: 1 },
  ], []);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Calls C# -> which calls Python -> which returns CSV
    fetch("http://localhost:8080/api/analysis/dataset")
      .then((res) => res.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setData(result.data as any[]);
          }
        });
      });
  }, []);

  return (
    <div className="admin-dashboard">

      {/* KPI ROW */}
      <div className="kpi-row">
        {kpis.map(k => (
          <div className="kpi-card" key={k.id}>
            <div className="kpi-title">{k.title}</div>
            <div className="kpi-value">{k.value}</div>
          </div>
        ))}

        <div style={{ marginLeft: "auto" }}>
          <Button className="reload_button" text="Reload model" icon="refresh" />
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="two-up">

        {/* LEFT COLUMN */}
        <div className="card-left card-dx">

          {/* HIGH RISK PATIENTS */}
          <h3>High-Risk Patients</h3>
          <Card sx={{ background: "#141414", color: "white", marginBottom: "20px" }}>
            <CardContent>
              {highRiskPatients.map((p, index) => (
                <div key={p.id}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography>{p.name}</Typography>
                    <Typography
                      sx={{
                        color:
                          p.status === "HIGH"
                            ? "oklch(0.6293 0.2249 25.3)"
                            : p.status === "URGENT"
                              ? "oklch(0.8075 0.1671 106.56)"
                              : p.status === "NORMAL"
                                ? "oklch(0.627 0.1809 255.49)"
                                : "oklch(0.797 0.1936 133.33)",
                        fontWeight: "bold",
                      }}
                    >
                      {p.status}
                    </Typography>
                  </div>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    Probability: {(p.probability * 100).toFixed(1)}%
                  </Typography>
                  {index < highRiskPatients.length - 1 && <Divider sx={{ my: 1, opacity: 0.2 }} />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* RECENT PREDICTIONS */}
          <h3>Recent Predictions</h3>
          <DataGrid
            dataSource={data}
            showBorders={true}
            columnAutoWidth={true}
          >
            {data.length > 0 &&
              Object.keys(data[0]).map((key) => (
                <Column key={key} dataField={key} />
              ))}
          </DataGrid>
        </div>

        {/* RIGHT COLUMN */}
        <div className="card-right">

          {/* PREDICTIONS PER DAY CHART */}
          <div className="card-dx">
            <h3>Prediction Volume</h3>
            <Chart dataSource={chartData} height={260}>
              <CommonSeriesSettings argumentField="day" type="bar" />
              <Series valueField="preds" name="Predictions" />
              <ArgumentAxis />
              <Legend visible={false} />
              <Tooltip enabled />
            </Chart>
          </div>

          {/* SYSTEM LOAD GAUGE */}
          <div className="card-dx">
            <h3>System Load</h3>
            <CircularGauge value={78}>
              <Scale startValue={0} endValue={100} />
              <RangeContainer backgroundColor="#333" />
              <ValueIndicator type="triangleNeedle" />
            </CircularGauge>
          </div>

          {/* ACTIVITY LOG */}
          <div className="card-dx">
            <h3>Recent Activity</h3>
            <List sx={{ color: "white" }}>
              {activity.map((a, i) => (
                <ListItem key={i} dense>
                  <ListItemText primary={a} />
                </ListItem>
              ))}
            </List>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ marginTop: 20 }}>
        <h3>Actions</h3>
        <div className="card-dx" style={{ display: "flex", gap: 12 }}>
          <Button text="Export JSON" icon="export" />
          <Button text="Open logs" icon="folder" stylingMode="outlined" />
        </div>
      </div>

    </div>
  );
}
