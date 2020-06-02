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
    const [formState, { text, date }] = useFormState();

    return (
        <Container className="createForm">
                    <Form>
            <Form.Row>
                <Col>
                        <h4>Create meeting</h4>
                        <div>Meeting name
                <input className="textarea" {...text('name')} />
                            {formState.touched.name && formState.values.name === '' && <div className="formRemind">Please fill in the meeting name</div>}
                        </div>
                        <div>Meeting date
                <input className="textarea"{...date('date_time')} />
                            {formState.touched.date && formState.values.date === '' && <div className="formRemind">Please fill in the meeting date</div>}
                        </div>
                        <div>Meeting code
                <input className="textarea"{...text('code')} />
                            {formState.touched.name && formState.values.code === '' && <div className="formRemind">Please fill in the meeting code</div>}
                        </div>
                        <div>Meeting url
                <input className="textarea"{...text('url')} />
                            {formState.touched.name && formState.values.url === '' && <div className="formRemind">Please fill in the meeting url</div>}
                        </div>
                        <div>Owner id
                <input className="textarea"{...text('owner_id')} />
                            {formState.touched.name && formState.values.owner_id === '' && <div className="formRemind">Owner id</div>}
                        </div>
                        <div className="createButtons">
                            <Button variant="info" className="createButtonColour" onClick={() => {
                                // console.log(formState);
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