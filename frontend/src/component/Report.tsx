import React, { useEffect, useState } from 'react'
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
import { ReportSideDrawer } from './ReportSideDrawer';
import { closeSideDrawer, openSideDrawer } from '../redux/mainNav/actions';
import { ReportPopTable } from './ReportPopTable';
import { Backdrop } from './Backdrop';
import NoDataLottie from './NoDataLottie';

// created_at: "2020-06-20T02:00:00.000Z"
// facebook: 3
// handsup: 5
// id: 1
// meetingid: 1
// youtube: 1
export function Report() {
    const dispatch = useDispatch();
    // const [isDrawerOpen, setDrawerOpen] = useState(false)
    const [reportPop, setReportPop] = useState(false)
    const [reportPopData, setReportPopData] = useState({} as {header:string, columns: string[], data:string[][]})
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
            return  parseInt(a) - parseInt(b)
        })
        // need comment for others to understand why `<= 0`
        const idx = arr.indexOf(meetingId!)  <= 0 ? null:arr.indexOf(meetingId!) - 1
        console.log(idx)
        console.log(arr)
        if(idx){
            console.log(arr[idx])
        }
        return idx !== null?arr[idx]:null
    })
    console.log(pastMeetingId)

    const pastQuestionsByMeeting = useSelector((state:RootState)=>state.report.questionsByMeetingId) 
    const pastQuestionsByMeetingId = useSelector((state:RootState)=>state.report.questionsByMeetingId[pastMeetingId!])
    const pastQuestions = useSelector((state:RootState)=>pastQuestionsByMeetingId?.map((id:number) => state.report.questions[id]))
    const pastViewsByMeetingId = useSelector((state:RootState)=>state.report.viewsByMeetingId[pastMeetingId!])
    const pastViews = useSelector((state:RootState)=>pastViewsByMeetingId?.map((id:number) => state.report.views[id]))
    const isSideDrawerOpen = useSelector((state:RootState)=>state.mainNav.isSideDrawerOpen)

    if (!questions && !views) {
        return (<div style={{backgroundColor:"#EFEFEF"}}>
        <ReportSideDrawer />
        <div className={isSideDrawerOpen?'report-side-drawer-navbar-toggle-button report-side-drawer-toggle-button-on no-data-toggle-btn':'report-side-drawer-navbar-toggle-button report-side-drawer-toggle-button-off no-data-toggle-btn'} onClick={() => isSideDrawerOpen?dispatch(closeSideDrawer()):dispatch(openSideDrawer())}>
            <i className="fas fa-angle-right report-side-drawer-navbar-icon"></i>
        </div>
        <NoDataLottie />
        </div>)
    }
    console.log(meetingId)
    console.log(pastMeetingId)
    console.log(pastQuestionsByMeeting)
    console.log(pastQuestionsByMeetingId)
    console.log(pastViews)

    return (<>
                <ReportSideDrawer />
                <div className={reportPop?'report-container report-container-pop-up-report-open':"report-container"}>
                        {reportPop&&<Backdrop closeSideNav={()=>null}/>}
                    <div onClick={()=>setReportPop(false)} className={reportPop?"report-pop-table-outer z-index-set-to-fifty":""}>
                    <>
                        <div onClick={(e)=>e.stopPropagation()} className={`report-modal ${reportPop?'show':'not-show'} z-index-set-to-fifty`}>
                            {/* <div className="report-pop-report-outer"> */}
                                <div>
                                
                                    <ReportPopTable reportPopData={reportPopData}/>
                                </div>
                     
                                {/* </div> */}
                        
                        </div>
                        </>
                    </div>
                    <div className={isSideDrawerOpen?'report-side-drawer-navbar-toggle-button report-side-drawer-toggle-button-on':'report-side-drawer-navbar-toggle-button report-side-drawer-toggle-button-off'} onClick={() => isSideDrawerOpen?dispatch(closeSideDrawer()):dispatch(openSideDrawer())}>
                        <i className="fas fa-angle-right report-side-drawer-navbar-icon"></i>
                    </div>
                    
                    <header className='report-container-header-row'>
                        <span className='report-container-header'>{questions? questions[0].meetingname:''}</span>
                        <span className='report-container-secondary-header'>{questions? new Date(questions[0].meetingscheduletime).toLocaleString():''}</span>
                    </header>
                    {/* <Col md={1}> */}
                    {/* <Toggler /> */}
                    {/* <Backdrop open={isDrawerOpen}/> */}
                    {/* <ReportNavbar open = {isDrawerOpen} setDrawerOpen={setDrawerOpen}/> */}

                    <div className='report-desktop-first-row'>
                        <div className='report-snap-container'>
                            <div className="report-peak-view-outer">
                                <div className="report-header"><span>Peak Views (compared with last meeting)</span></div>
                                <ReportPeakViews data={views} pastData={pastViews}/>
                            </div>
                            <div className="report-total-questions-outer">
                                <div className="report-header"><span>Total Questions (compared with last meeting)</span></div>
                                <ReportTotalQuestions data={questions} pastData={pastQuestions}/>
                            </div>
                        </div>
                        <div className="views-chart-outer">
                            <div className="report-header"><span>Views</span></div>
                            <ViewsChart data={views}/>
                        </div>
                    </div>
                    <div className='report-desktop-second-row'>
                        <div className="questions-from-chart-outer">
                            <div className="report-header"><span>Your Questions From</span></div>
                            <QuestionFromChart setReportPopData={(data)=>setReportPopData(data)} setReportPopOpen={()=>setReportPop(true)} data={questions}/>
                        </div>
                        <div className="questions-pie-chart-outer">
                            <div className="report-header"><span>Your Questions Analysis</span></div>
                            <QuestionsPieChart setReportPopData={(data)=>setReportPopData(data)} setReportPopOpen={()=>setReportPop(true)} data={questions}/>
                        </div>
                        <div className="question-likes-rank-outer">
                            <div className="report-header"><span>Most Liked Questions</span></div>
                            <QuestionLikesRank data={questions}/>
                        </div>
                    </div>
                </div>
            </>
    )
}
