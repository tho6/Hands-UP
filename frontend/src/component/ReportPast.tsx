import React from 'react'
import {ReportPastTable}from './ReportPastTable'
import './ReportPast.scss'
import { ReportSideDrawer } from './ReportSideDrawer'
import { closeSideDrawer, openSideDrawer } from '../redux/mainNav/actions';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';

export const ReportPast = () => {
    const isSideDrawerOpen = useSelector((state:RootState)=>state.mainNav.isSideDrawerOpen)
    const dispatch = useDispatch()
    return (
        <>
        <ReportSideDrawer />
        <div className='report-past-container'>
            {/* <div className="report-header"><span>Past Report</span></div> */}
            <div style={{width:"100%",height:"27px"}}>
            <div className={isSideDrawerOpen?'report-side-drawer-navbar-toggle-button report-side-drawer-toggle-button-on':'report-side-drawer-navbar-toggle-button report-side-drawer-toggle-button-off'} onClick={() => isSideDrawerOpen?dispatch(closeSideDrawer()):dispatch(openSideDrawer())}>
                <i className="fas fa-angle-right report-side-drawer-navbar-icon"></i>
            </div>
            </div>
            <div className="report-past-table-outer">
                <ReportPastTable />
            </div>
        </div>
        </>
    )
}
