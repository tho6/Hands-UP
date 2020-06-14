import React, { useState, useEffect } from 'react';
import './Navbar.scss'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logoutAccount, changeGuestName } from '../redux/auth/thunk';
import { NavLink } from 'react-router-dom';
import { closeNav, openNav } from '../redux/mainNav/actions';
import { message } from '../redux/rooms/actions';
import { Popover, OverlayTrigger } from 'react-bootstrap';

export default function Navbar() {
    const pic = useSelector((state: RootState) => state.auth.personInfo?.picture)
    const userId = useSelector((state: RootState) => state.auth.personInfo?.userId)
    // const isAuthenticated = useSelector((state:RootState)=>state.auth.isAuthenticated)
    const guestId = useSelector((state: RootState) => state.auth.personInfo?.guestId)
    const guestName = useSelector((state: RootState) => state.auth.personInfo?.userName)
    const isMainNavBarOpen = useSelector((state: RootState) => state.mainNav.isOpen)
    const dispatch = useDispatch();
    // const [isMainNavBarOpen, setMainNavBar] = useState(false)
    // const ulStyle = {justify-content: 123}
    const [isShow, setIsShow] = useState(false);
    const [editName, setEditName] = useState(false);
    const [gName, setGName] = useState('');
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
    useEffect(() => {
        if (!guestName) return;
        setGName(guestName)
    }, [guestName, setGName]);
    return (
        <>
            <nav className={`main-navbar-nav ${isMainNavBarOpen ? 'main-navbar-nav-move' : ''}`}>
                <i className="fas fa-bars humbugger-toggler" onClick={() => {
                    isMainNavBarOpen ? dispatch(closeNav()) : dispatch(openNav())
                }}></i>

                <NavLink to="/" className="link-text" id='logo-text' onClick={() => dispatch(closeNav())}>
                    <img src={'/hand-logo.png'} className={isShow ? 'main-nav-bar-logo-small' : 'main-nav-bar-logo-big'} alt="HANDS UP logo" />
                    HANDS UP
                </NavLink>
                <ul className={isMainNavBarOpen ? "mainNavBarOpen main-navbar-ul" : "main-navbar-ul"}>
                    {userId && (<>
                        <li className="main-navbar-item hover-effect-navlink">
                            <NavLink activeClassName='hover-effect-navlink' to="/meetings" onClick={() => dispatch(closeNav())}>My Meetings</NavLink>
                        </li>
                        <li className="main-navbar-item hover-effect-navlink "><NavLink activeClassName='hover-effect-navlink' to="/report/overall/all" onClick={() => dispatch(closeNav())}>Report</NavLink></li>
                        <li className="main-navbar-item hover-effect-navlink">

                             
                        <OverlayTrigger
                                    onExited={()=>setGName(guestName!)}
                                    rootClose
                                    trigger={["click","focus"]}
                                    key='bottom'
                                    placement='bottom'
                                    overlay={
                                        <Popover className='main-nav-popover' id={`popover-positioned-bottom`}>
                                        <Popover.Title as="h3">Edit Name</Popover.Title>
                                        <Popover.Content>
                                                    <input  autoFocus type="text" value={gName!} onChange={(e) => {
                                                        if (e.target.value.length > 20) return;
                                                        setGName(e.target.value)
                                                    }}
                                                    />
                                                    <button className='home-background-enter-button btn btn-info' onClick={() => {
                                                        document.body.click()
                                                        if (gName === guestName) return;
                                                        if (gName.trim().length === 0) {
                                                            dispatch(message(true, 'Name cannot be Empty!'))
                                                            return
                                                        }
                                                        dispatch(changeGuestName(guestId!, gName!))
                                                    }}>Save
                                                    </button>                                        
                                        </Popover.Content>
                                        </Popover>
                                    }
                                    >
                                        {pic && <div><img src={pic} className='main-navbar-nav-guest-icon' alt="icon" onClick={() => (setEditName(!editName))} /></div>}
                                    </OverlayTrigger>
                                
                            <button className='logout-button' onClick={() => {
                                dispatch(logoutAccount())
                                dispatch(closeNav())
                                setEditName(false);
                            }}>Logout</button>
                        </li>
                    </>)}
                    {guestId && !userId &&
                        <>
                            <li className="main-navbar-item login-btn">
                                {/* {pic != null && <img src={'/icon/1.jpg'} className='main-navbar-nav-guest-icon' alt="icon" onClick={() => (setEditName(!editName))} />} */}
                                <>
                                
                                    <OverlayTrigger
                                    onExited={()=>setGName(guestName!)}
                                    rootClose
                                    trigger={["click","focus"]}
                                    key='bottom'
                                    placement='bottom'
                                    overlay={
                                        <Popover className='main-nav-popover' id={`popover-positioned-bottom`}>
                                        <Popover.Title as="h3">Edit Name</Popover.Title>
                                        <Popover.Content>
                                                    <input  autoFocus type="text" value={gName!} onChange={(e) => {
                                                        if (e.target.value.length > 20) return;
                                                        setGName(e.target.value)
                                                    }}
                                                    />
                                                    <button className='home-background-enter-button btn btn-info' onClick={() => {
                                                        document.body.click()
                                                        if (gName === guestName) return;
                                                        if (gName.trim().length === 0) {
                                                            dispatch(message(true, 'Name cannot be Empty!'))
                                                            return
                                                        }
                                                        dispatch(changeGuestName(guestId!, gName!))
                                                    }}>Save
                                                    </button>                                        
                                        </Popover.Content>
                                        </Popover>
                                    }
                                    >
                                        {pic && <div><img src={pic} className='main-navbar-nav-guest-icon' alt="icon" onClick={() => (setEditName(!editName))} /></div>}
                                    </OverlayTrigger>
                                
                                </>
                                {/* {editName && (
                                    <OverlayTrigger
                                        trigger="click"
                                        key='bottom'
                                        placement='bottom'
                                        overlay={
                                            <Popover id={`popover-positioned-bottom`}>
                                                <Popover.Title as="h3">{`Popover bottom`}</Popover.Title>
                                                <Popover.Content>
                                                    <input onBlur={(e) => {
                                                        console.log(e)
                                                        setEditName(false)
                                                    }} autoFocus type="text" value={gName!} onChange={(e) => {
                                                        if (e.target.value.length > 20) return;
                                                        setGName(e.target.value)
                                                    }}
                                                    />
                                                    <button className='home-background-enter-button btn btn-info' onMouseDown={() => {
                                                        setEditName(false)
                                                        if (gName === guestName) return;
                                                        if (gName.trim().length === 0) {
                                                            dispatch(message(true, 'Name cannot be Empty!'))
                                                            return
                                                        }
                                                        dispatch(changeGuestName(guestId!, gName!))
                                                    }}>Save
                                    </button>
                                                </Popover.Content>
                                            </Popover>
                                        }
                                    >
                                        <img src={'/icon/1.jpg'} className='main-navbar-nav-guest-icon' alt="icon" onClick={() => (setEditName(!editName))} />
                                    </OverlayTrigger>
                                    )
                                    
                                } */}
                                < a href={`https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&scope=profile+email&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URL}`} rel="noopener noreferrer">Google Login</a>
                            </li>
                        </>
                    }
                </ul>
            </nav>
        </>)
}
