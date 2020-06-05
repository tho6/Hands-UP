import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import useReactRouter from 'use-react-router';
import { reportQuestionsCountOnLatestXMeetings, fetchReportQuestions } from '../redux/report/thunk';
import { push } from 'connected-react-router';
import { ReportOverallLineChart } from './ReportOverallLineChart';
//import Example from './testChart';

const ReportOverall: React.FC = () => {
  const router = useReactRouter<{ lastXMeetings: string }>();
  const lastXMeetings = router.match.params.lastXMeetings;
  const dispatch = useDispatch();
  const questionByMeetingIds = useSelector(  (rootState: RootState) => rootState.report.questionsByMeetingId);
  const questionsRoot = useSelector(  (rootState: RootState) => rootState.report.questions);
  const questionsCount = useSelector(
    (rootState: RootState) => rootState.report.questionsCountOfLatestMeetings
  );
  const data = questionsCount
  .slice()
  .sort((a, b) => b.meetingId - a.meetingId)
  .slice(0, parseInt(lastXMeetings))
  .map((elem) => {
    const obj = { meetingName: elem.meetingName, count: elem.count };
    return obj;
  });
  const meetingIds = questionsCount
  .slice()
  .sort((a, b) => b.meetingId - a.meetingId)
  .slice(0, parseInt(lastXMeetings))
  .map((elem) => elem.meetingId);
  const meetingIdsOfLatestMeetings = meetingIds;

let youtube =[];
let facebook =[];
let handsup =[];
for(const id of meetingIdsOfLatestMeetings){
 const questionIds = questionByMeetingIds[id];
const questions = questionIds?.map(id=>questionsRoot[`${questionIds}`])
  if(questions?.length>0){
    const yt = questions.filter(elem=>elem?.platformid===3)
    const fb = questions.filter(elem=>elem?.platformid===2)
    const hp = questions.filter(elem=>elem?.platformid===1)
    youtube.push({meetingName:questions[0]?.meetingname, count:yt.length})
    facebook.push({meetingName:questions[0]?.meetingname, count:fb.length})
    handsup.push({meetingName:questions[0]?.meetingname, count:hp.length})
  }
}
  useEffect(() => {
    dispatch(reportQuestionsCountOnLatestXMeetings(lastXMeetings));
    dispatch(fetchReportQuestions('all'));
  }, [dispatch, lastXMeetings]);
  return (
    <div className="report-container">
      Overall
      <div className="d-flex">
        <div className="report-peak-view-outer flex-grow-1">
          <div className="report-header">
            <span>Meetings</span>
          </div>
          <div>123123123</div>
        </div>
        <div className="report-peak-view-outer flex-grow-1">
          <div className="report-header">
            <span>Questions</span>
          </div>
          <div>123123123</div>
        </div>
        <div className="report-peak-view-outer flex-grow-1">
          <div className="report-header">
            <span>Answered</span>
          </div>
          <div>123123123</div>
        </div>
        <div className="report-peak-view-outer flex-grow-1">
          <div className="report-header">
            <span>Converage</span>
          </div>
          <div>123123123</div>
        </div>
        <div className="report-peak-view-outer flex-grow-1">
          <div className="report-header">
            <span>Views</span>
          </div>
          <div>123123123</div>
        </div>
      </div>
      <div className="text-left mb-4 d-flex">
        <button
          className={`util-spacing will-hover rounded question-page-tab ${
            lastXMeetings === '5' && 'is-active'
          }`}
          onClick={() => {
            dispatch(push(`/testing/5`));
          }}
        >
          Last 5 Meetings
        </button>
        <button
          className={`util-spacing will-hover rounded question-page-tab ${
            lastXMeetings === '10' && 'is-active'
          }`}
          onClick={() => {
            dispatch(push(`/testing/10`));
          }}
        >
          Last 10 Meetings
        </button>
        <button
          className={`util-spacing will-hover rounded question-page-tab ${
            lastXMeetings === '15' && 'is-active'
          }`}
          onClick={() => {
            dispatch(push(`/testing/15`));
          }}
        >
          Last 15 meetings
        </button>
      </div>
      <div className="views-chart-outer">
        <div className="report-header">
          <span>Views</span>
        </div>
        <ReportOverallLineChart
          all={data}
          youtube={youtube}
          facebook={facebook}
          handsup={handsup}
        />
      </div>
      {/* <Example /> */}
    </div>
  );
};

export default ReportOverall;
