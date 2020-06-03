import React from 'react'
import './ReportNavbar.scss'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'

export const ReportNavbar:React.FC<any> = (props) => {
    // for (const questionKey in questions){
    //     objMeetings[questions[questionKey].meetingid] = questions[questionKey].meetingscheduletime
    // }
    return (
        // <nav className='side-drawer'>
        //     <ul className='side-drawer-items'>
        //         <li>Most Recent</li>
        //         <li>Overall</li>
        //         <li>Past Events</li>
        //     </ul>
        // </nav>
        <Navbar bg="light" expand="xl" className="report-navbar">
        <Navbar.Toggle onClick={()=>props.setDrawerOpen(!props.open)}className='report-nav-toggler' aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto flex-column report-navbar-nav">
            <Nav.Link href="#">Most Recent</Nav.Link>
            <Nav.Link href="#">Overall</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="/report/2">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
}

