import React from 'react'
import {ReportPastTable}from './ReportPastTable'
import './ReportPast.scss'

export const ReportPast = () => {
    return (
        <div className='report-past-container'>
            {/* <div className="report-header"><span>Past Report</span></div> */}
            <div className="report-past-table-outer">
                <ReportPastTable />
            </div>
        </div>
    )
}
