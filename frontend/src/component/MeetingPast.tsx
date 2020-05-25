import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMeetingPast } from '../redux/meetingpast/thunk';
import { RootState } from '../store';

export function MeetingPast() {
    const meetings = useSelector((state: RootState) => state.meetingsPast.meetingsPast)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMeetingPast)
    }, [dispatch])

    return (
        <div>
            <h2>Past</h2>
            {
                meetings.map((meeting) => <div>{meeting.name}</div>)
            }
        </div>
    )
}