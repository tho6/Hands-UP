import { ResponsiveBar } from '@nivo/bar';
import './ViewsChart.scss';
import React from 'react';
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
interface IProps {
  data: {
    meetingName: string;
    handsup: number;
    facebook: number;
    youtube: number;
  }[];
  range:string;
}
const color = {
youtubeColor:'hsl(23, 70%, 50%)',
handsupColor:'hsl(185, 73.6%, 44.5%)',
facebookColor:'hsl(70, 70%, 50%)'
}
export const OverallPeakViewBarChart:React.FC<IProps> = (props) =>{
    console.log(props);
    const data = props.data.map(elem=>{
        const obj = {...elem, ...color}
        return obj;
    })
return(
        <ResponsiveBar
          data={data}
          keys={['handsup', 'facebook', 'youtube']}
          indexBy="meetingName"
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          groupMode="grouped"
          colors={["rgba(30, 183, 197, 0.808)", "#4267B2", "rgba(216, 44, 38,0.86)"]}
          defs={[
            {
              id: 'dots',
              type: 'patternDots',
              background: 'inherit',
              color: '#38bcb2',
              size: 4,
              padding: 1,
              stagger: true
            },
            {
              id: 'lines',
              type: 'patternLines',
              background: 'inherit',
              color: '#eed312',
              rotation: -45,
              lineWidth: 6,
              spacing: 10
            }
          ]}
      
          borderRadius={3}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: props.range !== '5' ? 50 : 0,
            legend: 'Events',
            legendPosition: 'middle',
            legendOffset: 32
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Peak Views',
            legendPosition: 'middle',
            legendOffset: -40
          }}
          enableLabel={false}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      );      
} 