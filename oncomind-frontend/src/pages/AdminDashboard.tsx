import React, { useMemo, useState } from "react";
import DataGrid, { Column, Paging, FilterRow, SearchPanel } from "devextreme-react/data-grid";
import Chart, { Series, ArgumentAxis, CommonSeriesSettings, Legend, Tooltip } from "devextreme-react/chart";
import Button from "devextreme-react/button";
import { type TreeListTypes } from 'devextreme-react/tree-list';

import "../css/admin-dashboard.css";
import "../styles/dx.generic.custom-scheme.css";

// mock data
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

import TreeList, {
  Column, ColumnChooser, HeaderFilter, SearchPanel, Selection, Lookup,
} from 'devextreme-react/tree-list';

import { employees, priorities, tasks } from './data.ts';
import EmployeeCell from './EmployeeCell.tsx';

const expandedKeys = [1, 2];
const selectedKeys = [1, 29, 42];

const statuses = [
  'Not Started',
  'Need Assistance',
  'In Progress',
  'Deferred',
  'Completed',
];

const dataSourceOptions = {
  store: tasks.map((task) => {
    employees.forEach((employee) => {
      if (task.Task_Assigned_Employee_ID === employee.ID) {
        task.Task_Assigned_Employee = employee;
      }
    });
    return task;
  }),
};

const customizeTaskCompletionText = (cellInfo) => `${cellInfo.valueText}%`;

const columns = ['CompanyName', 'City', 'State', 'Phone', 'Fax'];

export default function AdminDashboard() {
  const [gridData] = useState(predictions);

  const kpis = useMemo(() => [
    { id: 1, title: "Predictions (24h)", value: 342 },
    { id: 2, title: "Models loaded", value: 2 },
    { id: 3, title: "Errors (24h)", value: 1 },
  ], []);

  return (
    <div className="admin-dashboard">
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

      <div className="two-up">
        <div className="dx-viewport card-left card-dx">
          <h3>Predictions — recent</h3>
          <DataGrid
            dataSource={gridData}
            keyExpr="id"
            showBorders={true}
            showRowLines={true}
            columnAutoWidth={false}
            rowAlternationEnabled={false} // Helps readability in dark mode
          >
            <SearchPanel visible />
            <FilterRow visible />
            <Paging defaultPageSize={8} />
            <Column dataField="sample" caption="Sample" />
            <Column dataField="score" caption="Score" dataType="number" />
            <Column dataField="ts" caption="Timestamp" dataType="datetime" />
          </DataGrid>

          <TreeList
            dataSource={dataSourceOptions}
            showBorders={true}
            columnAutoWidth={true}
            wordWrapEnabled={true}
            defaultExpandedRowKeys={expandedKeys}
            defaultSelectedRowKeys={selectedKeys}
            keyExpr="Task_ID"
            parentIdExpr="Task_Parent_ID"
            id="tasks"
          >
            <SearchPanel visible={true} width={250} />
            <HeaderFilter visible={true} />
            <Selection mode="multiple" />
            <ColumnChooser enabled={true} />

            <Column dataField="Task_Subject" width={300} />
            <Column
              dataField="Task_Assigned_Employee_ID"
              caption="Assigned"
              allowSorting={true}
              minWidth={200}
              cellComponent={EmployeeCell}
            >
              <Lookup dataSource={employees} displayExpr="Name" valueExpr="ID" />
            </Column>
            <Column
              dataField="Task_Status"
              caption="Status"
              minWidth={100}
            >
              <Lookup dataSource={statuses} />
            </Column>
            <Column
              dataField="Task_Priority"
              caption="Priority"
              visible={false}
            >
              <Lookup dataSource={priorities} valueExpr="id" displayExpr="value" />
            </Column>
            <Column
              dataField="Task_Completion"
              caption="% Completed"
              minWidth={100}
              customizeText={customizeTaskCompletionText}
              visible={false}
            />
            <Column
              dataField="Task_Start_Date"
              caption="Start Date"
              dataType="date"
            />
            <Column
              dataField="Task_Due_Date"
              caption="Due Date"
              dataType="date"
            />
          </TreeList>
        </div>

        <div className="card-right card-dx">
          <h3>Activity</h3>
          <Chart dataSource={chartData} title="Predictions per day">
            <CommonSeriesSettings argumentField="day" type="bar" />
            <Series valueField="preds" name="Predictions" />
            <ArgumentAxis />
            <Legend visible={true} />
            <Tooltip enabled />
          </Chart>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <h3>Actions & logs</h3>
        <div className="card-dx">
          <div style={{ display: "flex", gap: 12 }}>
            <Button text="Export JSON" icon="export" />
            <Button text="Open logs" icon="folder" stylingMode="outlined" />
          </div>
        </div>
      </div>
    </div >
  );
}
