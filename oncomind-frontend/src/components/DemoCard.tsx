import React, { useState } from "react";
import { Play, TriangleAlert } from "lucide-react";
import { Button, Empty, Field, Input } from "../dashboard/ui";

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
    <div className="site-tile site-reveal" style={{ minHeight: 0, justifyContent: "flex-start" }}>
      <span className="site-eyebrow">Live demo</span>
      <h2 className="site-h2" style={{ fontSize: 36 }}>Run a <span className="site-serif">prediction</span></h2>
      <p className="site-body">
        Run a quick sample prediction. This calls the local API (C# → Python).
      </p>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
        <Field label="Sample index" htmlFor="demo-sample">
          <Input id="demo-sample" type="number" value={sample} onChange={(e) => setSample(Number(e.target.value))} style={{ width: 120 }} />
        </Field>
        <Button variant="primary" icon={<Play size={16} />} loading={loading} onClick={onClickRun}>
          {loading ? "Running..." : "Run demo"}
        </Button>
      </div>

      {error && (
        <div className="om-pill om-pill--tone" style={{ "--tone": "var(--om-urgent)", height: "auto", padding: "10px 14px", borderRadius: 14, whiteSpace: "normal", alignItems: "flex-start" } as React.CSSProperties}>
          <TriangleAlert size={15} style={{ flex: "none", marginTop: 1 }} />
          <span><strong>Error:</strong> {error}</span>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span className="om-label">Result</span>
        {resp ? (
          <>
            <pre className="om-mono" style={{ margin: 0, padding: 14, borderRadius: 14, background: "var(--om-surface-2)", fontSize: 12, overflow: "auto", color: "var(--om-text)" }}>
              {JSON.stringify(resp, null, 2)}
            </pre>
            <table className="om-table">
              <thead>
                <tr>
                  <th>Sample</th>
                  <th>Predicted Score</th>
                </tr>
              </thead>
              <tbody>
                {gridData.map((row: any) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td style={{ fontVariantNumeric: "tabular-nums" }}>{row.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div style={{ borderRadius: 16, background: "var(--om-surface-2)" }}>
            <Empty title="No result yet">Run the demo to see a prediction.</Empty>
          </div>
        )}
      </div>
    </div>
  );
}
