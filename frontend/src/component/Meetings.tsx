import React from 'react';
import './Meetings.scss';
import { MeetingLive } from './MeetingLive';
import { MeetingPast } from './MeetingPast';

function Meetings() {
    return (
        <div className="meetingPage">
            <MeetingLive />
            <div className="meetingPast"><MeetingPast /></div>
        </div>
    );
}

export default Meetings;