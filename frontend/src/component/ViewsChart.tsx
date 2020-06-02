import { ResponsiveLine } from '@nivo/line'
import React from 'react'
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.


export const ViewsChart:React.FC<any> = (props) => {

  const dataMap = [{
    "id": "youtube",
    "color": "hsl(23, 70%, 50%)",
    "data": []
  },
  {
    "id": "facebook",
    "color": "hsl(70, 70%, 50%)",
    "data": []
  },
  {
    "id": "handsup",
    "color": ["hsl(185, 73.6%, 44.5%)"],
    "data": []
  }
  ] as any
  console.log('inchart : '+typeof(props.data))
  console.log('inchart : '+JSON.stringify(props.data))
  if (props.data){
    const baseDate = new Date(props.data[0].created_at)
    for (const view of props.data as any) {
      for (const platform of dataMap){
        platform['data'].push({
          x: (new Date(view.created_at).getTime() - baseDate.getTime())/1000 / 60,
          y: view[platform['id']]
        })
      }
    }

  }
  console.log('datamap: ' + JSON.stringify(dataMap))
  const data = dataMap
    
    return (
            <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
        curve="natural"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Minute',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Viewer',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        colors={["#D82C26","#4267B2","rgba(30, 183, 197, 0.808)"]}
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
    )
}

// export const MyResponsiveLine = ({ data:[]}) => (
//     return ()
// )