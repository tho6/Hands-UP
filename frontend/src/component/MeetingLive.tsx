import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMeeting, deleteMeeting } from '../redux/meeting/thunk';
import { RootState } from '../store';
// import { IMeetingLive } from '../redux/meeting/reducers';
import moment from 'moment'
// CSS
import './MeetingLive.scss';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export function MeetingLive() {
    const meetings = useSelector((state: RootState) => state.meetings)
    const dispatch = useDispatch();
    const arrMeetings = []
    for (const meetingId in meetings) {
        const duration = (Date.now() - new Date(meetings[meetingId].date_time).getTime())
        // console.log(duration)
        if (duration < 43200000) {
            arrMeetings.push(meetings[meetingId])
        }
    }
    useEffect(() => {
        dispatch(fetchMeeting(0))
    }, [dispatch])

    return (
        <div>
            <h2 className="headline"><b>Current</b></h2>
            {arrMeetings.map((meeting) => {
                return (<Card className="meetingLiveCard">
                    <Card.Body>
                        <Col>
                            <div className="meeting-relative-time">
                                <span>{moment(meeting.date_time).startOf('hour').fromNow()}</span>
                                <button className='meeting-live-btn' onClick={() => {
                                    dispatch(deleteMeeting(meeting.id))
                                }}><i className="far fa-times-circle" id="meeting-delete"></i>
                                </button>
                            </div>
                        </Col>
                        <Row>
                            <Col md={3}>
                                <div className="liveIcon"><i className="fas fa-video fa-3x"></i></div>
                            </Col>
                            <Col md={9}>
                                <div><b>{meeting.name}</b></div>
                                <div>Code: {meeting.code}</div>
                                <div>Url: {meeting.url}</div>
                                {/* <div>Meeting time: {meeting.date_time.toString()}</div> */}
                                <div>Date and time: {moment(meeting.date_time).format('D MMM YYYY h:mma')}</div>
                                <div>Host by: {meeting.owner_id}</div>
                                <div className="joinButton"><Button variant="info" className="joinButtonGreen"><b>JOIN</b></Button>{' '}</div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>)
            })}
        </div>
    );
}

// const MeetingLiveCard: React.FC<{ meeting: IMeetingLive }> = (props) => {
//     return (<>
//         <div>
//             <Card className="meetingLiveCard">
//                 <Card.Body>
//                     <Row>
//                         <Col md={3}>
//                             <div className="liveIcon"><i className="fas fa-video fa-3x"></i></div>
//                         </Col>
//                         <Col md={9}>
//                             <div><b>{props.meeting.name}</b></div>
//                             <div>Meeting code: {props.meeting.code}</div>
//                             <div>Meeting url: {props.meeting.url}</div>
//                             <div>Meeting time: {props.meeting.date_time.toString()}</div>
//                             <div>Host by: {props.meeting.owner_id}</div>
//                             <div className="joinButton"><Button variant="info" className="joinButtonGreen"><b>JOIN</b></Button>{' '}</div>
//                         </Col>
//                     </Row>
//                 </Card.Body>
//             </Card>
//         </div>
//     </>);
// }

// export function MeetingLive() {
//     const meetings = useSelector((state: RootState) => state.meetingsLive.meetingsLive)
//     const dispatch = useDispatch();

//     useEffect(() => {
//         dispatch(fetchMeetingLive(0))
//     }, [dispatch])

//     return (
//         <div>
//             <h2 className="headline"><b>Live</b></h2>
//             {
//                 meetings.map((meeting) => <MeetingLiveCard meeting={meeting} />)
//             }
//         </div>
//     )
// }