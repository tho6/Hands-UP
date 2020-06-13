import './ReportSideDrawer.scss'
import React, { useState, useRef, useEffect } from 'react'
import {Backdrop} from './Backdrop'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { NavLink } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import { closeSideDrawer } from '../redux/mainNav/actions'
import { fetchMeeting } from '../redux/meeting/thunk'

export const ReportSideDrawer = () => {
    const isSideDrawerOpen = useSelector((state:RootState)=>state.mainNav.isSideDrawerOpen)
    const meetingsById = useSelector((state:RootState)=>state.meetings)

    const [activeMenu, setActiveMenu] = useState('main');
    const [menuHeight, setMenuHeight] = useState(null);
    const dropdownRef = useRef(false) as any
    const dispatch = useDispatch()
    const sortedMeetingId = Object.keys(meetingsById).sort(function(a,b){return parseInt(b) - parseInt(a)}).slice(0,5)
    const meetings = sortedMeetingId.map((id)=>{
        return {name: meetingsById[id].name, id: meetingsById[id].id}
    })
    console.log(meetings)
    useEffect(() => {
        // if(!dropdownRef.current?.firstChild)
       setMenuHeight(dropdownRef.current?.firstChild!.offsetHeight)
    }, [dropdownRef])
  
    function calcHeight(el:any) {
      const height = el.offsetHeight;
      setMenuHeight(height);
    }
    useEffect(() => {
        dispatch(fetchMeeting(0))
        dispatch(closeSideDrawer())
    }, [])

    return (
        <div className={isSideDrawerOpen?'report-side-drawer-navbar-container-on report-side-drawer-navbar-container':'report-side-drawer-navbar-container report-side-drawer-navbar-container-off'}>
            {isSideDrawerOpen &&<Backdrop closeSideNav={()=>dispatch(closeSideDrawer())}/>}
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
                        <NavLink className='hover-effect-navlink' to='/report/overall/all'><li className="report-side-drawer-item hover-effect-navlink"><i className="fas fa-tachometer-alt"></i><span>Overall</span></li></NavLink>
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
                            {meetings.map(el=>{
                                return (<NavLink className='hover-effect-navlink' to={`/report/${el.id}`}><li className="report-side-drawer-item hover-effect-navlink"><i className="fas fa-tachometer-alt"></i><span>{el.name}</span></li></NavLink>)
                            })}
                            {/* <NavLink className='hover-effect-navlink' to='#'><li className="report-side-drawer-item hover-effect-navlink"><i className="fas fa-tachometer-alt"></i><span>1</span></li></NavLink>
                            <NavLink className='hover-effect-navlink' to='#'><li className="report-side-drawer-item hover-effect-navlink"><i className="fas fa-chart-line"></i><span>2</span></li></NavLink> */}
                        </div>
                    </CSSTransition>
                    {/* </TransitionGroup> */}
                </ul>
            </nav>
        </div>
    )
}
