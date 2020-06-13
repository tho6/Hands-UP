import React from 'react'
import { ResponsivePie } from '@nivo/pie'
import { IReportQuestion } from '../models/IReport';
import './QuestionFromChart.scss'
// import { ReportPopTable } from './ReportPopTable';

function processData(arr: IReportQuestion[]):string[][]{
    const processedDT = arr.map((question,idx) => {
        return [`${idx+1}`, question.questioncontent?question.questioncontent:'', 
        question.questionlikes?question.questionlikes:'', question.isanswered?'Answered':'Not Answered']

    })
    return processedDT
}
export const QuestionFromChart:React.FC<{setReportPopData:(data:{header:string, columns:string[], data:string[][]})=>void, setReportPopOpen:()=>void,data:IReportQuestion[]}> = (props) => {
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
    const questions = props.data? [...props.data]:''
    const dataMap = [{
        "id": "youtube",
        "label": "youtube",
        "value": 0,
    },
    {
        "id": "facebook",
        "label": "facebook",
        "value": 0,
    },
    {
        "id": "handsup",
        "label": "handsup",
        "value": 0,
    }]
    // console.log('piechart: '+ JSON.stringify(props.data))
    if (questions){
        for (const question of questions){
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
        onClick={(e)=>{
            console.log(e)
            const reportPopCol = ['ID', 'Question Content', 'Question Likes', 'Answer Status']
            // const values = ['questioncontent','questionlikes','isanswered']
            let tempData = []
            switch(e.id){
                case 'youtube':
                    const ytPlatformData = questions.filter(el=>el.platformname==='youtube')
                    tempData = processData(ytPlatformData)
                    props.setReportPopData({header: 'Youtube', columns: reportPopCol, data: tempData})
                    console.log('youtube')
                    props.setReportPopOpen()
                    break
                case 'handsup':
                    const huPlatformData = questions.filter(el=>el.platformname==='handsup')
                    tempData = processData(huPlatformData)
                    props.setReportPopData({header: 'HandsUP', columns: reportPopCol,data: tempData})
                    console.log('handsup')
                    props.setReportPopOpen()
                    break
                case 'facebook':
                    const fbPlatformData = questions.filter(el=>el.platformname==='facebook')
                    tempData = processData(fbPlatformData)
                    props.setReportPopData({header: 'Facebook', columns: reportPopCol, data:tempData})
                    console.log('facebook')
                    props.setReportPopOpen()

                    break
            }
        }}
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
