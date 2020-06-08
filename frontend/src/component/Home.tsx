import React from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import './Home.scss'
// const form = useFormState()
export default function Home() {
    return (
            <div>
                <div id='Home' className="background">
                    <div className='d-flex'>
                        <Col md={5} className='headings'>
                            <h2>Grab comments from your Facebook & YouTube live streams at a glance.</h2>
                            <h4>Hands UP</h4>
                            <h6>Join NOW!</h6>
                            <textarea placeholder="Enter Meeting code"></textarea>
                        </Col>
                        <Col md={7}>

                        </Col>
                    </div>
                </div>
            </div>
    )
}
