import React from 'react';
// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
// import { fetchMeetingPast } from '../redux/meetingpast/thunk';
import { RootState } from '../store';
// import { IMeetingPast } from '../redux/meetingpast/reducers';
// CSS
import './MeetingPast.scss';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import moment from 'moment';

// const MeetingPastCard: React.FC<{ meeting: IMeetingPast }> = (props) => {
export function MeetingPast() {
    const meetings = useSelector((state: RootState) => state.meetings)
    // const dispatch = useDispatch();
    const arrMeetings = []
    for (const meetingId in meetings) {
        const duration = (Date.now() - new Date(meetings[meetingId].date_time).getTime())
        if (duration >= 43200000) {
            arrMeetings.push(meetings[meetingId])
        }
    }
    // useEffect(() => {
    //     dispatch(fetchMeetingPast())
    // }, [dispatch])
    return (<>
        <div className="meetingPast">
            <h2 className="headline"><b>Past</b></h2>
            <div className="meetingPast-content">
                {arrMeetings.map((meeting) => {
                    return (<Card className="meetingPastCard">
                        <Card.Body>
                            <Row>
                                <Col md={10}>
                                    <div><b>{meeting.name}</b></div>
                                    <div>{moment(meeting.date_time).format('D MMM YYYY h:mma')}</div>
                                    <div>Code: {meeting.code}</div>
                                    <div>Host by: {meeting.owner_id}</div>
                                </Col>
                                <Col md={2}>
                                    <Row className="past-icon">
                                        <i className="far fa-calendar-alt fa-3x"></i>
                                    </Row>
                                    <Row className="past-icon">
                                        <Button variant="secondary" className="viewButtonBlue">VIEW</Button>{' '}
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>)
                })}
            </div>
        </div>
    </>);
}

// export function MeetingPast() {
//     const meetings = useSelector((state: RootState) => state.meetingsPast.meetingsPast)
//     const dispatch = useDispatch();

//     useEffect(() => {
//         dispatch(fetchMeetingPast)
//     }, [dispatch])

//     return (
//         <div className="meetingPast">
//             <h2 className="headline"><b>Past</b></h2>
//             <div className="meetingPast-content">
//                 {
//                     meetings.map((meeting) => <MeetingPastCard meeting={meeting} />)
//                     // meetings.map((meeting) => <div>{meeting.name}</div>)
//                 }
//             </div>
//         </div>
//     )
// }