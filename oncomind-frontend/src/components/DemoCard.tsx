import React, { useState } from "react";
import DataGrid, { Column } from "devextreme-react/data-grid";

type PredictResp = {
  sample?: number;
  prediction?: any;
  features_count?: number;
  ml?: { sample?: number; scores?: number[] };
};

export default function DemoCard() {
  const [sample, setSample] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<PredictResp | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runSample(s: number) {
    setLoading(true);
    setError(null);
    setResp(null);
    try {
      // Use the C# API endpoint that orchestrates ML: adjust host/port if needed
      const r = await fetch(`http://localhost:5000/api/predict?sample=${s}`);
      if (!r.ok) {
        const t = await r.text();
        setError(`API error: ${r.status} ${t}`);
        setLoading(false);
        return;
      }
      const j = await r.json();
      setResp(j);
    } catch (e: any) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  function onClickRun(e?: React.MouseEvent) {
    runSample(sample);
  }

  const gridData = resp
    ? [
        {
          id: 1,
          name: resp.sample ?? resp?.ml?.sample ?? sample,
          score:
            resp.ml?.scores?.length ? resp.ml.scores[0] : (resp.prediction ?? 0),
        },
      ]
    : [];

  return (
    <div className="card">
      <h3>Live demo</h3>
      <p className="small">
        Run a quick sample prediction. This calls the local API (C# → Python).
      </p>

      <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <label style={{ fontSize: 14 }}>Sample index:</label>
        <input
          type="number"
          value={sample}
          onChange={(e) => setSample(Number(e.target.value))}
          style={{ width: 90, padding: 8, borderRadius: 8, border: "1px solid #e6eef0" }}
        />
        <button className="btn btn-primary" onClick={onClickRun} disabled={loading}>
          {loading ? "Running..." : "Run demo"}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: 12, color: "crimson" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <h4 style={{ margin: "0 0 8px 0" }}>Result</h4>
        <div style={{ minHeight: 84 }}>
          {resp ? (
            <>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13 }}><strong>Raw response</strong></div>
                <pre style={{ background: "#f3f7f8", padding: 8, borderRadius: 6 }}>{JSON.stringify(resp, null, 2)}</pre>
              </div>

              <div>
                <DataGrid dataSource={gridData} keyExpr="id" showBorders>
                  <Column dataField="name" caption="Sample" />
                  <Column dataField="score" caption="Predicted Score" />
                </DataGrid>
              </div>
            </>
          ) : (
            <div className="small">No result yet — run the demo.</div>
          )}
        </div>
      </div>
    </div>
  );
}
