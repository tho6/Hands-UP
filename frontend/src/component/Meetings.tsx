import React, { useState, useEffect } from 'react';
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
import { useDispatch } from 'react-redux';
import { fetchMeeting } from '../redux/meeting/thunk';

function Meetings() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMeeting(0))
    })
    return (
        <>
            <Container className="Container">
                <Row>
                    <Col md="auto">
                        <Button variant="danger" className='create-meeting-btn' onClick={handleShow}><b>CREATE<br></br>MEETING</b>
                        </Button>{' '}

                        <Modal className="create-meeting-popup" show={show} onHide={handleClose} centered>
                            <Modal.Header className="modal-header" closeButton>
                                <Modal.Title className="create-meeting-header"><h4>Create meeting</h4>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="create-meeting-body">
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