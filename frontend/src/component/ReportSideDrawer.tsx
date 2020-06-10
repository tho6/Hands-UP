import './ReportSideDrawer.scss'
import React, { useState, useRef, useEffect } from 'react'
import Backdrop from './Backdrop'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { NavLink } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

export const ReportSideDrawer = () => {
    const isSideDrawerOpen = useSelector((state:RootState)=>state.mainNav.isSideDrawerOpen)
    const [activeMenu, setActiveMenu] = useState('main');
    const [menuHeight, setMenuHeight] = useState(null);
    const dropdownRef = useRef(false) as any
  
    useEffect(() => {
        // if(!dropdownRef.current?.firstChild)
       setMenuHeight(dropdownRef.current?.firstChild!.offsetHeight)
    }, [dropdownRef])
  
    function calcHeight(el:any) {
      const height = el.offsetHeight;
      setMenuHeight(height);
    }

    return (
        <div className={isSideDrawerOpen?'report-side-drawer-navbar-container-on report-side-drawer-navbar-container':'report-side-drawer-navbar-container report-side-drawer-navbar-container-off'}>
            {isSideDrawerOpen &&<Backdrop />}
            <div className="report-side-drawer-header"><span className="report-side-drawer-item-header">Reports</span></div>
             <nav className={isSideDrawerOpen?"report-side-drawer-navbar report-side-drawer-navbar-on":"report-side-drawer-navbar"}>
                <ul style={{ height: menuHeight!}} ref={dropdownRef} className={isSideDrawerOpen?".report-side-drawer-navbar-nav-on report-side-drawer-nav":"report-side-drawer-nav"}>
                    {/* <TransitionGroup> */}
                    <CSSTransition
                    in={activeMenu === 'main'}
                    timeout={500}
                    classNames="menu-primary"
                    unmountOExit
                    onEnter={calcHeight}>
                        <div className='report-side-drawer-secondary'>
                            {/* <a href="#">123</a> */}
                        <NavLink to='#' className="report-side-drawer-item hover-effect-navlink report-side-drawer-click" onClick={()=>setActiveMenu('mostRecent')}><i className="far fa-newspaper"></i><span>Most Recent</span></NavLink>
                        <NavLink className='hover-effect-navlink' to='/report/overall'><li className="report-side-drawer-item hover-effect-navlink"><i className="fas fa-tachometer-alt"></i><span>Overall</span></li></NavLink>
                        <NavLink className='hover-effect-navlink' to='/report/past'><li className="report-side-drawer-item hover-effect-navlink"><i className="fas fa-chart-line"></i><span>Past Reports</span></li></NavLink>
                        </div>
                    </CSSTransition>

                    <CSSTransition
                    in={activeMenu === 'mostRecent'}
                    timeout={500}
                    classNames="menu-secondary"
                    unmountOnExit
                    onEnter={calcHeight}>
                        <div className='report-side-drawer-secondary'>
                            <NavLink className='report-side-drawer-item hover-effect-navlink' to='#' onClick={()=>setActiveMenu('main')}><i className="far fa-arrow-alt-circle-left"></i><span>Back</span></NavLink>
                            <NavLink className='hover-effect-navlink' to='#'><li className="report-side-drawer-item hover-effect-navlink"><i className="fas fa-tachometer-alt"></i><span>1</span></li></NavLink>
                            <NavLink className='hover-effect-navlink' to='#'><li className="report-side-drawer-item hover-effect-navlink"><i className="fas fa-chart-line"></i><span>2</span></li></NavLink>
                        </div>
                    </CSSTransition>
                    {/* </TransitionGroup> */}
                </ul>
            </nav>
        </div>
    )
}
