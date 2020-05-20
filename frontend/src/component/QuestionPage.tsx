import React, { useState, useEffect } from 'react'
import { IQuestion } from '../models/IQuestion'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import useReactRouter from 'use-react-router'
import Question from './Question'
import { fetchRoomInformation, restoreLoginInRoom } from '../redux/rooms/thunk'

const QuestionPage: React.FC = () => {
  const router = useReactRouter<{ id: string }>()
  const meetingId = router.match.params.id
  const questionIds = useSelector(
    (rootState: RootState) =>
      rootState.questions.questionsByMeetingId[meetingId],
  )
  const questions = useSelector((rootState: RootState) =>
    questionIds?.map((id) => rootState.questions.questions[`${id}`]),
  )
  const roomInformation = useSelector(
    (rootState: RootState) =>
      rootState.roomsInformation.roomsInformation[meetingId],
  )
  const userInformation = useSelector(
    (rootState: RootState) => rootState.roomsInformation.userInformation,
  )

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchRoomInformation(parseInt(meetingId)))
  }, [dispatch, roomInformation])

  useEffect(() => {
    dispatch(restoreLoginInRoom(parseInt(meetingId), true))
  }, [dispatch])

  return (
    <div>
      <div>
        {questions?.map((question, i) => {
          return (
            <Question
              key={question.id}
              user={userInformation.user}
              canUploadFiles={roomInformation.canUploadFiles}
              question={question}
              answering={i === 0 ? true : false}
            />
          )
        })}
      </div>
    </div>
  )
}

export default QuestionPage
