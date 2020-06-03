import React from 'react';
import './Meetings.scss';
import { MeetingLive } from './MeetingLive';
import { MeetingPast } from './MeetingPast';
import Container from 'react-bootstrap/Container'


function Meetings() {
    return (
        <Container className="Container">
            <div><MeetingLive /></div>
            <div><MeetingPast /></div>
        </Container>
    );
}

export default Meetings;