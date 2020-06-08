import './ReportSideDrawer.scss'
import React from 'react'
import Backdrop from './Backdrop'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { NavLink } from 'react-router-dom'

export const ReportSideDrawer = () => {
    const isSideDrawerOpen = useSelector((state:RootState)=>state.mainNav.isSideDrawerOpen)
   
    return (
        <div className={isSideDrawerOpen?'report-side-drawer-navbar-container-on report-side-drawer-navbar-container':'report-side-drawer-navbar-container report-side-drawer-navbar-container-off'}>
            {isSideDrawerOpen &&<Backdrop />}

             <nav className={isSideDrawerOpen?"report-side-drawer-navbar report-side-drawer-navbar-on":"report-side-drawer-navbar"}>
                <ul className={isSideDrawerOpen?".report-side-drawer-navbar-nav-on report-side-drawer-nav":"report-side-drawer-nav"}>
                    <li className="report-side-drawer-item"><span className="report-side-drawer-item-header">Reports</span></li>
                    <li className="report-side-drawer-item hover-effect-navlink"><i className="far fa-newspaper"></i><span>Most Recent</span></li>
                    <NavLink className='hover-effect-navlink' to='/report/overall'><li className="report-side-drawer-item hover-effect-navlink"><i className="fas fa-tachometer-alt"></i><span>Overall</span></li></NavLink>
                    <NavLink className='hover-effect-navlink' to='/report/past'><li className="report-side-drawer-item hover-effect-navlink"><i className="fas fa-chart-line"></i><span>Past Reports</span></li></NavLink>
                </ul>
            </nav>
        </div>
    )
}
