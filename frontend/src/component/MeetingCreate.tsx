import React from 'react';
import { useFormState } from 'react-use-form-state';
//CSS
import './MeetingCreate.scss'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
// import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface IProps {
    close: () => void
}

const CreateMeeting: React.FC<IProps> = (props) => {
    const [formState, { text, date, time, radio }] = useFormState();
    const auth = useSelector((rootState:RootState)=>rootState.auth);

    return (
        <Container className="createForm">
            <Form>
                <Form.Row>
                    <Col>
                        {/* <h4>Create meeting</h4> */}
                        <div className="create-meeting-text">Meeting name{" "}
                            <input className="textarea" {...text('name')} />
                            {formState.touched.name && formState.values.name === '' && <div className="formRemind">Please fill in the meeting name</div>}
                        </div>
                        <div className="create-meeting-text">Date and time{" "}
                            <input className="textarea"{...date('date')} />
                            <input className="textarea"{...time('time')} />
                            {formState.touched.date && formState.values.date === '' && <div className="formRemind">Please fill in the meeting date</div>}
                            {formState.touched.time && formState.values.time === '' && <div className="formRemind">Please fill in the meeting time</div>}
                        </div>
                        <div className="create-meeting-text">Code for this meeting{" "}
                            <input className="textarea"{...text('code')} />
                            {formState.touched.code && formState.values.code === '' && <div className="formRemind">Please fill in the meeting code</div>}
                        </div>
                        <div className="create-meeting-text">Meeting url{" "}
                            <input className="textarea"{...text('url')} />
                            {formState.touched.url && formState.values.url === '' && <div className="formRemind">Please fill in the meeting url</div>}
                        </div>
                        <div className="create-meeting-text">Question limit per person{" "}
                            <input className="textarea"{...text('question_limit')} />
                            {formState.touched.question_limit && formState.values.question_limit === '' && <div className="formRemind">Please set the question limit</div>}
                        </div>
                        <div className="create-meeting-text">Enable meeting moderation{" "}
                            <label><input {...radio('pre_can_moderate', 1)} />Yes</label>{" "}
                            <label><input {...radio('pre_can_moderate', 0)} />No</label>
                            {formState.touched.can_moderate && formState.values.can_moderate === '' && <div className="formRemind">Please decide the meeting moderation setting</div>}
                        </div>
                        <div className="create-meeting-text">Enable file attachments for meeting{" "}
                            <label><input {...radio('pre_can_upload_file', 1)} />Yes</label>{" "}
                            <label><input {...radio('pre_can_upload_file', 0)} />No</label>
                            {formState.touched.can_upload_file && formState.values.can_upload_file === '' && <div className="formRemind">Please decide the meeting upload feature setting</div>}
                        </div>
                        <div className="createButtons">
                            <Button variant="info" className="createButtonColour" onClick={() => {
                                console.log(formState);
                                fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/create`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        'Authorization': `Bearer ${auth.accessToken}`
                                    },
                                    body: JSON.stringify(formState.values)
                                })
                                    .then(response => response.json());
                                props.close();
                                // alert(JSON.stringify(formState, null, 2))
                            }}><b>CREATE</b>
                            </Button>
                            <Button variant="secondary" className="resetButtonColour" onClick={formState.clear}>
                                RESET
                        </Button>
                        </div>
                    </Col>
                </Form.Row>
            </Form>
        </Container>
    )
}

export default CreateMeeting;