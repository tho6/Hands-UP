import React, { useEffect } from 'react';
import ReportOverallChart from './ReportOverallChart';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import useReactRouter from 'use-react-router';
import { reportQuestionsCountOnLatestXMeetings } from '../redux/report/thunk';
import { push } from 'connected-react-router';
//import Example from './testChart';

const ReportOverall: React.FC = () => {
  const router = useReactRouter<{ lastXMeetings: string }>();
  const lastXMeetings = router.match.params.lastXMeetings;
  const dispatch = useDispatch();
  const questionsCount = useSelector(
    (rootState: RootState) => rootState.report.questionsCountOfLatestMeetings
  );
  const data = questionsCount
    .slice()
    .sort((a, b) => b.meetingId - a.meetingId)
    .slice(0, parseInt(lastXMeetings));
  useEffect(() => {
    dispatch(reportQuestionsCountOnLatestXMeetings(lastXMeetings));
  }, [dispatch, lastXMeetings]);
  return (
    <div>
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
      <ReportOverallChart questionsCount={data} />
      {/* <Example /> */}
    </div>
  );
};

export default ReportOverall;
