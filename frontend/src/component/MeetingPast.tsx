import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMeetingPast } from '../redux/meetingpast/thunk';
import { RootState } from '../store';
import { IMeetingPast } from '../redux/meetingpast/reducers';
// CSS
import './MeetingPast.scss';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const MeetingPastCard: React.FC<{ meeting: IMeetingPast }> = (props) => {
    return (<>
        {/* <Container className="meetingPastContainer"> */}
        <Card className="meetingPastCard">
            <Card.Body>
                <Row>
                    <Col md={9}>
                        <div><b>{props.meeting.name}</b></div>
                        <div>Meeting code: {props.meeting.code}</div>
                        {/* <div>{props.meeting.date}</div> */}
                        <div>Host by: {props.meeting.host}</div>
                    </Col>
                    {/* <div className="calendarIconDiv"> */}
                        <Col md={3}>
                            <Row className="past-icon">
                                <i className="far fa-calendar-alt fa-3x"></i>
                            </Row>
                            <Row className="past-icon">
                                <Button variant="secondary" className="viewButtonBlue"><b>VIEW</b></Button>{' '}
                            </Row>
                        </Col>
                    {/* </div> */}
                </Row>
            </Card.Body>
        </Card>
        {/* </Container> */}
    </>);
}

export function MeetingPast() {
    const meetings = useSelector((state: RootState) => state.meetingsPast.meetingsPast)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMeetingPast)
    }, [dispatch])

    return (
        <div>
            <h2 className="headline"><b>Past</b></h2>
            {
                meetings.map((meeting) => <MeetingPastCard meeting={meeting} />)
                // meetings.map((meeting) => <div>{meeting.name}</div>)
            }
        </div>
    )
}