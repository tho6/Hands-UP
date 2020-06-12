import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteMeeting } from '../redux/meeting/thunk';
// import { editMeeting } from '../redux/meeting/thunk';
import { RootState } from '../store';
// import { IMeetingLive } from '../redux/meeting/reducers';
import moment from 'moment'
// CSS
import './MeetingLive.scss';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
// import { message } from '../redux/meeting/action';
// import Card from 'react-bootstrap/Card'
// import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'

export function MeetingLive() {
    const meetings = useSelector((state: RootState) => state.meetings)
    // const [editing, setEditing] = useState<null | number>(null);
    // const [textValue, setTextValue] = useState('');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
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

                                {/*             
              {editing === i ? <textarea {...textarea('content')} onBlur={async () => {
                dispatch(editMeeting(meeting.id))
                setEditing(null);
              }}></textarea> : memo.content} */}




                                {/* <button className='meeting-live-edit-btn' onClick={() => {
                                        dispatch(editMeeting(meeting.id))
                                    }}><i className="fas fa-cog" id="meeting-edit"></i>
                                    </button> */}
                                <button className='meeting-live-del-btn' onClick={handleShow}><i className="far fa-times-circle" id="meeting-delete"></i>
                                </button>
                                <Modal show={show} onHide={handleClose} centered>
                                    <Modal.Header className="modal-header" closeButton>
                                        <Modal.Title className="delete-meeting-header">Delete meeting</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body className="delete-meeting-body">Are you sure you want to delete? You can always modify your current meeting settings.</Modal.Body>
                                    <Modal.Footer className="delete-meeting-function-btn">
                                        <div className="delete-meeting-function-btn">
                                            <Button variant="danger" className="delete-meeting-delete-btn" onClick={async () => {
                                                dispatch(deleteMeeting(meeting.id))
                                                handleClose()
                                            }}>Yes</Button>
                                            <Button variant="secondary" className="delete-meeting-go-back-btn" onClick={handleClose}>Go back</Button>
                                        </div>
                                    </Modal.Footer>
                                </Modal>
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
                                <div className="meeting-live-content-field">Url: </div>
                                <div className="meeting-live-content-answer">{process.env.REACT_APP_BACKEND_URL}/{meeting.id}/questions/main</div>
                            </div>
                            {/* <div>Meeting time: {meeting.date_time.toString()}</div> */}
                            <div className="meeting-live-content-input">
                                <div className="meeting-live-content-field">Date: </div>
                                <div className="meeting-live-content-answer">{moment(meeting.date_time).format('D MMM YYYY h:mma')}</div>
                            </div>
                            <div className="meeting-live-content-input">
                                <div className="meeting-live-content-field">Host: </div>
                                <div className="meeting-live-content-answer">{meeting.owner_id}</div>
                            </div>
                        </div>
                    </div>
                    <div className="meeting-live-join-btn"><Button onClick={() => {
                        // dispatch
                    }} variant="info" className="meeting-live-join-btn-green"><b>JOIN</b></Button></div>
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