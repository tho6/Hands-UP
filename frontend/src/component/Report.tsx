import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchReportQuestions, fetchReportViews } from '../redux/report/thunk';
import { ReportNavbar } from './ReportNavbar';

export function Report() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchReportQuestions('all'))
        dispatch(fetchReportViews('all'))
    }, [])
    return (
        <div>
            <ReportNavbar />
        </div>
    )
}
