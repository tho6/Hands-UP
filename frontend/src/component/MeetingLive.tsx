import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteMeeting } from '../redux/meeting/thunk';
import { RootState } from '../store';
// import { IMeetingLive } from '../redux/meeting/reducers';
import moment from 'moment'
// CSS
import './MeetingLive.scss';
import Button from 'react-bootstrap/Button';
// import Card from 'react-bootstrap/Card'
// import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'

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

    return (
        <div className="meeting-live-container">
            <h2 className="meeting-live-header">Current</h2>
            {arrMeetings.map((meeting) => {
                return (<div key={meeting.id} className="meeting-live-card">
                        <div>
                            <div className="meeting-due-function-btn">
                                <span>{moment(meeting.date_time).startOf('hour').fromNow()}</span>
                                <span>
                                    <button className='meeting-live-edit-btn' onClick={() => {
                                        // dispatch(editMeeting(meeting.id))
                                    }}><i className="fas fa-cog" id="meeting-edit"></i>
                                    </button>
                                    <button className='meeting-live-del-btn' onClick={() => {
                                        dispatch(deleteMeeting(meeting.id))
                                    }}><i className="far fa-times-circle" id="meeting-delete"></i>
                                    </button>
                                </span>
                            </div>
                        </div>
                        <div className="meeting-live-content">
                            <div className="meeting-live-content-left">
                                <i className="fas fa-video fa-3x"></i>
                            </div>
                            <div className="meeting-live-content-right">
                                <div className="meeting-live-content-right-name">{meeting.name}</div>
                                <div className="meeting-live-content-input">
                                    <div className="meeting-live-content-field">Code: </div>
                                    <div className="meeting-live-content-answer">{meeting.code}</div>
                                </div>
                                <div className="meeting-live-content-input">
                                    <div className="meeting-live-content-field">Url </div>
                                    <div className="meeting-live-content-answer">{meeting.url}</div>
                                </div>
                                {/* <div>Meeting time: {meeting.date_time.toString()}</div> */}
                                <div className="meeting-live-content-input">
                                    <div className="meeting-live-content-field">Date & time: </div>
                                    <div className="meeting-live-content-answer">{moment(meeting.date_time).format('D MMM YYYY h:mma')}</div>
                                </div>
                                <div className="meeting-live-content-input">
                                    <div className="meeting-live-content-field">Host: </div>
                                    <div className="meeting-live-content-answer">{meeting.owner_id}</div>
                                </div>
                            </div>
                        </div>
                        <div className="meeting-live-join-btn"><Button variant="info" className="meeting-live-join-btn-green"><b>JOIN</b></Button>{' '}</div>  
                </div>)
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