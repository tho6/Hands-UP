import React from 'react';
import { useFormState } from 'react-use-form-state';
import { useDispatch } from 'react-redux';
import { createMeeting } from '../redux/meeting/thunk';
// import { RootState } from '../store';
//CSS
import './MeetingCreate.scss'
import Button from 'react-bootstrap/Button';

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
                    <div className="create-meeting-yes-no">
                        <label><input {...radio('pre_can_moderate', 1)} />Yes</label>
                        <label><input {...radio('pre_can_moderate', 0)} />No</label>
                    </div>
                    {formState.touched.can_moderate && formState.values.can_moderate === '' && <div className="formRemind">Please decide the meeting moderation setting</div>}
                </div>
            </div>
            <div className="create-meeting-input">
                <div className='create-meeting-field'>Enable file attachments</div>
                <div className='create-meeting-input-answer'>
                    <div className="create-meeting-yes-no">

                        <label><input {...radio('pre_can_upload_file', 1)} />Yes</label>
                        <label><input {...radio('pre_can_upload_file', 0)} />No</label>
                    </div>
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