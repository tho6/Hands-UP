import { ResponsiveLine } from '@nivo/line'
import React, { useMemo } from 'react'
import { IReportView } from '../models/IReport'
import './ViewsChart.scss'
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.


export const ViewsChart:React.FC<{data:IReportView[]}> = (props) => {


  const views = props.data? [...props.data]:null

  const data = useMemo(() =>{
    const dataMap:{id:'facebook'|'youtube'|'handsup', data:any[]}[]= [{
      "id": "youtube",
      // "color": "hsl(23, 70%, 50%)",
      "data": []
    },
    {
      "id": "facebook",
      // "color": "hsl(70, 70%, 50%)",
      "data": []
    },
    {
      "id": "handsup",
      //"color": "hsl(185, 73.6%, 44.5%)",
      "data": []
    }
    ] 
    // {x:number, y:number}
    // if(!views) return
    // const baseDate = new Date(views![0].created_at)
    // const objMap = {} as any
    // const arrbyMin = views?.map((dataObj:IReportView)=>{
    //   const tempMin = Math.round(((new Date(dataObj.created_at).getTime() - baseDate.getTime())/1000)/60)
    //   if (tempMin in objMap){
    //     objMap[tempMin].push(dataObj)
    //   }else{
    //     objMap[tempMin] = [dataObj]
    //   }
    // })
    // console.log(objMap)
    // console.log(arrbyMin);
    if(!views) return
    const baseDate = new Date(views![0].created_at)
    const dataArr = dataMap.map((elem:{id:string, data:{x:number, y:number, count:number}[]})=>{
      const arr = views?.map((dataObj:IReportView)=>{
        const idx = elem.id as 'facebook'|'youtube'|'handsup'
        return{
          y:dataObj[idx],
          x:Math.round(((new Date(dataObj.created_at).getTime() - baseDate.getTime())/1000)/60),
          count:1,
        }
      })
      return {...elem, data: arr}
    })
    const ytobj:any={};
    const fbobj:any={};
    const huobj:any={};
    for(const data of dataArr){
      if(!data) return ;
      if(!data.data) return;
      data.data.reduce((a,b, idx)=>{
        if(a.x===b.x){
          // if(data.id === 'youtube') ytobj[`${a.x}`] = (a.y + b.y)/2;
          // if(data.id === 'facebook') fbobj[`${a.x}`] = (a.y + b.y)/2;
          // if(data.id === 'handsup') huobj[`${a.x}`] = (a.y + b.y)/2;
            return {x:b.x, y:a.y + b.y, count:a.count+1};
        }
        if(a.x!==b.x){
          if(data.id === 'youtube') ytobj[`${a.x}`] = a.y/a.count
          if(data.id === 'facebook') fbobj[`${a.x}`] = a.y/a.count
          if(data.id === 'handsup') huobj[a.x] = a.y/a.count // this
            return b
        }
        return {x:a.x, y:a.y, count:1}
    },{x:0,y:0,count:0})
    if(data.id==='youtube'){
      const tmp =[]
      for(const key in ytobj){
        tmp.push({x:parseInt(key), y:Math.floor(ytobj[key]), count:0})
      }
      dataArr[0].data = tmp;
      // console.log(tmp);
    }
    if(data.id==='facebook'){
      const tmp =[]
      for(const key in fbobj){
        tmp.push({x:parseInt(key), y:Math.floor(fbobj[key]), count:0})
      }
      dataArr[1].data = tmp;
      // console.log(tmp);
    }
    if(data.id==='handsup'){
      const tmp =[]
      for(const key in huobj){
        tmp.push({x:parseInt(key), y:Math.floor(huobj[key]), count:0})
      }
      dataArr[2].data = tmp;
      // console.log(tmp);
    }
    }

    // for (const view of views as any) {
    //   for (const platform of dataMap){
    //     console.log(baseDate)
    //     console.log(new Date(view.created_at).toLocaleString())
    //     platform['data'].push({
    //       x: ((new Date(view.created_at).getTime() - baseDate.getTime())/1000)/60,
    //       y: view[platform['id']]
    //     })
    //     console.log(platform)
    //   }
    // }
    return dataArr as any
  },[views])
  // if (views){
  //   const baseDate = new Date(views[0].created_at)
  //   for (const view of views as any) {
  //     for (const platform of dataMap){
  //       console.log(baseDate)
  //       console.log(new Date(view.created_at).toLocaleString())
  //       platform['data'].push({
  //         x: ((new Date(view.created_at).getTime() - baseDate.getTime())/1000)/60,
  //         y: view[platform['id']]
  //       })
  //     }
  //   }
  // }else{
  //   return <div></div>
  // }
  if (!views) return <div></div>
  // console.log(dataMap)
  // // console.log('datamap: ' + JSON.stringify(dataMap))
  // const data = dataMap
    
    return ( 
            <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        curve="catmullRom"
        axisTop={null}
        axisRight={null}
        axisBottom={null}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Viewer',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        enableGridX={false}
        colors={["rgba(216, 44, 38,0.86)","#4267B2","rgba(30, 183, 197, 0.808)"]}
        lineWidth={6}
        pointSize={9}
        pointColor="#ffffff"
        pointBorderWidth={3}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel="y"
        pointLabelYOffset={-12}
        enableSlices="x"
        useMesh={false}
        sliceTooltip={({ slice }) => {
          return (
              <div
                  style={{
                      background: 'white',
                      padding: '9px 12px',
                      border: '1px solid #ccc',
                  }}
              >
                  <div>Minute: {slice.points[0].data.xFormatted}</div>
                  {slice.points.map(point => (
                      <div
                          key={point.id}
                          style={{
                              color: point.serieColor,
                              padding: '3px 0',
                          }}
                      >
                          <strong>{point.serieId}</strong> {point.data.yFormatted}
                      </div>
                  ))}
              </div>
          )
      }}
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