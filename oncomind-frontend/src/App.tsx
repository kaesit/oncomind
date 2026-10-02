import 'devextreme/dist/css/dx.light.css';
import React, { useEffect, useState } from 'react'
import DataGrid, { Column } from 'devextreme-react/data-grid'

type MlResponse = {
     source: string;
     ml: {
          sample: number;
          scores: number[];
     } | null;
};

export default function App() {
     const [resp, setResp] = useState<MlResponse | null>(null)
     
     const data = [
          { id: 1, name: 'Sample A', score: resp?.ml?.scores ? resp.ml.scores[0] : 0 },
     ]

     return (
          <div style={{ padding: 24 }}>
               <h1>OncoMind — DevExtreme Demo (TSX)</h1>

               <pre>{JSON.stringify(resp, null, 2)}</pre>

               <DataGrid dataSource={data} keyExpr="id" showBorders>
                    <Column dataField="name" caption="Sample" />
                    <Column dataField="score" caption="Predicted Score" />
               </DataGrid>
          </div>
     )
}
