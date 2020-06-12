import React, { useState } from 'react';
import { useFormState } from 'react-use-form-state';
import { useDispatch } from 'react-redux';
import { createMeeting } from '../redux/meeting/thunk';
import DatePicker from "react-datepicker";
import { addDays } from 'date-fns'
// import { RootState } from '../store';
//CSS
import './MeetingCreate.scss'
import Button from 'react-bootstrap/Button';
import "react-datepicker/dist/react-datepicker.css";

interface IProps {
    close: () => void
}

const CreateMeeting: React.FC<IProps> = (props) => {
    const [formState, { text, date, time, radio, raw }] = useFormState({ date: new Date() });
    // const auth = useSelector((rootState: RootState) => rootState.auth);
    const [startDate, setStartDate] = useState({} as Date);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(createMeeting())
    // }, [dispatch])

    return (
        <div className="create-form">

            <div className="create-meeting-input">
                <div className='create-meeting-field'>Meeting name</div>
                <div className='create-meeting-input-answer'>
                    <input className="input-area" {...text('name')} required />
                    {formState.touched.name && formState.values.name === '' && <div className="form-remind">Please fill in the meeting name</div>}
                </div>
            </div>
            <div className="create-meeting-input">
                <div className='create-meeting-field'>Date and time</div>
                <div className='create-meeting-input-answer'>
                    {/* <input className="input-area"{...date('date')} required /> */}

                {/* <input className="input-area"> */}

                {/* <DatePicker
                    {...raw({name: 'date',
                    onChange: date => date.toString();
                    })}
                    
                    value={new Date(formState.date)}
                />

 */}


                    <DatePicker {...raw('date')} 
                        selected={startDate}
                        onChange={date => setStartDate(date as Date)}
                        minDate={new Date()}
                        maxDate={addDays(new Date(), 30)}
                        placeholderText="Select a date between today and 30 days in the future"
                    />
                    <input className="input-area"{...time('time')} required />
                    {formState.touched.date && formState.values.date === '' && <div className="form-remind">Please fill in the meeting date</div>}
                    {formState.touched.time && formState.values.time === '' && <div className="form-remind">Please fill in the meeting time</div>}
                </div>
            </div>
            <div className="create-meeting-input">
                <div className='create-meeting-field'>Meeting code</div>
                <div className='create-meeting-input-answer'>
                    <input className="input-area"{...text('code')} required />
                    {formState.touched.code && formState.values.code === '' && <div className="form-remind">Please fill in the meeting code</div>}
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
                    {formState.touched.question_limit && formState.values.question_limit === '' && <div className="form-remind">Please set the question limit</div>}
                </div>
            </div>
            <div className="create-meeting-input">
                <div className='create-meeting-field'>Enable moderation</div>
                <div className='create-meeting-input-answer'>
                    <div className="create-meeting-yes-no">
                        <label><input {...radio('pre_can_moderate', 1)} />Yes</label>
                        <label><input {...radio('pre_can_moderate', 0)} />No</label>
                    </div>
                    {formState.touched.can_moderate && formState.values.can_moderate === '' && <div className="form-remind">Please decide the meeting moderation setting</div>}
                </div>
            </div>
            <div className="create-meeting-input">
                <div className='create-meeting-field'>Enable file attachments</div>
                <div className='create-meeting-input-answer'>
                    <div className="create-meeting-yes-no">

                        <label><input {...radio('pre_can_upload_file', 1)} />Yes</label>
                        <label><input {...radio('pre_can_upload_file', 0)} />No</label>
                    </div>
                    {formState.touched.can_upload_file && formState.values.can_upload_file === '' && <div className="form-remind">Please decide the meeting upload feature setting</div>}
                </div>
            </div>
            <div className="create-buttons">
                <Button variant="info" className="create-button-colour" onClick={() => {
                    dispatch(createMeeting(formState.values))
                    // formState.clear
                    props.close()
                }}><b>CREATE</b>
                </Button>
                <Button variant="secondary" className="reset-button-colour" onClick={formState.clear}>
                    RESET
                </Button>
            </div>
        </div>
    )
}

export default CreateMeeting;