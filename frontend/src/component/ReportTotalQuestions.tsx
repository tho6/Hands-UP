import React from 'react'
import { IReportQuestion, ICompareQuestion } from '../models/IReport'
import { ReportComparePlatform } from './ReportComparePlatform'

export const ReportTotalQuestions: React.FC<{data:IReportQuestion[], pastData: IReportQuestion[]}> = (props) => {
    const currentData = props.data? [...props.data]:''
    const pastData = props.pastData? [...props.pastData]:''
    const arrMap = [
        'youtube',
        'facebook',
        'handsup'
    ] as const
    const objMap:ICompareQuestion = {
        youtube:{},
        facebook:{},
        handsup:{}
    }
    if (currentData && pastData){
        for (const platform of arrMap){
            objMap[platform]['latestQuestions'] = currentData.filter( el => (el.platformname === platform)).length // this
            objMap[platform]['previousQuestions'] = pastData.map( el => el.platformname === platform )
                                            .reduce( function(a, b) {
                                                return b?a+1:a
                                            }, 0)
        }
    } else if(currentData){
        for (const platform of arrMap){
            objMap[platform]['latestQuestions'] = currentData.map( el => (el.platformname === platform))
                                            .reduce( function(a, b) {
                                                return b?a+1:a
                                            }, 0 )
        }
    }else{
        return <div></div>
    }

    return (
        <ReportComparePlatform currentData={{
            'youtube':objMap['youtube']['latestQuestions'] as number,
            'facebook':objMap['facebook']['latestQuestions'] as number,
            'handsup':objMap['handsup']['latestQuestions'] as number
        }} pastData={{
            'youtube':objMap['youtube']['previousQuestions'] as number,
            'facebook':objMap['facebook']['previousQuestions'] as number,
            'handsup':objMap['handsup']['previousQuestions'] as number
        }}/>
    )
}
