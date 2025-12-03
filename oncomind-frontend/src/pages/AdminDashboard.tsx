// oncomind-frontend/src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react/button";
import DataGrid, { Column, Paging, FilterRow, SearchPanel } from "devextreme-react/data-grid";
import { LoadPanel } from "devextreme-react/load-panel";

type ModelInfo = {
  model_loaded: boolean;
  model_kind?: string;
  model_meta?: any;
};

type PredictionRow = {
  id: number;
  sample: number | string;
  score: number;
  ts?: string;
  meta?: any;
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [predictions, setPredictions] = useState<PredictionRow[]>([]);
  const [logs, setLogs] = useState<string>("");

  useEffect(() => {
    refreshAll();
    // tail logs periodically if desired
    const iv = setInterval(() => fetchLogs(), 5000);
    return () => clearInterval(iv);
  }, []);

  async function refreshAll() {
    setLoading(true);
    await Promise.all([fetchModelInfo(), fetchRecentPredictions(), fetchLogs()]);
    setLoading(false);
  }

  async function fetchModelInfo() {
    try {
      const r = await fetch("http://localhost:5000/api/admin/model_info");
      const j = await r.json();
      setModelInfo(j);
    } catch (e) {
      setModelInfo(null);
      console.error("model_info error", e);
    }
  }

  async function fetchRecentPredictions() {
    try {
      const r = await fetch("http://localhost:5000/api/admin/predictions?limit=50");
      if (!r.ok) { setPredictions([]); return; }
      const j = await r.json();
      // expect {predictions: [...]}
      setPredictions((j.predictions || []).map((p:any, i:number)=>({
        id: i+1, sample: p.sample ?? p.data?.sample ?? i, score: p.score ?? (p.prediction ?? 0), ts: p.ts ?? p.time
      })));
    } catch (e) {
      setPredictions([]);
      console.error("predictions error", e);
    }
  }

  async function fetchLogs() {
    try {
      const r = await fetch("http://localhost:5000/api/admin/logs?lines=200");
      const text = await r.text();
      setLogs(text);
    } catch (e) {
      setLogs(`Failed to fetch logs: ${String(e)}`);
    }
  }

  async function onReloadModel() {
    setLoading(true);
    try {
      const r = await fetch("http://localhost:5000/api/admin/reload_model", { method: "POST" });
      const j = await r.json();
      alert("Reload result: " + JSON.stringify(j));
      await fetchModelInfo();
    } catch (e) {
      alert("Reload failed: " + String(e));
    } finally {
      setLoading(false);
    }
  }

  async function onUploadModel(ev: React.ChangeEvent<HTMLInputElement>) {
    const f = ev.target.files?.[0];
    if (!f) return;
    const form = new FormData();
    form.append("file", f);
    setLoading(true);
    try {
      const r = await fetch("http://localhost:5000/api/admin/upload_model", { method: "POST", body: form });
      const j = await r.json();
      alert("Upload result: " + JSON.stringify(j));
      await fetchModelInfo();
    } catch (e) {
      alert("Upload failed: " + String(e));
    } finally {
      setLoading(false);
      ev.currentTarget.value = "";
    }
  }

  return (
    <div className="container" style={{ paddingTop: 18 }}>
      <h2>Admin Dashboard</h2>

      <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center" }}>
        <Button text="Refresh" onClick={refreshAll} />
        <Button type="default" text="Reload model" stylingMode="contained" onClick={onReloadModel} />
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span className="small">Upload model (.pt/.bin/.joblib)</span>
          <input type="file" accept=".pt,.pth,.joblib,.bin" onChange={onUploadModel} />
        </label>
        <Button text="Clear logs" onClick={() => setLogs("")} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 16 }}>
        <div>
          <div className="card" style={{ marginBottom: 12 }}>
            <h4>Model status</h4>
            <div className="small">Model loaded: {String(modelInfo?.model_loaded ?? false)}</div>
            <div className="small">Model kind: {modelInfo?.model_kind ?? "unknown"}</div>
            <pre style={{ marginTop: 8, background: "rgba(255,255,255,0.02)", padding: 8, borderRadius: 8 }}>
              {JSON.stringify(modelInfo?.model_meta || modelInfo || {}, null, 2)}
            </pre>
          </div>

          <div className="card">
            <h4>Recent predictions</h4>
            <DataGrid dataSource={predictions} keyExpr="id" showBorders>
              <SearchPanel visible />
              <FilterRow visible />
              <Paging defaultPageSize={10} />
              <Column dataField="sample" caption="Sample" />
              <Column dataField="score" caption="Score" />
              <Column dataField="ts" caption="Time" />
            </DataGrid>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 12 }}>
            <h4>Logs (tail)</h4>
            <div style={{ height: 360, overflow: "auto", background: "rgba(255,255,255,0.02)", padding: 8, borderRadius: 8, whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: 12 }}>
              {logs || <span className="small">No logs yet.</span>}
            </div>
          </div>

          <div className="card">
            <h4>Actions</h4>
            <div style={{ display: "flex", gap: 8 }}>
              <Button text="Clear model cache" onClick={async ()=>{ await fetch("http://localhost:5000/api/admin/clear_cache", {method:"POST"}); alert("cleared");}}/>
              <Button text="Run health check" onClick={async ()=>{ const r=await fetch("http://localhost:5000/api/admin/health"); alert(await r.text()); }}/>
            </div>
          </div>
        </div>
      </div>

      <LoadPanel visible={loading} shading={true} message="Working..." showIndicator />
    </div>
  );
}
