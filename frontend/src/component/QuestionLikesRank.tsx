import React from 'react'
import { IReportQuestion } from '../models/IReport'
import './QuestionLikesRank.scss'
export const QuestionLikesRank:React.FC<{data:IReportQuestion[]}> = (props) => {
    console.log(props.data)
    let copyData;
    const size = 2
    if(props.data){
        copyData = props.data.slice()
        copyData.sort(function(a,b) {
            const aCopy = a.questionlikes === null?  0 : parseInt(a.questionlikes)
            const bCopy = b.questionlikes === null?  0 : parseInt(b.questionlikes)
            return (bCopy-aCopy)
        })
    }
    return (
        <div className='question-likes-rank-container'>
            <div className="question-likes-rank-header">
                <span>The Most Liked Questions</span>
            </div>
            <div className="question-likes-rank-content">
                {copyData?.slice(0,size).map((i,idx)=>{
                    return (
                        <div key={`id-${idx}`} className='question-likes-rank-content-row'>
                            <div className="question-likes-rank-content-id">
                                {i.id}
                            </div>
                            <div className="question-likes-rank-content-questions">
                                {i.questioncontent}
                            </div>
                            <div className="question-likes-rank-content-likes">
                                {i.questionlikes}
                            </div>
                        </div>
                    )
                })}
                </div>
            </div>

    )
}
