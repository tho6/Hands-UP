import React from 'react'
import { IReportQuestion } from '../models/IReport'
import './QuestionLikesRank.scss'
import like_logo from '../reportIcon/like_icon.svg'
export const QuestionLikesRank:React.FC<{data:IReportQuestion[]}> = (props) => {
    let copyData;
    const size = 3
    const questions = props.data? [...props.data]:''
    if(questions){
        copyData = questions.slice()
        copyData.sort(function(a,b) {
            const aCopy = a.questionlikes === null?  0 : parseInt(a.questionlikes)
            const bCopy = b.questionlikes === null?  0 : parseInt(b.questionlikes)
            return (bCopy-aCopy)
        })
    }else{
        return <div></div>
    }
    return (
        <div className='question-likes-rank-container'>
            <div className="question-likes-rank-content">
                {copyData?.slice(0,size).map((i,idx)=>{
                    if (!i.questionlikes) return 
                    return (
                        <div key={`id-${idx}`} className='question-likes-rank-content-row'>
                            <div className="question-likes-rank-content-id">
                                {idx+1}.
                            </div>
                            <div className="question-likes-rank-content-questions">
                                {i.questioncontent}
                            </div>
                            <div className="question-likes-rank-content-likes">
                                {i.questionlikes} <img src={like_logo} alt="like_logo"/>
                            </div>
                        </div>
                    )
                })}
                </div>
            </div>

    )
}
