import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-zoom';
const dataArr:{date:string, attr1:number, attr2:number}[] = [];
const baseDate = Date.now();
for(let i =0; i<100; i++){
    const obj = {
        date:  (baseDate+i*10000).toLocaleString() as string,
        attr1: randomNumberWithinARange(100),
        attr2: randomNumberWithinARange(100),
    }
dataArr.push(obj);
}
function randomNumberWithinARange(int:number){
    return Math.floor(Math.random() * int) +1
 }
export const ZoomViewsChart: React.FC<any>= () => {
    const dailyDataSets = dataArr
  const lineChart = dailyDataSets[0] ? (
    <Line
      data={{
        labels: dailyDataSets.map(({ date }) => date),
        datasets: [
          {
            data: dailyDataSets.map((data) => data.attr1),
            label: 'First data set',
            borderColor: 'red',
            fill: true,
          },
          {
            data: dailyDataSets.map((data) => data.attr2),
            label: 'Second data set',
            borderColor: 'green',
            fill: true,
          },
        ],
      }}
      options={{
        title: { display: true, text: 'My Chart' },
        zoom: {
          enabled: true,
          mode: 'x',
        },
        pan: {
          enabled: true,
          mode: 'x',
        },
      }}
    />
  ) : null;

  return <div>{lineChart}</div>;
}