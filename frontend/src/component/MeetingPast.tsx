import React from 'react';
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

// const MeetingPastCard: React.FC<{ meeting: IMeetingPast }> = (props) => {
export function MeetingPast() {
    const meetings = useSelector((state: RootState) => state.meetings)
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
                            <button className='meeting-live-edit-btn' onClick={() => {
                                // dispatch(editMeeting(meeting.id))
                            }}><i className="fas fa-cog" id="meeting-edit"></i>
                            </button>
                            <button className='meeting-live-del-btn' onClick={() => {
                                dispatch(deleteMeeting(meeting.id))
                            }}><i className="far fa-times-circle" id="meeting-delete"></i>
                            </button>
                        </div>
                        <div className="meeting-past-content">
                            <div className="meeting-past-content-left">
                                <div className="meeting-past-content-left-name">{meeting.name}</div>

                                {/* <div><b>{meeting.name}</b></div> */}

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


                                {/* <div>{moment(meeting.date_time).format('D MMM YYYY h:mma')}</div> */}
                                {/* <div>Code: {meeting.code}</div> */}
                                {/* <div>Host by: {meeting.owner_id}</div> */}
                            </div>
                            <div className="meeting-past-content-right">
                                <i className="far fa-calendar-alt fa-3x"></i>
                            </div>
                        </div>
                        <div className="meeting-live-view-btn">
                            <Button variant="secondary" className="meeting-live-view-btn">VIEW</Button>{' '}
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