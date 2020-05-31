import React from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import './Home.scss'
import { useFormState } from 'react-use-form-state'
// const form = useFormState()
export default function Home() {
    return (
            <div>
                <Container id='Home' className="background">
                    <Row>
                        <Col md={5} className='headings'>
                            <h2>Grab comments from your Facebook & YouTube live streams at a glance.</h2>
                            <h4>Hands UP</h4>
                            <h6>Join NOW!</h6>
                            <textarea placeholder="Enter Meeting code"></textarea>
                        </Col>
                        <Col md={7}>

                        </Col>
                    </Row>
                </Container>
            </div>
    )
}
