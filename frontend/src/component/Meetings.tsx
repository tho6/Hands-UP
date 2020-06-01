import React from 'react';
import './Meetings.scss';
import { MeetingLive } from './MeetingLive';
import { MeetingPast } from './MeetingPast';

function Meetings() {
    return (
        <div className="Container">
            <div><MeetingLive /></div>
            <div><MeetingPast /></div>
        </div>
    );
}

export default Meetings;