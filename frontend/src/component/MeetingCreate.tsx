import React from 'react';
import { useFormState } from 'react-use-form-state';
//CSS
import './MeetingCreate.scss'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
// import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

const CreateMeeting = () => {
    const [formState, { text, date, time, radio }] = useFormState();

    return (
        <Container className="createForm">
            <Form>
                <Form.Row>
                    <Col>
                        {/* <h4>Create meeting</h4> */}
                        <div>Meeting name
                <input className="textarea" {...text('name')} />
                            {formState.touched.name && formState.values.name === '' && <div className="formRemind">Please fill in the meeting name</div>}
                        </div>
                        <div>Meeting time
                <input className="textarea"{...date('date')} />
                            <input className="textarea"{...time('time')} />
                            {formState.touched.date && formState.values.date === '' && <div className="formRemind">Please fill in the meeting date and time</div>}
                            {formState.touched.time && formState.values.time === '' && <div className="formRemind">Please fill in the meeting date and time</div>}
                        </div>
                        <div>Meeting code
                <input className="textarea"{...text('code')} />
                            {formState.touched.code && formState.values.code === '' && <div className="formRemind">Please fill in the meeting code</div>}
                        </div>
                        <div>Meeting url
                <input className="textarea"{...text('url')} />
                            {formState.touched.url && formState.values.url === '' && <div className="formRemind">Please fill in the meeting url</div>}
                        </div>

                        <div>Question limit
                <input className="textarea"{...text('question_limit')} />
                            {formState.touched.question_limit && formState.values.question_limit === '' && <div className="formRemind">Please set the question limit</div>}
                        </div>
                        <div>Can moderate?
                    <label><input {...radio('pre_can_moderate', 1)} />Yes</label>
                            <label><input {...radio('pre_can_moderate', 0)} />No</label>
                            {formState.touched.can_moderate && formState.values.can_moderate === '' && <div className="formRemind">Please decide if host can moderate</div>}
                        </div>
                        <div>Can upload file?
                    <label><input {...radio('pre_can_upload_file', 1)} />Yes</label>
                            <label><input {...radio('pre_can_upload_file', 0)} />No</label>
                            {formState.touched.can_upload_file && formState.values.can_upload_file === '' && <div className="formRemind">Please decide if host can upload file</div>}
                        </div>
                        <div className="createButtons">
                            <Button variant="info" className="createButtonColour" onClick={() => {
                                console.log(formState);
                                fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/create`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(formState.values)
                                })
                                    .then(response => response.json());
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