import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteMeeting, editMeeting } from '../redux/meeting/thunk';
// import { fetchMeeting } from '../redux/meeting/thunk';
// import { editMeeting } from '../redux/meeting/thunk';
// import { IMeetingLive } from '../redux/meeting/reducers';
import moment from 'moment'
// CSS
import './MeetingLive.scss';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import { IMeeting } from '../redux/meeting/reducers';
import { useFormState } from 'react-use-form-state';
import YesNoModal from './YesNoModal';
import Clipboard from 'react-clipboard.js';

export interface IProps {
    meeting: IMeeting
}

export const MeetingComponent: React.FC<IProps> = (props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [isEdit, setIsEdit] = useState(false);
    const [showYesNoModal, setShowYesNoModal] = useState(false);
    const dispatch = useDispatch();
    const { meeting } = props;
    const [formState, { text, date, time }] = useFormState();

    useEffect(() => {
        formState.setField('name', meeting.name);
        formState.setField('code', meeting.code);
        formState.setField('date', new Date(meeting.date_time).toLocaleDateString('en-CA'));
        formState.setField('time', new Date(meeting.date_time).toLocaleTimeString('it-IT'));
    }, [formState, meeting])
    return (
        <>
            <div className="meeting-live-card">
                <div>
                    <div className="meeting-due-function-btn">
                        <span>{moment(meeting.date_time).startOf('hour').fromNow()}</span>
                        <span>
                            {!isEdit && <>
                                <button className='meeting-live-edit-btn' onClick={() => {
                                    //dispatch(editMeeting(meeting.id))
                                    setIsEdit(true);
                                }}><i className="fas fa-cog" id="meeting-edit"></i>
                                </button>
                                <button className='meeting-live-del-btn' onClick={handleShow}><i className="far fa-times-circle" id="meeting-delete"></i></button>
                            </>}
                            {isEdit && <><button className='meeting-live-edit-btn' onClick={() => {
                                const { date, time, code, name } = formState.values;
                                if (meeting.code !== code || meeting.name !== name || `${date}` !== `${new Date(meeting.date_time).toLocaleDateString('en-CA')}` || `${time}` !== `${new Date(meeting.date_time).toLocaleTimeString('it-IT')}`) {
                                    const tmp = new Date(`${formState.values.date} ${formState.values.time} GMT+8:00`);
                                    dispatch(editMeeting(meeting.id, formState.values.name, formState.values.code, tmp));
                                }
                                setIsEdit(false);
                                formState.reset();
                            }}>Save
                    </button>
                                <button className='meeting-live-edit-btn' onClick={() => {
                                    const { date, time, code, name } = formState.values;
                                    if (meeting.code !== code || meeting.name !== name || `${date}` !== `${new Date(meeting.date_time).toLocaleDateString('en-CA')}` || `${time}` !== `${new Date(meeting.date_time).toLocaleTimeString('it-IT')}`) {
                                        setShowYesNoModal(true);
                                        return;
                                    }
                                    setIsEdit(false);
                                }}>Cancel
                    </button>
                            </>}
                            <Modal show={show} onHide={handleClose} centered>
                                <Modal.Header className="modal-header" closeButton>
                                    <Modal.Title className="delete-meeting-header">Delete meeting</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className="delete-meeting-body">Are you sure you want to delete? You can always modify your current meeting settings.</Modal.Body>
                                <Modal.Footer className="delete-meeting-function-btn">
                                    <div className="delete-meeting-function-btn">
                                        <Button variant="danger" className="delete-meeting-delete-btn" onClick={async () => {
                                            dispatch(deleteMeeting(meeting.id))
                                            handleClose()
                                        }}>Yes</Button>
                                        <Button variant="secondary" className="delete-meeting-go-back-btn" onClick={handleClose}>Go back</Button>
                                    </div>
                                </Modal.Footer>
                            </Modal>
                        </span>
                    </div>
                </div>
                <div className="meeting-live-content">
                    <div className="meeting-live-content-left">
                        <i className="fas fa-video fa-3x"></i>
                    </div>
                    <div className="meeting-live-content-right">
                        <div className="meeting-live-content-right-name">{isEdit ? <input className='meeting-text-area'{...text('name')} /> : meeting.name}</div>
                        <div className="meeting-live-content-input">
                            <div className="meeting-live-content-field">Code: </div>
                            <div className="meeting-live-content-answer">{isEdit ? <input className='meeting-text-area' {...text('code')} /> : meeting.code}</div>
                        </div>
                        <div className="meeting-live-content-input">
                            <div className="meeting-live-content-field">Url: </div>
                            <div className="meeting-live-content-answer">{process.env.REACT_APP_FRONTEND_URL}/room/{meeting.id}/questions/main</div>
                            <div className="meeting-live-content-copy-to-clipboard">
                            <Clipboard className="meeting-live-content-copy-to-clipboard-btn" data-clipboard-text={`${process.env.REACT_APP_FRONTEND_URL}/room/${meeting.id}/questions/main`}>Copy</Clipboard></div>
                        </div>
                        {/* <div>Meeting time: {meeting.date_time.toString()}</div> */}
                        <div className="meeting-live-content-input">
                            <div className="meeting-live-content-field">Date: </div>
                            <div className="meeting-live-content-answer">
                                {isEdit && <>
                                    <div className='create-meeting-input-answer'>
                                        <input className="input-area"{...date('date')} required />
                                        <input className="input-area"{...time('time')} required />
                                    </div>
                                </>}
                                {!isEdit && <>{moment(meeting.date_time).format('D MMM YYYY h:mma')}</>}
                            </div>
                        </div>
                        <div className="meeting-live-content-input">
                            <div className="meeting-live-content-field">Host: </div>
                            <div className="meeting-live-content-answer">{meeting.owner_id}</div>
                        </div>
                    </div>
                </div>
                <div className="meeting-live-join-btn">
                    <Button variant="info" className="meeting-live-join-btn-green" href={`/room/${meeting.id}/questions/main`}>JOIN</Button>
                </div>
            </div>
            {showYesNoModal && <YesNoModal title={'Discard changes?'} message={'Are you sure you want to discard the changes?'} yes={() => {
                formState.reset();
                setShowYesNoModal(false);
                setIsEdit(false);
            }}
                no={() => setShowYesNoModal(false)} />}
        </>


    );
}
