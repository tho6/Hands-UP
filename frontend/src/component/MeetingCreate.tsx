import React from 'react';
import { useFormState } from 'react-use-form-state';
//CSS
import './MeetingCreate.scss'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
// import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import { useDispatch } from 'react-redux';
// import { RootState } from '../store';
import { createMeeting } from '../redux/meeting/thunk';
import { Row } from 'react-bootstrap';

interface IProps {
    close: () => void
}

const CreateMeeting: React.FC<IProps> = (props) => {
    const [formState, { text, date, time, radio }] = useFormState();
    // const auth = useSelector((rootState: RootState) => rootState.auth);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(createMeeting())
    // }, [dispatch])

    return (
        <div className="createForm">

            <div className="create-meeting-input">
                <div className='create-meeting-field'>Meeting name</div>
                <div className='create-meeting-input-answer'>
                    <input className="input-area" {...text('name')} required />
                    {formState.touched.name && formState.values.name === '' && <div className="formRemind">Please fill in the meeting name</div>}
                </div>
            </div>
            <div className="create-meeting-input">
                <div className='create-meeting-field'>Date and time</div>
                <div className='create-meeting-input-answer'>
                    <input className="input-area"{...date('date')} required />
                    <input className="input-area"{...time('time')} required />
                    {formState.touched.date && formState.values.date === '' && <div className="formRemind">Please fill in the meeting date</div>}
                    {formState.touched.time && formState.values.time === '' && <div className="formRemind">Please fill in the meeting time</div>}
                </div>
            </div>
            <div className="create-meeting-input">
                <div className='create-meeting-field'>Meeting code</div>
                <div className='create-meeting-input-answer'>
                    <input className="input-area"{...text('code')} required />
                    {formState.touched.code && formState.values.code === '' && <div className="formRemind">Please fill in the meeting code</div>}
                </div>
            </div>
            {/* <div className="create-meeting-input">
                <div className='create-meeting-field'>Meeting url</div>
                <div className='create-meeting-input-answer'>
                    <input className="input-area"{...text('url')} required />
                    {formState.touched.url && formState.values.url === '' && <div className="formRemind">Please fill in the meeting url</div>}
                </div>
            </div> */}
            <div className="create-meeting-input">
                <div className='create-meeting-field'>Question limit per person</div>
                <div className='create-meeting-input-answer'>
                    <input className="input-area"{...text('question_limit')} required />
                    {formState.touched.question_limit && formState.values.question_limit === '' && <div className="formRemind">Please set the question limit</div>}
                </div>
            </div>
            <div className="create-meeting-input">
                <div className='create-meeting-field'>Enable moderation</div>
                <div className='create-meeting-input-answer'>
                    <label><input {...radio('pre_can_moderate', 1)} />Yes</label>{" "}
                    <label><input {...radio('pre_can_moderate', 0)} />No</label>
                    {formState.touched.can_moderate && formState.values.can_moderate === '' && <div className="formRemind">Please decide the meeting moderation setting</div>}
                </div>
            </div>
            <div className="create-meeting-input">
                <div className='create-meeting-field'>Enable file attachments</div>
                <div className='create-meeting-input-answer'>
                    <label><input {...radio('pre_can_upload_file', 1)} />Yes</label>{" "}
                    <label><input {...radio('pre_can_upload_file', 0)} />No</label>
                    {formState.touched.can_upload_file && formState.values.can_upload_file === '' && <div className="formRemind">Please decide the meeting upload feature setting</div>}
                </div>
            </div>
            <div className="createButtons">
                <Button variant="info" className="createButtonColour" onClick={() => {
                    dispatch(createMeeting(formState.values))
                    // formState.clear
                    props.close()
                }}><b>CREATE</b>
                </Button>
                <Button variant="secondary" className="resetButtonColour" onClick={formState.clear}>
                    RESET
                </Button>
            </div>
        </div>
    )
}

export default CreateMeeting;
{/* <div className="create-meeting-text">Meeting name{" "}
    <input className="textarea" {...text('name')} />
    {formState.touched.name && formState.values.name === '' && <div className="formRemind">Please fill in the meeting name</div>}
</div> */}
{/* <div className="create-meeting-text">Date and time{" "}
    <input className="textarea"{...date('date')} />
    <input className="textarea"{...time('time')} />
    {formState.touched.date && formState.values.date === '' && <div className="formRemind">Please fill in the meeting date</div>}
    {formState.touched.time && formState.values.time === '' && <div className="formRemind">Please fill in the meeting time</div>}
</div> */}
{/* <div className="create-meeting-text">Code for this meeting{" "}
    <input className="textarea"{...text('code')} />
    {formState.touched.code && formState.values.code === '' && <div className="formRemind">Please fill in the meeting code</div>}
</div> */}
{/* <div className="create-meeting-text">Meeting url{" "}
    <input className="textarea"{...text('url')} />
    {formState.touched.url && formState.values.url === '' && <div className="formRemind">Please fill in the meeting url</div>}
</div> */}
{/* <div className="create-meeting-text">Question limit per person{" "}
    <input className="textarea"{...text('question_limit')} />
    {formState.touched.question_limit && formState.values.question_limit === '' && <div className="formRemind">Please set the question limit</div>}
</div> */}
{/* <div className="create-meeting-text">Enable meeting moderation{" "}
    <label><input {...radio('pre_can_moderate', 1)} />Yes</label>{" "}
    <label><input {...radio('pre_can_moderate', 0)} />No</label>
    {formState.touched.can_moderate && formState.values.can_moderate === '' && <div className="formRemind">Please decide the meeting moderation setting</div>}
</div> */}
{/* <div className="create-meeting-text">Enable file attachments for meeting{" "}
    <label><input {...radio('pre_can_upload_file', 1)} />Yes</label>{" "}
    <label><input {...radio('pre_can_upload_file', 0)} />No</label>
    {formState.touched.can_upload_file && formState.values.can_upload_file === '' && <div className="formRemind">Please decide the meeting upload feature setting</div>}
</div> */}

// <div className="createButtons">
// <Button variant="info" className="createButtonColour" onClick={() => {
//     dispatch(createMeeting(formState.values))
//     // formState.clear
//     props.close()
//     // console.log(formState);
//     // fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/create`, {
//     //     method: "POST",
//     //     headers: {
//     //         "Content-Type": "application/json",
//     //         'Authorization': `Bearer ${auth.accessToken}`
//     //     },
//     //     body: JSON.stringify(formState.values)
//     // })
//     //     .then(response => response.json());
//     // props.close();
//     // alert(JSON.stringify(formState, null, 2))
// }}><b>CREATE</b>
// </Button>
// <Button variant="secondary" className="resetButtonColour" onClick={formState.clear}>
//     RESET
//         </Button>
// </div>
// </div>


{/* <div className="createForm"> */ }
{/* <h4>Create meeting</h4> */ }
{/* <div className="create-meeting-request">
    <div>Meeting name</div>
    <div>Date and time</div>
    <div>Code for this meeting</div>
    <div>Meeting url</div>
    <div>Question limit per person</div>
    <div>Enable meeting moderation</div>
    <div>Enable file attachments for meeting</div>
</div>

<div className="create-meeting-input">
    <div>
        <input className="textarea" {...text('name')} />
        {formState.touched.name && formState.values.name === '' && <div className="formRemind">Please fill in the meeting name</div>}
    </div>
    <div>
        <input className="textarea"{...date('date')} />
        <input className="textarea"{...time('time')} />
        {formState.touched.date && formState.values.date === '' && <div className="formRemind">Please fill in the meeting date</div>}
        {formState.touched.time && formState.values.time === '' && <div className="formRemind">Please fill in the meeting time</div>}
    </div>
    <div>
        <input className="textarea"{...text('code')} />
        {formState.touched.code && formState.values.code === '' && <div className="formRemind">Please fill in the meeting code</div>}
    </div>
    <div>
        <input className="textarea"{...text('url')} />
        {formState.touched.url && formState.values.url === '' && <div className="formRemind">Please fill in the meeting url</div>}
    </div>
    <div>
        <input className="textarea"{...text('question_limit')} />
        {formState.touched.question_limit && formState.values.question_limit === '' && <div className="formRemind">Please set the question limit</div>}
    </div>
    <div>
        <label><input {...radio('pre_can_moderate', 1)} />Yes</label>{" "}
        <label><input {...radio('pre_can_moderate', 0)} />No</label>
        {formState.touched.can_moderate && formState.values.can_moderate === '' && <div className="formRemind">Please decide the meeting moderation setting</div>}
    </div>
    <div>
        <label><input {...radio('pre_can_upload_file', 1)} />Yes</label>{" "}
        <label><input {...radio('pre_can_upload_file', 0)} />No</label>
        {formState.touched.can_upload_file && formState.values.can_upload_file === '' && <div className="formRemind">Please decide the meeting upload feature setting</div>}
    </div>
    <div className="createButtons">
        <Button variant="info" className="createButtonColour" onClick={() => {
            dispatch(createMeeting(formState.values)) */}
            // formState.clear
//             props.close()
//         }}><b>CREATE</b>
//         </Button>
//         <Button variant="secondary" className="resetButtonColour" onClick={formState.clear}>
//             RESET
//     </Button>
//     </div>
// </div>
// </div>