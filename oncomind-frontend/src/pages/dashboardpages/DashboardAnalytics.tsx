import React, { useState, useEffect, useMemo } from 'react';
import PieChart, {
     Legend,
     Series,
     Tooltip,
     Format,
     Label,
     Connector,
     Export,
} from 'devextreme-react/pie-chart';
import Chart, {
     ArgumentAxis,
     CommonSeriesSettings,
     ValueAxis,
     ConstantLine,
} from 'devextreme-react/chart';
import Button from "devextreme-react/button";
import "../../css/DashboardAnalytics.css";

const mostUsedGenes = [{
     region: 'ABL1',
     val: 500,
}, {
     region: 'FLT3',
     val: 12,
}, {
     region: 'KIT',
     val: 245,
}, {
     region: 'BCL2',
     val: 400,
}, {
     region: 'JAK2',
     val: 120,
}];
const complaintsData = [
     { complaint: 'Cold pizza', count: 780 },
     { complaint: 'Not enough cheese', count: 120 },
     { complaint: 'Underbaked or Overbaked', count: 52 },
     { complaint: 'Delayed delivery', count: 1123 },
     { complaint: 'Damaged pizza', count: 321 },
     { complaint: 'Incorrect billing', count: 89 },
     { complaint: 'Wrong size delivered', count: 222 },
];

const data = complaintsData.sort((a, b) => b.count - a.count);
const totalCount = data.reduce((prevValue, item) => prevValue + item.count, 0);
let cumulativeCount = 0;

const dataArray = data.map((item) => {
     cumulativeCount += item.count;
     return {
          complaint: item.complaint,
          count: item.count,
          cumulativePercentage: Math.round((cumulativeCount * 100) / totalCount),
     };
});

interface Image {
     id: number;
     name: string;
     url: string;
}
export const images = [
     {
          id: 1,
          name: "image_1",
          url: "http://localhost:8000/scatter_line?x=1&x=2&x=3&y=2&y=5&y=3"
     },
     {
          id: 2,
          name: "image_2",
          url: "http://localhost:8000/hystogram"
     },
     {
          id: 3,
          name: "image_3",
          url: "http://localhost:8000/parabol?x=1&x=2&x=3&y=2&y=5&y=3"
     }
];


function customizeTooltip(arg: { valueText: string; percent: number; }) {
     return {
          text: `${arg.valueText} - ${(arg.percent * 100).toFixed(2)}%`,
     };
}

export const DashboardAnalytics: React.FC = () => {
     const kpis = useMemo(() => [
          { id: 1, title: "Patients scanned (24h)", value: 58 },
          { id: 2, title: "AI classifications", value: 342 },
          { id: 3, title: "Model anomalies", value: 1 },
     ], []);
     const [selectedId, setSelectdId] = useState<number>(1);
     const prevImage = () => {
          setSelectdId((prev) => (prev <= 1 ? images.length : prev - 1));
     };
     const nextImage = () => {
          setSelectdId((prev) => (prev >= images.length ? 1 : prev + 1));
     };
     return (
          <>
               <div id="top_infos">
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
               <div className="charts">
                    <PieChart
                         id="pie"
                         type="doughnut"
                         title="The Population of Continents and Regions"
                         palette="Soft Pastel"
                         dataSource={mostUsedGenes}
                    >
                         <Series argumentField="region">
                              <Label visible={true} format="">
                                   <Connector visible={true} />
                              </Label>
                         </Series>
                         <Export enabled={true} />
                         <Legend margin={0} horizontalAlignment="right" verticalAlignment="top" />
                         <Tooltip enabled={true} customizeTooltip={customizeTooltip}>
                              <Format type="" />
                         </Tooltip>
                    </PieChart>
                    <PieChart
                         id="pie"
                         type="doughnut"
                         title="The Population of Continents and Regions"
                         palette="Soft Pastel"
                         dataSource={mostUsedGenes}
                    >
                         <Series argumentField="region">
                              <Label visible={true} format="">
                                   <Connector visible={true} />
                              </Label>
                         </Series>
                         <Export enabled={true} />
                         <Legend margin={0} horizontalAlignment="right" verticalAlignment="top" />
                         <Tooltip enabled={true} customizeTooltip={customizeTooltip}>
                              <Format type="" />
                         </Tooltip>
                    </PieChart>
                    <Chart
                         title="Pizza Shop Complaints"
                         dataSource={dataArray}
                         palette="Harmony Light"
                         id="chart"
                    >
                         <CommonSeriesSettings argumentField="complaint" type={"bar"} />
                         <Series
                              name="Complaint frequency"
                              valueField="count"
                              color="#fac29a"
                         />
                         <Series
                              name="Cumulative percentage"
                              valueField="cumulativePercentage"
                              color="#6b71c3"
                         />

                         <ArgumentAxis>
                              <Label />
                         </ArgumentAxis>

                         <ValueAxis name="frequency" position="left" tickInterval={300} />
                         <ValueAxis
                              name="percentage"
                              position="right"
                              tickInterval={20}
                              showZero={true}
                              valueMarginsEnabled={false}
                         >
                              <Label />
                              <ConstantLine value={80} width={2} color="#fc3535" dashStyle="dash">
                                   <Label visible={false} />
                              </ConstantLine>
                         </ValueAxis>

                         <Tooltip enabled={true} shared={true} customizeTooltip={customizeTooltip} />

                         <Legend verticalAlignment="top" horizontalAlignment="center" />
                    </Chart>

               </div>
               <div className="plots">
                    <div className="image">
                         <div className="image_slider">
                              <div className="images">
                                   {images
                                        .filter((image) => image.id === selectedId)
                                        .map((image) => {
                                             return <img key={image.id} src={image.url} alt={image.name} />;
                                        })}
                              </div>
                              <button className="button_prev" onClick={prevImage}>
                                   {" "}
                                   Prev{" "}
                              </button>
                              <button className="button_next" onClick={nextImage}>
                                   {" "}
                                   Next{" "}
                              </button>
                         </div>
                    </div>
               </div>
          </>
     );
}