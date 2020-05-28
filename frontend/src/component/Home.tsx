import React from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import './Home.scss'
import { useFormState } from 'react-use-form-state'
// const form = useFormState()
export default function Home() {
    return (
        <div>
            <Container id='Home'>
                <Row>
                    <Col md={4} className='headings'>
                        <h2>Hands UP</h2>
                        <h4>Help You Grab Comments from Facebook Youtube in your LIVE !!!</h4>
                        <h6>Join NOW!!</h6>
                        <textarea placeholder="Enter Room Code"></textarea>
                    </Col>
                    <Col md={8}>

                    </Col>
                </Row>
            </Container>
        </div>
    )
}
