import React, { useState } from 'react';
import { MeetingLive } from './MeetingLive';
import { MeetingPast } from './MeetingPast';
import CreateMeeting from './MeetingCreate';
// CSS
import './Meetings.scss'
import Container from 'react-bootstrap/Container'
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function Meetings() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Container className="Container">
                <Row>
                    <Col md="auto">
                        <Button variant="success" className='create-meeting-btn' onClick={handleShow}><b>CREATE<br></br>MEETING</b>
                        </Button>{' '}

                        <Modal className="popup" show={show} onHide={handleClose} centered>
                            <Modal.Header closeButton>
                                <Modal.Title><h4>Create meeting</h4>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <CreateMeeting close={handleClose} />
                            </Modal.Body>
                        </Modal>
                    </Col>
                </Row>
                <Row>
                    <Col><MeetingLive /></Col>
                    <Col><MeetingPast /></Col>
                </Row>
            </Container>
        </>
    );
}

export default Meetings;