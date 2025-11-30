import React, { useEffect, useState } from "react";
import DataGrid, { Column } from "devextreme-react/data-grid";
// Make sure to import CSS in your main App file!

export default function Dashboard() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Starting fetch..."); // 1. Verify this prints

    fetch("http://127.0.0.1:8000/predict")
      .then((r) => {
        // 2. Check if the server actually replied "OK"
        if (!r.ok) {
          throw new Error(`Server returned status: ${r.status}`);
        }
        return r.json();
      })
      .then((j) => {
        console.log("Data received:", j); // 3. See the data

        const item = {
          id: 1,
          sample: j.sample ?? "N/A",
          score: j.ml?.scores ? j.ml.scores[0] : j.prediction ?? 0
        };

        setRows([item]);
      })
      .catch((err) => {
        console.error("FETCH ERROR:", err); // 4. See the specific error
        setRows([]);
      })
      .finally(() => {
        // 5. IMPORTANT: This runs no matter what.
        console.log("Fetch attempt finished.");
        setLoading(false);
      });
  }, []);
  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <h2>Dashboard</h2>

      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      <div className="card" style={{ marginTop: 12 }}>
        <h4>Sample predictions</h4>

        {/* If loading, show text, otherwise show grid */}
        {loading ? (
          <p>Loading data...</p>
        ) : (
          <DataGrid
            dataSource={rows}
            keyExpr="id"
            showBorders
            height={300}
          >
            <Column dataField="sample" caption="Sample" />
            <Column dataField="score" caption="Predicted score" />
          </DataGrid>
        )}
      </div>
    </div>
  );
}