// import React, { useState, useRef, useEffect } from 'react'
// import './ReportSideDrawer.scss'
// import { CSSTransition } from 'react-transition-group';


// export const ReportSideDrawer = () => {
//     const [isSideDrawer, setSideDrawer] = useState(false)
//     return (
//         <div>
//             <nav className="report-side-drawer-navbar">
//                 <div className='report-side-drawer-navbar-toggle-button' onClick={() => setSideDrawer(!isSideDrawer)}>
//                     <i className="fas fa-angle-right report-side-drawer-navbar-icon"></i>
//                 </div>
//                 <DropDownMenu />
//                 {/* <ul className="report-side-drawer-nav">
//                     <li className="report-side-drawer-item">Most</li>
//                 </ul> */}
//             </nav>
//         </div>
//     )
// }

// function DropDownMenu() {
//     const [activeMenu, setActiveMenu] = useState('main')
//     const [menuHeight, setMenuHeight] = useState(null);
//     const dropdownRef = useRef(null);

//     useEffect(() => {
//         if (!dropdownRef.current) return
//         // @ts-ignore
//         setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
//     }, [])

//     function calcHeight(el: any) {
//         const height = el.offsetHeight;
//         setMenuHeight(height);
//     }

//     function DropDownItem(props: any) {
//         return (
//             <>
//                 <a href="#" className="menu-item" onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
//                     <span className="report-side-drawer-dropdown-left-icon"></span>
//                     {props.children}
//                     <span className="report-side-drawer-dropdown-right-icon"></span>
//                 </a>
//             </>
//         )
//     }
//     return (
//         <div className='report-side-drawer-dropdown' style={{ height: menuHeight }} ref={dropdownRef}>
//             <CSSTransition onEnter={calcHeight} in={activeMenu === 'main'} timeout={500} unmountOnExit classNames="message" addEndListener={((node, done) => { node.addEventListener('transitionend', done, false) })}>
//                 <div className="report-side-drawer-menu">
//                     <DropDownItem goToMenu="settings">Overall</DropDownItem>
//                     <DropDownItem goToMenu="recents">Most Recent</DropDownItem>
//                     <DropDownItem goToMenu="settings">Report</DropDownItem>
//                 </div>
//             </CSSTransition>
//             <CSSTransition
//                 in={activeMenu === 'recents'}
//                 timeout={500}
//                 classNames="menu-secondary"
//                 unmountOnExit
//                 onEnter={calcHeight}>
//                 <div className="report-side-drawer-menu">
//                     <DropDownItem goToMenu="settings">123</DropDownItem>
//                     <DropDownItem goToMenu="recents">456</DropDownItem>
//                     <DropDownItem goToMenu="settings">789</DropDownItem>
//                 </div>
//             </CSSTransition>
//         </div>
//     )
// }

import './ReportSideDrawer.scss'
import React from 'react'

export const ReportSideDrawer = () => {
    return (
        <div>
             <nav className="report-side-drawer-navbar">
//                 <div className='report-side-drawer-navbar-toggle-button' onClick={() => setSideDrawer(!isSideDrawer)}>
//                     <i className="fas fa-angle-right report-side-drawer-navbar-icon"></i>
//                 </div>
//             </nav>
        </div>
    )
}
