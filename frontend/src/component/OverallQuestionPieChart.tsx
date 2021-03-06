import React from 'react'
import { ResponsivePie } from '@nivo/pie'
import './QuestionsPieChart.scss'
interface IProps{
    isAnswered: number;
    notAnswered: number;
    isHide: number;
}
export const OverallQuestionsPieChart:React.FC<IProps> = (props) => {
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
        "id": "Answered",
        "label": "Answered",
        "value": 0,
        "color": "hsl(212, 70%, 50%)"
    },
    {
        "id": "Not Answered",
        "label": "Not Answered",
        "value": 0,
        "color": "hsl(346, 70%, 50%)"
    },
    {
        "id": "Inappropriate",
        "label": "Inappropriate",
        "value": 0,
        "color": "hsl(346, 70%, 50%)"
    }]
  const {isAnswered, isHide, notAnswered} = props
            for (const category of dataMap){
                if (category.id === 'Answered'){
                    category.value = isAnswered
                }else if (category.id === 'Inappropriate'){
                    category.value = isHide
                }
                else if (category.id === 'Not Answered'){
                    category.value = notAnswered
                }
            }
        
        
    const totalValue = isAnswered + isHide + notAnswered;
    const data = dataMap
    return (
        <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.45}
        padAngle={0.6}
        cornerRadius={10}
        colors={["rgb(144, 238, 144)","rgb(245, 101, 102)","rgb(236,106,15)"]}
        // colors={["rgba(216, 44, 38,0.86)","#4267B2","rgba(30, 183, 197, 0.808)"]}

        radialLabelsSkipAngle={10}
        radialLabelsTextXOffset={6}
        radialLabelsTextColor="#333333"
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={16}
        radialLabelsLinkHorizontalLength={0}
        radialLabelsLinkStrokeWidth={2}
        radialLabelsLinkColor={{ from: 'color' }}
        sliceLabel={function(e){return e.value+" ("+Math.round(e.value/totalValue*100)+"%)"}}
        slicesLabelsSkipAngle={10}
        slicesLabelsTextColor="#333333"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        theme={theme}
        
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                translateY: 40,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                symbolSize: 10,
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

