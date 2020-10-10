import { ResponsiveLine } from '@nivo/line';
import React from 'react';
import './ViewsChart.scss';
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

interface IProps {
  all: { meetingName: string; count: number }[];
  youtube: { meetingName: string; count: number }[];
  facebook: { meetingName: string; count: number }[];
  handsup: { meetingName: string; count: number }[];
  range: string;
}

export const ReportOverallLineChart: React.FC<IProps> = (props) => {
  const { all, youtube, facebook, handsup, range } = props;
  const dataMap = [
    {
      id: 'youtube',
      color: 'hsl(23, 70%, 50%)',
      data: []
    },
    {
      id: 'facebook',
      color: 'hsl(70, 70%, 50%)',
      data: []
    },
    {
      id: 'handsup',
      color: ['hsl(185, 73.6%, 44.5%)'],
      data: []
    },
    {
      id: 'all',
      color: ['hsl(0, 73.6%, 44.5%)'],
      data: []
    }
  ] as any;

  for (const elem of all) {
    dataMap[3].data.push({ x: elem.meetingName, y: elem.count });
  }
  for (const elem of youtube) {
    dataMap[0].data.push({ x: elem.meetingName, y: elem.count });
  }
  for (const elem of facebook) {
    dataMap[1].data.push({ x: elem.meetingName, y: elem.count });
  }
  for (const elem of handsup) {
    dataMap[2].data.push({ x: elem.meetingName, y: elem.count });
  }
  const data = dataMap;
  
  const axisBottom:any ={
    orient: 'bottom',
    tickSize: 5,
    tickPadding: 5,
    tickRotation: range !== '5' ? 50 : 0,
    legend: 'Events',
    legendOffset: 36,
    legendPosition: 'middle'
  }
  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      curve="monotoneX"
      axisTop={null}
      axisRight={null}
      axisBottom={
        range === 'all'
          ? (dataMap[3].data.length>15?null:axisBottom)
          : axisBottom
      }
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'No. of Questions',
        legendOffset: -40,
        legendPosition: 'middle'
      }}
      colors={[
        'rgba(216, 44, 38,0.86)',
        '#4267B2',
        'rgba(30, 183, 197, 0.808)',
        'rgba(0, 0, 0, 0.808)'
      ]}
      enablePoints={dataMap[3].data.length <=15}
      enableGridX={dataMap[3].data.length <=15}
      enableGridY={dataMap[3].data.length <=15}
      lineWidth={6}
      pointSize={9}
      pointColor="#ffffff"
      pointBorderWidth={3}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabel="y"
      pointLabelYOffset={-12}
      enableSlices="x"
      useMesh={true}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 7,
          itemDirection: 'left-to-right',
          itemWidth: 82,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 15,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
    />
  );
};

// export const MyResponsiveLine = ({ data:[]}) => (
//     return ()
// )
