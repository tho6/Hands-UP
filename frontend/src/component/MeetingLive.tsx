import React from 'react';
import { useSelector} from 'react-redux';
// import { editMeeting } from '../redux/meeting/thunk';
import { RootState } from '../store';
// import { IMeetingLive } from '../redux/meeting/reducers';
// CSS
import './MeetingLive.scss';
import { MeetingComponent } from './MeetingComponent';
// import { message } from '../redux/meeting/action';
// import Card from 'react-bootstrap/Card'
// import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'

export function MeetingLive() {
    const meetings = useSelector((state: RootState) => state.meetings)
    // const [editing, setEditing] = useState<null | number>(null);
    // const [textValue, setTextValue] = useState('');
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
                return (
                    <MeetingComponent key={meeting.id} meeting={meeting} />
                )
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