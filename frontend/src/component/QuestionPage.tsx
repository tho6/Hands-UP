import React, { useState } from "react";
import { IQuestion } from "../models/IQuestion";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import useReactRouter from "use-react-router";
import Question from "./Question";

interface IQuestionPageProps {
  user: { id: number; isHost: boolean; name: string;};
  canUploadFiles: boolean;
  rate: number; //per 10s
  isModerate: boolean;
}

const QuestionPage: React.FC<IQuestionPageProps> = (props) => {
  //get room config
  const router = useReactRouter<{ id: string }>();
  const meetingId = router.match.params.id;
  const questionIds = useSelector((rootState: RootState) =>
    meetingId ? rootState.questions.questionsByMeetingId[meetingId] : null
  );
  const questions = useSelector((rootState: RootState) =>
    questionIds?.map((id) => rootState.questions.questions[`${id}`])
  );
  return (<div>
    <div>
     {questions?.map((question, i)=>{
       return  <Question key={question.id} user={props.user} canUploadFiles={props.canUploadFiles} question={question} answering={i===0?true:false}/>
     })}
    </div>
  </div>)
};

export default QuestionPage;
