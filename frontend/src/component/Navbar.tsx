import React from 'react';
import './Navbar.scss'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Nav } from 'react-bootstrap';
import { logoutAccount } from '../redux/auth/thunk';

export default function Navbar() {
    const pic = useSelector((state:RootState)=>state.auth.personInfo?.picture)
    const userId = useSelector((state:RootState)=>state.auth.personInfo?.userId)
    const dispatch = useDispatch();
    // const ulStyle = {justify-content: 123}
    return (
        <>
        {/* <nav className='navbar'> */}
                    
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
                        <Nav.Link className = 'main-nav-link' eventKey="logout" onClick={()=>dispatch(logoutAccount())}>
                        {pic != null && <img src={pic}/>}
                        Logout
                        </Nav.Link>
                    </Nav.Item>
                    </>)}
                    </Nav>

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