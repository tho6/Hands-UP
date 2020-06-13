import React, { useState } from 'react';
// import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { fetchMeetingPast } from '../redux/meetingpast/thunk';
import { RootState } from '../store';
// import { IMeetingPast } from '../redux/meetingpast/reducers';
import { deleteMeeting } from '../redux/meeting/thunk';
// CSS
import './MeetingPast.scss';
import Button from 'react-bootstrap/Button';
// import Card from 'react-bootstrap/Card'
// import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'
import moment from 'moment';
import { Modal } from 'react-bootstrap';

// const MeetingPastCard: React.FC<{ meeting: IMeetingPast }> = (props) => {
export function MeetingPast() {
    const meetings = useSelector((state: RootState) => state.meetings)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const dispatch = useDispatch();
    // console.log(meetings)
    const arrMeetings = []
    for (const meetingId in meetings) {
        // console.log(meetings[meetingId])
        const duration = (Date.now() - new Date(meetings[meetingId].date_time).getTime())
        if (duration >= 43200000) {
            arrMeetings.push(meetings[meetingId])
        }
    }
    // useEffect(() => {
    //     dispatch(fetchMeetingPast())
    // }, [dispatch])
    return (<>
        <div className="meeting-past-container-outer">
            <h2 className="meeting-past-header">Past</h2>
            <div className="meeting-past-container">
                {arrMeetings.map((meeting) => {
                    return (<div key={meeting.id} className="meeting-past-card">
                        <div className="meeting-function-btn">
                            {/* <button className='meeting-live-edit-btn' onClick={() => {
                                // dispatch(editMeeting(meeting.id))
                            }}><i className="fas fa-cog" id="meeting-edit"></i>
                            </button> */}
                            <button className='meeting-live-del-btn' onClick={handleShow}><i className="far fa-times-circle" id="meeting-delete"></i>
                            </button>
                            <Modal show={show} onHide={handleClose} centered>
                                <Modal.Header className="modal-header" closeButton>
                                    <Modal.Title className="delete-meeting-past-header">Delete past meeting</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className="delete-meeting-past-body">Are you sure you want to delete? You can't undo this action.</Modal.Body>
                                <Modal.Footer className="delete-meeting-past-function-btn">
                                    <div className="delete-meeting-past-function-btn">
                                        <Button variant="danger" className="delete-meeting-delete-btn" onClick={async () => {
                                            dispatch(deleteMeeting(meeting.id))
                                            handleClose()
                                        }}>Yes</Button>
                                        <Button variant="secondary" className="delete-meeting-go-back-btn" onClick={handleClose}>Go back</Button>
                                    </div>
                                </Modal.Footer>
                            </Modal>
                        </div>
                        <div className="meeting-past-content">
                            <div className="meeting-past-content-left">
                                <div className="meeting-past-content-left-name">{meeting.name}</div>
                                <div className="meeting-past-content-input">
                                    <div className="meeting-past-content-field">Date: </div>
                                    <div className="meeting-past-content-answer">{moment(meeting.date_time).format('D MMM YYYY h:mma')}</div>
                                </div>
                                <div className="meeting-past-content-input">
                                    <div className="meeting-past-content-field">Code: </div>
                                    <div className="meeting-past-content-answer">{meeting.code}</div>
                                </div>
                                <div className="meeting-past-content-input">
                                    <div className="meeting-past-content-field">Host: </div>
                                    <div className="meeting-past-content-answer">{meeting.owner_id}</div>
                                </div>
                            </div>
                            <div className="meeting-past-content-right">
                                <i className="far fa-calendar-alt fa-3x"></i>
                            </div>
                        </div>
                        <div className="meeting-live-view-btn">
                            {/* <Button variant="secondary" className="meeting-live-view-btn" href="/{meeting.id}/questions/main">VIEW</Button> */}
                            <Button variant="secondary" className="meeting-live-view-btn" href={`/room/${meeting.id}/questions/main`}>VIEW</Button>
                        </div>
                    </div>)
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