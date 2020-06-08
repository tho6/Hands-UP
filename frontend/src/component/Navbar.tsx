import React, { useState, useEffect } from 'react';
import './Navbar.scss'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logoutAccount } from '../redux/auth/thunk';
import { NavLink } from 'react-router-dom';
import { closeNav, openNav } from '../redux/mainNav/actions';

export default function Navbar() {
    const pic = useSelector((state: RootState) => state.auth.personInfo?.picture)
    const userId = useSelector((state: RootState) => state.auth.personInfo?.userId)
    // const isAuthenticated = useSelector((state:RootState)=>state.auth.isAuthenticated)
    const guestId = useSelector((state: RootState) => state.auth.personInfo?.guestId)
    const isMainNavBarOpen = useSelector((state: RootState) => state.mainNav.isOpen)
    const dispatch = useDispatch();
    // const [isMainNavBarOpen, setMainNavBar] = useState(false)
    // const ulStyle = {justify-content: 123}
    const [isShow, setIsShow] = useState(false);
    useEffect(() => {
        const scrollHandler = () => {
            if (window.scrollY > 280) return setIsShow(true);
            if (window.scrollY <= 280) return setIsShow(false);
        };
        window.addEventListener('scroll', scrollHandler);

        return () => {
            window.removeEventListener('scroll', scrollHandler);
        };
    }, []);
    return (
        <>
        <nav className={`main-navbar-nav ${isMainNavBarOpen?'main-navbar-nav-move':''}`}>
            <i className="fas fa-bars humbugger-toggler" onClick={()=>{
                isMainNavBarOpen?dispatch(closeNav()):dispatch(openNav())
            }}></i>

                <NavLink to="/" className="link-text" id='logo-text' onClick={() => dispatch(closeNav())}>
                    <img src={'/hand-logo.png'} className={isShow ? 'main-nav-bar-logo-small' : 'main-nav-bar-logo-big'} alt="HANDS UP logo" />
                    HANDS UP
                </NavLink>
                <ul className={isMainNavBarOpen ? "mainNavBarOpen main-navbar-ul" : "main-navbar-ul"}>
                    {userId && (<>
                        <li className="main-navbar-item hover-effect-navlink">
                            <NavLink activeClassName='hover-effect-navlink' to="/event" onClick={() => dispatch(closeNav())}>Event</NavLink>
                        </li>
                        <li className="main-navbar-item hover-effect-navlink "><NavLink activeClassName='hover-effect-navlink' to="/report/past" onClick={() => dispatch(closeNav())}>Report</NavLink></li>
                        <li className="main-navbar-item hover-effect-navlink">
                            {pic != null && <img src={pic} className='main-navbar-nav-personal-icon' alt="icon" />}
                            <button className='logout-button' onClick={() => {
                                dispatch(logoutAccount())
                                dispatch(closeNav())
                            }}>Logout</button>
                        </li>
                    </>)}
                    {guestId && !userId &&
                        <li className="main-navbar-item login-btn">
                            <a href={`https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&scope=profile+email&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URL}`} rel="noopener noreferrer">Google Login</a>
                        </li>
                    }
                </ul>
            </nav>
            {/* <nav className='navbar'> */}
            {/*                     
                    <Nav defaultActiveKey="/" className='main-nav'>
                    <a href="/">
                        <span className="link-text" id='logo-text'>
                        <img src={'/hand-logo.png'} alt="HANDS UP logo" />
                        HANDS UP
                        </span>
                    </a>
                    {userId && (<>
                    <Nav.Item className = 'main-nav-item'>
                        <Nav.Link className = 'main-nav-link' eventKey='Event'>Event</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className = 'main-nav-item'>
                        <Nav.Link className = 'main-nav-link' href="/report">Report</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className = 'main-nav-item'>
                        {<Nav.Link className = 'main-nav-link' eventKey="logout" onClick={()=>dispatch(logoutAccount())}>
                            {pic != null && <img src={pic} alt="icon"/>}
                            Logout
                        </Nav.Link>}
                    </Nav.Item>
                    
                    </>)}
                    {guestId && !userId && <Nav.Item className = 'main-nav-item'><GoogleLogin /></Nav.Item>}
                    </Nav> */}
            {/* <ul className='navbar-nav'>  
            
                <div className="spacer"></div>
                {(userId && (
                    <>
                <li className="nav-item">
                    <a href="#" className="nav-link">
                        <span className="link-text">
                            Event
                        </span>
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link">
                        <span className="link-text">
                            Report
                        </span>
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link">
                        <span className="link-text">
                        
                        </span>
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link">
                        {pic != null && <img src={pic}/>}
                        <span className="link-text">
                        Logout
                        </span>
                    </a>
                </li>
                </>))}
            </ul>
        </nav> */}

        </>
    )
}