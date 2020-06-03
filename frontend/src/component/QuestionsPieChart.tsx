import React from 'react'
import { ResponsivePie } from '@nivo/pie'
import { IReportQuestion } from '../models/IReport';
export const QuestionsPieChart:React.FC<{data:IReportQuestion[]}> = (props) => {
    const theme = {
        labels:{
            text:{
                fontSize: 13,
            }
        },
        legends:{
            text: {
                fontSize: 13,
            }
        }
      };
    
    const dataMap = [{
        "id": "Answered Question",
        "label": "Answered Question",
        "value": 0,
        "color": "hsl(212, 70%, 50%)"
    },
    {
        "id": "Not Answered Question",
        "label": "Not Answered Question",
        "value": 0,
        "color": "hsl(346, 70%, 50%)"
    },
    {
        "id": "Inappropriate Question",
        "label": "Inappropriate Question",
        "value": 0,
        "color": "hsl(346, 70%, 50%)"
    }]
    console.log('piechart: '+ JSON.stringify(props.data))
    if (props.data){
        for (const question of props.data){
            for (const category of dataMap){
                if (question.isanswered && category.id === 'Answered Question'){
                    category.value += 1
                    break;
                }
                if (!question.isanswered && question.ishide && category.id === 'Inappropriate Question'){
                    category.value += 1
                    break
                }
                if (!question.isanswered && category.id === 'Not Answered Question'){
                    category.value += 1
                    break
                }
            }
        }
    }
    const totalValue = dataMap.reduce((a,b)=>a+b.value,0)

    const data = dataMap
    return (<ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.45}
        cornerRadius={6}
        colors={["rgb(144, 238, 144)","rgb(245, 101, 102)","rgb(236,106,15)"]}
        // colors={["rgba(216, 44, 38,0.86)","#4267B2","rgba(30, 183, 197, 0.808)"]}
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
        
        legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                translateY: 56,
                itemWidth: 200,
                itemHeight: 18,
                itemTextColor: '#999',
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000',
                        }
                    }
                ]
            }
        ]}
    />
    )
}

