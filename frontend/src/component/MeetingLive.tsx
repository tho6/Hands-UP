import React, { useEffect } from 'react';
import './MeetingLive.scss';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMeetingLive } from '../redux/meetinglive/thunk';
import { RootState } from '../store';
import { IMeetingLive } from '../redux/meetinglive/reducers';
// import Moment from 'react-moment';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'

const MeetingLiveCard: React.FC<{ meeting: IMeetingLive }> = (props) => {
    return (<>
        <Card className="meetingCard">
            <Card.Body>
                <div className="liveIcon"><i className="fas fa-video fa-3x"></i></div>
                <div><b>{props.meeting.name}</b></div>
                <div>Meeting code: {props.meeting.code}</div>
                {/* <div>{props.meeting.date}</div> */}
                <div>Host by: {props.meeting.host}</div>
                <div className="joinButton"><Button variant="success" className="joinButtonGreen"><b>JOIN</b></Button>{' '}</div>
            </Card.Body>
        </Card>
    </>);
}

export function MeetingLive() {
    const meetings = useSelector((state: RootState) => state.meetingsLive.meetingsLive)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMeetingLive)
    }, [dispatch])

    return (
        <div>
            <h2>Live</h2>
            {
                meetings.map((meeting) => <MeetingLiveCard meeting={meeting} />)
            }
        </div>
    )
}