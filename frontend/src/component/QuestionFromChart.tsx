import React from 'react'
import { ResponsivePie } from '@nivo/pie'
import { IReportQuestion } from '../models/IReport';
export const QuestionFromChart:React.FC<{data:IReportQuestion[]}> = (props) => {
    const theme = {
        labels:{
            text:{
                fontSize:13
            }
        },
        legends:{
            text: {
                fontSize: 13
            }
        }
      };
    const dataMap = [{
        "id": "youtube",
        "label": "youtube",
        "value": 0,
        "color": "hsl(346, 70%, 50%)"
    },
    {
        "id": "facebook",
        "label": "facebook",
        "value": 0,
        "color": "hsl(346, 70%, 50%)"
    },
    {
        "id": "handsup",
        "label": "handsup",
        "value": 0,
        "color": "hsl(346, 70%, 50%)"
    }]
    console.log('piechart: '+ JSON.stringify(props.data))
    if (props.data){
        for (const question of props.data){
            for (const platform of dataMap){
                if (question.platformname === platform.id){
                    platform.value += 1
                    break;
                }
            }
        }
    }else{
        return <div></div>
    }
    const totalValue = dataMap.reduce((a,b)=>a+b.value,0)
    const data = dataMap
    return (<ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.45}
        cornerRadius={6}
        colors={["rgba(216, 44, 38,0.86)","#4267B2","rgba(30, 183, 197, 0.808)"]}
        borderWidth={6}
        borderColor="#f0f0f0"
        radialLabelsSkipAngle={10}
        radialLabelsTextXOffset={6}
        radialLabelsTextColor="#333333"
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={16}
        radialLabelsLinkHorizontalLength={24}
        radialLabelsLinkStrokeWidth={2}
        radialLabelsLinkColor={{ from: 'color' }}
        sliceLabel={function(e){return e.value+" ("+e.value/totalValue*100+"%)"}}
        slicesLabelsSkipAngle={10}
        slicesLabelsTextColor="#333333"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        theme={theme}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        
        legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                translateY: 56,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
    />
    )
}
