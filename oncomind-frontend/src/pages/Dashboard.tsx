import React, { useEffect, useState } from "react";
import DataGrid, { Column } from "devextreme-react/data-grid";

export default function Dashboard() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    // Try to fetch a little demo row via API
    fetch("http://localhost:5173/api/predict?sample=5")
      .then((r) => r.json())
      .then((j) => {
        const item = { id: 1, sample: j.sample ?? j.ml?.sample, score: j.ml?.scores ? j.ml.scores[0] : j.prediction ?? 0 };
        setRows([item]);
      })
      .catch(() => setRows([]));
  }, []);
  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <h2>Dashboard</h2>
      <div className="card" style={{ marginTop: 12 }}>
        <h4>Sample predictions</h4>
        <DataGrid dataSource={rows} keyExpr="id" showBorders>
          <Column dataField="sample" caption="Sample" />
          <Column dataField="score" caption="Predicted score" />
        </DataGrid>
      </div>
    </div>
  );
}
