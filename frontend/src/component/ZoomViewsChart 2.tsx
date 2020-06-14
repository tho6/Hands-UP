import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-zoom';

export const ZoomViewsChart: React.FC<any>= () => {
    const dailyDataSets = [{
        date: Date.now(),
        attr1: 1,
        attr2: 2
    },
    {
        date: Date.now(),
        attr1: 1,
        attr2: 2
    },{
        date: Date.now(),
        attr1: 1,
        attr2: 2
    },{
        date: Date.now(),
        attr1: 1,
        attr2: 2
    }]
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