import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import useReactRouter from 'use-react-router';
import { reportQuestionsCountOnLatestXMeetings, fetchReportQuestions } from '../redux/report/thunk';
import { push } from 'connected-react-router';
import { ReportOverallLineChart } from './ReportOverallLineChart';
import { IReportQuestion } from '../models/IReport';
//import Example from './testChart';

const ReportOverall: React.FC = () => {
  const router = useReactRouter<{ lastXMeetings: string }>();
  const lastXMeetings = router.match.params.lastXMeetings;
  const dispatch = useDispatch();
  const questionsCount = useSelector(
    (rootState: RootState) => rootState.report.questionsCountOfLatestMeetings
  );
  const meetingIdsOfLatestMeetings = questionsCount.map(elem=>elem.meetingId);
  const allLatestQuestionsId = useSelector(
    (rootState: RootState) =>meetingIdsOfLatestMeetings.map(id=>rootState.report.questionsByMeetingId[`${id}`])
  );
  let allLatestQuestions:IReportQuestion[] =[];
  if(allLatestQuestions.length>0){
    allLatestQuestions
  }
  const data = questionsCount
    .slice()
    .sort((a, b) => b.meetingId - a.meetingId)
    .slice(0, parseInt(lastXMeetings))
    .map((elem) => {
      const obj = { meetingName: elem.meetingName, count: elem.count };
      return obj;
    });
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
          youtube={[]}
          facebook={[]}
          handsup={[]}
        />
      </div>
      {/* <Example /> */}
    </div>
  );
};

export default ReportOverall;
