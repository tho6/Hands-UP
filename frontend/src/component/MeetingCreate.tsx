import React, { useEffect } from 'react';
import { useFormState } from 'react-use-form-state';
//CSS
import './MeetingCreate.scss'
import Button from 'react-bootstrap/Button';

const CreateMeeting = () => {
    const [formState, { text, date, textarea }] = useFormState();

    return (
        <div className="createForm">
            <h4>Create meeting</h4>
            <div>Meeting name
                <input className="textarea" {...text('name')} />
                {formState.touched.name && formState.values.name == '' && <div className="formRemind">Please fill in the meeting name</div>}
            </div>
            <div>Meeting date
                <input className="textarea"{...date('date')} />
                {formState.touched.date && formState.values.date == '' && <div className="formRemind">Please fill in the meeting date</div>}
            </div>
            <div>Meeting code
                <input className="textarea"{...text('code')} />
                {formState.touched.name && formState.values.name == '' && <div className="formRemind">Please fill in the meeting code</div>}
            </div>
            <div>Meeting url
                <input className="textarea"{...text('url')} />
                {formState.touched.name && formState.values.name == '' && <div className="formRemind">Please fill in the meeting url</div>}
            </div>
            <div>Owner id
                <input className="textarea"{...text('ownerId')} />
                {formState.touched.name && formState.values.name == '' && <div className="formRemind">Owner id</div>}
            </div>
            <div className="createButtons">
                <Button variant="info" className="createButtonColour" onClick={() => {
                    fetch(`${process.env.BACKEND_URL}/create`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formState)
                    })
                    .then(response => response.json());
                    // alert(JSON.stringify(formState, null, 2))
                }}>Create</Button>
                <Button variant="secondary" className="resetButtonColour" onClick={() => {
                    alert(JSON.stringify(formState, null, 2))
                }}>Reset</Button>
            </div>
        </div>
    )
}

export default CreateMeeting;