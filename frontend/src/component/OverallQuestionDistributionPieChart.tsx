import React from 'react'
import { ResponsivePie } from '@nivo/pie'
import './QuestionFromChart.scss'

interface IProps{
    youtube:number,
    facebook:number,
    handsup:number
}
export const OverallQuestionDistributionPieChart:React.FC<IProps> = (props) => {
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
    // console.log('piechart: '+ JSON.stringify(props.data))
    const {youtube, facebook, handsup} = props
    for (const category of dataMap){
        if (category.id === 'youtube'){
            category.value = youtube
        }else if (category.id === 'facebook'){
            category.value = facebook
        }
        else if (category.id === 'handsup'){
            category.value = handsup
        }
    }
    const totalValue = youtube+facebook+handsup
    const data = dataMap
    return (
        <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.45}
        padAngle={0.6}
        cornerRadius={10}
        colors={["rgba(216, 44, 38,0.86)","#4267B2","rgba(30, 183, 197, 0.808)"]}

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
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
    />
    )
}
