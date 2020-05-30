import React, { useEffect } from 'react';
import { useFormState } from 'react-use-form-state';

const CreateMeeting = () => {
    const [formState, { text, date, textarea }] = useFormState();

    return (
        <div>
            <div>Meeting name:
                <input {...text('name')} />
                {formState.touched.name && formState.values.name == '' && <div>Please fill in the meeting name</div>}
            </div>
            <div>Meeting date:
                <input {...date('date')} />
                {formState.touched.date && formState.values.date == '' && <div>Please fill in the meeting date</div>}
            </div>
            <div>Meeting code:
                <input {...text('code')} />
                {formState.touched.name && formState.values.name == '' && <div>Please fill in the meeting code</div>}
            </div>
            <div>Meeting url will be same as meeting code
            </div>
            <button onClick={() => {
                alert(JSON.stringify(formState, null, 2))
            }}>Submit</button>
            <button>Reset</button>
        </div>
    )
}

export default CreateMeeting;