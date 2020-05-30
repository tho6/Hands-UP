import React from 'react'
import { Nav } from 'react-bootstrap'
import './ReportNavbar.scss'

export function ReportNavbar() {
    
    return (
        <Nav defaultActiveKey="/" className="report-navbar flex-column">
            <Nav.Link href="/#">ReportActive</Nav.Link>
            <Nav.Link eventKey="link-1">Link</Nav.Link>
            <Nav.Link eventKey="link-2">Link</Nav.Link>
        </Nav>    
    )
}
