import React, { useEffect, useState } from "react";
import DataGrid, { Column } from "devextreme-react/data-grid";
import "../css/Dashboard.css";

interface PredictionResponse {
  sample: number;
  prediction: number;
  ml?: {
    scores: number[];
  };
}

const ScoreCellRender = (cellData: any) => {
  const score = parseFloat(cellData.value);
  let color = "white";

  if (score > 0.8) color = "#4caf50"; // Green for high confidence
  else if (score > 0.5) color = "#ffeb3b"; // Yellow for medium
  else color = "#f44336"; // Red for low
  
  return (
    <span style={{ color: color, fontWeight: "bold" }}>
      {cellData.text}
    </span>
  );
};

export default function Dashboard() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Starting fetch...");

    fetch("http://127.0.0.1:8000/predict?sample=5", {
      method: "GET", // Explicitly define the method (though it's default for GET)

    })
      .then((response) => {
        // Debugging: log the full response to check if headers are correct
        console.log("Response Headers:", response.headers);
        if (!response.ok) {
          throw new Error(`Server returned status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: PredictionResponse) => {
        console.log("Data received:", data);

        const item = {
          id: 1,
          sample: data.sample ?? "N/A",
          score: data.ml?.scores ? data.ml.scores[0] : data.prediction ?? 0,
        };

        setRows([item]);
      })
      .catch((err: Error) => {
        console.error("Fetch error:", err);
        setError(err.message);
      })
      .finally(() => {
        console.log("Fetch attempt finished.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <h2>Dashboard</h2>

      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      <div className="dx-card" style={{ marginTop: 12 }}>
        <h4>Sample predictions</h4>

        {/* If loading, show text, otherwise show grid */}
        {loading ? (
          <p>Loading data...</p>
        ) : (
          <DataGrid
            dataSource={rows}
            keyExpr="id"
            showBorders={true}
            showRowLines={true}
            rowAlternationEnabled={true} /* Adds zebra striping */
            width="100%"
            height={300}
          >
            <Column
              dataField="sample"
              caption="Sample"
              dataType="string"
              cellRender={ScoreCellRender}
              width={150}
            />
            <Column
              dataField="score"
              caption="Predicted Score"
              dataType="string"
              cellRender={ScoreCellRender} /* Applies the custom color logic */
              alignment="center"
            />
          </DataGrid>
        )}
      </div>
    </div>
  );
}
