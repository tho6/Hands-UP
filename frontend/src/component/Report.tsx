import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReportQuestions, fetchReportViews } from '../redux/report/thunk';
import { ReportNavbar } from './ReportNavbar';
import { Container, Col } from 'react-bootstrap';
import Toggler from './Toggler';
import { Backdrop } from '@material-ui/core';
import { useRouteMatch } from 'react-router-dom';
import { RootState } from '../store';
import {ViewsChart} from './ViewsChart';
import './Report.scss'
import { QuestionFromChart } from './QuestionFromChart';
import { QuestionsPieChart } from './QuestionsPieChart';

// created_at: "2020-06-20T02:00:00.000Z"
// facebook: 3
// handsup: 5
// id: 1
// meetingid: 1
// youtube: 1
export function Report() {
    const dispatch = useDispatch();
    const [isDrawerOpen, setDrawerOpen] = useState(false)
    const match = useRouteMatch<{loc?:string}>()
    const meetingId = match.params.loc
    
    useEffect(() => {
        dispatch(fetchReportQuestions('all'))
        dispatch(fetchReportViews('all'))
        console.log(match.params.loc)

    }, [])

    const questionsByMeetingId = useSelector((state:RootState)=>state.report.questionsByMeetingId[meetingId!])
    const questions = useSelector((state:RootState)=>questionsByMeetingId?.map((id:number) => state.report.questions[id]))
    const viewsByMeetingId = useSelector((state:RootState)=>state.report.viewsByMeetingId[meetingId!])
    const views = useSelector((state:RootState)=>viewsByMeetingId?.map((id:number) => state.report.views[id]))

    console.log(questions)
    console.log(questionsByMeetingId)
    
    return (
        <Container className='report-container'>
            {/* <Col md={1}> */}
            {/* <Toggler /> */}
            {/* <Backdrop open={isDrawerOpen}/> */}
            <ReportNavbar open = {isDrawerOpen} setDrawerOpen={setDrawerOpen}/>
            <ViewsChart data={views}/>
            <QuestionFromChart data={questions}/>
            <QuestionsPieChart data={questions}/>
            {/* </Col> */}
        </Container>
    )
}
