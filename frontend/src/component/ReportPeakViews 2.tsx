import React from 'react'
// import { Row } from 'react-bootstrap'
// import {ReactComponent as YoutubeIcon} from '../reportIcon/youtube_icon.svg'
import { IReportView, IPeakViews } from '../models/IReport'
import { ReportComparePlatform } from './ReportComparePlatform'

export const ReportPeakViews:React.FC<{data:IReportView[], pastData: IReportView[]}> = (props) => {
    const currentData = props.data? [...props.data]:''
    const pastData = props.pastData? [...props.pastData]:''
    const arrMap = [
        'youtube',
        'facebook',
        'handsup'
    ] as const
    const objMap:IPeakViews = {
        youtube:{},
        facebook:{},
        handsup:{}
    }
    if (currentData && pastData){
        for (const platform of arrMap){
            objMap[platform]['latestViews'] = currentData.map( el => el[platform] )
                                            .reduce( function(a, b) {
                                                return Math.max(a, b);
                                            }, -Infinity )
            objMap[platform]['previousViews'] = pastData.map( el => el[platform] )
                                            .reduce( function(a, b) {
                                                return Math.max(a, b);
                                            }, -Infinity )
        }
    }else{
        return <div></div>
    }
    
    return (
        <ReportComparePlatform currentData={{
            'youtube':objMap['youtube']['latestViews'] as number,
            'facebook':objMap['facebook']['latestViews'] as number,
            'handsup':objMap['handsup']['latestViews'] as number
        }} pastData={{
            'youtube':objMap['youtube']['previousViews'] as number,
            'facebook':objMap['facebook']['previousViews'] as number,
            'handsup':objMap['handsup']['previousViews'] as number
        }}/>
    )
}
