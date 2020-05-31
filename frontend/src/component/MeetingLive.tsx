import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMeetingLive } from '../redux/meetinglive/thunk';
import { RootState } from '../store';
import { IMeetingLive } from '../redux/meetinglive/reducers';
// import Moment from 'react-moment';
// CSS
import './MeetingLive.scss';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const MeetingLiveCard: React.FC<{ meeting: IMeetingLive }> = (props) => {
    return (<>
        <Container>
            <Card className="meetingLiveCard">
                <Card.Body>
                    <Row>
                        <Col md={3}>
                            <div className="liveIcon"><i className="fas fa-video fa-3x"></i></div>
                        </Col>
                        <Col md={9}>
                            <div><b>{props.meeting.name}</b></div>
                            <div>Meeting code: {props.meeting.code}</div>
                            {/* <div>{props.meeting.date}</div> */}
                            <div>Host by: {props.meeting.host}</div>
                            <div className="joinButton"><Button variant="info" className="joinButtonGreen"><b>JOIN</b></Button>{' '}</div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
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
            <h2 className="headline"><b>Live</b></h2>
            {
                meetings.map((meeting) => <MeetingLiveCard meeting={meeting} />)
            }
        </div>
    )
}