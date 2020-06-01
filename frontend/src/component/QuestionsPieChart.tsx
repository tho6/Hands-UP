import React from 'react'
import { ResponsivePie } from '@nivo/pie'
export const QuestionsPieChart:React.FC<any> = (props) => {
    const dataMap = [{
        "id": "Answered Question",
        "label": "Answered Question",
        "value": 0,
        "color": "hsl(346, 70%, 50%)"
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
                if (question.isanswered && category.id == 'Answered Question'){
                    category.value += 1
                    break;
                }
                if (!question.isanswered && question.ishide && category.id == 'Inappropriate Question'){
                    category.value += 1
                    break
                }
                if (!question.isanswered && category.id == 'Not Answered Question'){
                    category.value += 1
                    break
                }
            }
        }
    }
    const data = dataMap
    return (<ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.45}
        cornerRadius={6}
        colors={{ scheme: 'nivo' }}
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
        slicesLabelsSkipAngle={10}
        slicesLabelsTextColor="#333333"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
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
        fill={[
            {
                match: {
                    id: 'ruby'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'c'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'go'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'python'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'scala'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'lisp'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'elixir'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'javascript'
                },
                id: 'lines'
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
