import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReportQuestions, fetchReportViews } from '../redux/report/thunk';
// import { ReportNavbar } from './ReportNavbar';
// import { Backdrop } from '@material-ui/core';
import { useRouteMatch } from 'react-router-dom';
import { RootState } from '../store';
import {ViewsChart} from './ViewsChart';
import './Report.scss'
import { QuestionFromChart } from './QuestionFromChart';
import { QuestionsPieChart } from './QuestionsPieChart';
import { QuestionLikesRank } from './QuestionLikesRank';
import { ReportPeakViews } from './ReportPeakViews';
import { ReportTotalQuestions } from './ReportTotalQuestions';

// created_at: "2020-06-20T02:00:00.000Z"
// facebook: 3
// handsup: 5
// id: 1
// meetingid: 1
// youtube: 1
export function Report() {
    const dispatch = useDispatch();
    // const [isDrawerOpen, setDrawerOpen] = useState(false)
    const match = useRouteMatch<{loc?:string}>()
    const meetingId = match.params.loc
    // const meetingId = preMeetingId?.split(',')
    
    useEffect(() => {
        dispatch(fetchReportQuestions('all'))
        dispatch(fetchReportViews('all'))

    }, [dispatch])

    const questionsByMeetingId = useSelector((state:RootState)=>state.report.questionsByMeetingId[meetingId!])
    const questions = useSelector((state:RootState)=>questionsByMeetingId?.map((id:number) => state.report.questions[id]))
    const viewsByMeetingId = useSelector((state:RootState)=>state.report.viewsByMeetingId[meetingId!])
    const views = useSelector((state:RootState)=>viewsByMeetingId?.map((id:number) => state.report.views[id]))
    
    const pastMeetingId = useSelector((state:RootState)=>{
        const arr = Object.keys(state.report.questionsByMeetingId).sort(function (a:string,b:string):number{
            return parseInt(b) - parseInt(a)
        })
        console.log(arr)
        return arr.indexOf(meetingId!) + 1 > arr.length -1 ? null:arr.indexOf(meetingId!) + 1
        
    })

    const pastQuestionsByMeetingId = useSelector((state:RootState)=>state.report.questionsByMeetingId[pastMeetingId!])
    const pastQuestions = useSelector((state:RootState)=>pastQuestionsByMeetingId?.map((id:number) => state.report.questions[id]))
    const pastViewsByMeetingId = useSelector((state:RootState)=>state.report.viewsByMeetingId[pastMeetingId!])
    const pastViews = useSelector((state:RootState)=>pastViewsByMeetingId?.map((id:number) => state.report.views[id]))

    console.log(meetingId)
    console.log(pastMeetingId)
    // console.log(pastQuestions)
    // console.log(pastViews)

    if (!questions && !views) {
        return (<div></div>);
    }
    return (
        <div className='report-container'>
            {/* <Col md={1}> */}
            {/* <Toggler /> */}
            {/* <Backdrop open={isDrawerOpen}/> */}
            {/* <ReportNavbar open = {isDrawerOpen} setDrawerOpen={setDrawerOpen}/> */}
            <div className='report-desktop-first-row'>
                <div className='report-snap-container'>
                    <div className="report-peak-view-outer">
                        <div className="report-header"><span>Peak Views</span></div>
                        <ReportPeakViews data={views} pastData={pastViews}/>
                    </div>
                    <div className="report-total-questions-outer">
                        <div className="report-header"><span>Total Questions</span></div>
                        <ReportTotalQuestions data={questions} pastData={pastQuestions}/>
                    </div>
                </div>
                <div className="views-chart-outer">
                    <div className="report-header"><span>Views</span></div>
                    <ViewsChart data={views}/>
                </div>
            </div>
            <div>
                <div className="questions-from-chart-outer">
                    <div className="report-header"><span>Your Questions From</span></div>
                    <QuestionFromChart data={questions}/>
                </div>
                <div className="questions-pie-chart-outer">
                    <div className="report-header"><span>Your Questions Analysis</span></div>
                    <QuestionsPieChart data={questions}/>
                </div>
                <div className="question-likes-rank-outer">
                    <div className="report-header"><span>Most Liked Questions</span></div>
                    <QuestionLikesRank data={questions}/>
                </div>
            </div>
            {/* </Col> */}
        </div>
    )
}
