import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import useReactRouter from 'use-react-router';
import {
  reportQuestionsCountOnLatestXMeetings,
  fetchReportQuestions
} from '../redux/report/thunk';
import { push } from 'connected-react-router';
import { ReportOverallLineChart } from './ReportOverallLineChart';
// import Loading from './Loading';
import { OverallQuestionsPieChart } from './OverallQuestionPieChart';
import './ReportOverall.scss';
import { OverallQuestionDistributionPieChart } from './OverallQuestionDistributionPieChart';
import { OverallPeakViewBarChart } from './OverallPeakViewBarChart';
import UncontrolledLottie from './UncontrolledLottie';
import { ReportSideDrawer } from './ReportSideDrawer';
import { closeSideDrawer, openSideDrawer } from '../redux/mainNav/actions';

//import Example from './testChart';

const ReportOverall: React.FC = () => {
  const router = useReactRouter<{ lastXMeetings: string }>();
  const lastXMeetings = router.match.params.lastXMeetings;
  const dispatch = useDispatch();
  const isSideDrawerOpen = useSelector((state:RootState)=>state.mainNav.isSideDrawerOpen)
  const questionByMeetingIds = useSelector(
    (rootState: RootState) => rootState.report.questionsByMeetingId
  );
  const questionsRoot = useSelector(
    (rootState: RootState) => rootState.report.questions
  );
  const questionsCount = useSelector(
    (rootState: RootState) => rootState.report.questionsCountOfLatestMeetings
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    dispatch(fetchReportQuestions('all'));
  }, [dispatch]);
  useEffect(() => {
    dispatch(reportQuestionsCountOnLatestXMeetings('15'));
  }, [dispatch]);
  /* Pick recent n meetings */
  const t = questionsCount
    .slice()
    .sort((a, b) => b.meetingId - a.meetingId)
    .slice(0, parseInt(lastXMeetings));
  /* get only the meeting id of recent x meetings -- will use to map questions */
  let meetingIds: number[] = t
    .slice()
    .sort((a, b) => a.meetingId - b.meetingId)
    .map((elem) => elem.meetingId);

  /* Data for no of questions */
  type dataSubset = { meetingName: string; count: number };
  type dataType = { questionCount: dataSubset[] };
  const allPlatform: dataType = { questionCount: [] };
  const youtube: dataType = { questionCount: [] };
  const facebook: dataType = { questionCount: [] };
  const handsup: dataType = { questionCount: [] };
  const pieChartData: {
    isHide: number;
    isAnswered: number;
    totalQuestions: number;
  } = { isHide: 0, isAnswered: 0, totalQuestions: 0 };
  const pieChartDataDistribution: {
    youtube: number;
    facebook: number;
    handsup: number;
  } = { youtube: 0, facebook: 0, handsup: 0 };
  let numberOfQuestions = 0;
  const numberOfMeetings =
    lastXMeetings === 'all'
      ? Object.keys(questionByMeetingIds).length
      : meetingIds.length;
  if (lastXMeetings === 'all') {
    meetingIds = Object.keys(questionByMeetingIds).map((x) => parseInt(x));
  }

  for (const id of meetingIds) {
    const questionIds = questionByMeetingIds[`${id}`];
    const questions = questionIds?.map((id) => questionsRoot[`${id}`]);
    numberOfQuestions += questions?.length;
    if (questions?.length > 0) {
      const yt = questions.filter((elem) => elem?.platformid === 3);
      const fb = questions.filter((elem) => elem?.platformid === 2);
      const hp = questions.filter((elem) => elem?.platformid === 1);
      const isHide = questions.filter((elem) => elem?.ishide);
      const isAnswered = questions.filter(
        (elem) => !elem?.ishide && elem?.isanswered
      );
      youtube['questionCount'].push({
        meetingName: questions[0]?.meetingname,
        count: yt.length
      });
      facebook['questionCount'].push({
        meetingName: questions[0]?.meetingname,
        count: fb.length
      });
      handsup['questionCount'].push({
        meetingName: questions[0]?.meetingname,
        count: hp.length
      });
      allPlatform['questionCount'].push({
        meetingName: questions[0]?.meetingname,
        count: hp.length + yt.length + fb.length
      });
      pieChartData.isHide += isHide.length;
      pieChartData.isAnswered += isAnswered.length;
      pieChartData.totalQuestions += questions.length;
      pieChartDataDistribution.youtube += yt.length;
      pieChartDataDistribution.facebook += fb.length;
      pieChartDataDistribution.handsup += hp.length;
    }
  }
  /* Bar chart data */
  let barCharData: {
    meetingName: string;
    youtube: number;
    facebook: number;
    handsup: number;
  }[] = [];
  if (lastXMeetings !== 'all') {
    const barChartPreData = questionsCount.filter((elem) =>
      meetingIds.includes(elem.meetingId)
    );
    barCharData = barChartPreData.sort((a,b)=>a.meetingId-b.meetingId).map((elem) => {
      const obj = {
        meetingName: elem.meetingName,
        youtube: elem.youtubePeakViews,
        facebook: elem.facebookPeakViews,
        handsup: elem.handsupPeakViews
      };
      return obj;
    });
  }
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => {
      clearTimeout(timer)
    }
  }, []);

  return (
    <>
      {loading && <UncontrolledLottie />}
      {!loading && (
        <>
          <ReportSideDrawer />
        <div className="report-container">
        <div className={isSideDrawerOpen?'report-side-drawer-navbar-toggle-button report-side-drawer-toggle-button-on':'report-side-drawer-navbar-toggle-button report-side-drawer-toggle-button-off'} onClick={() => isSideDrawerOpen?dispatch(closeSideDrawer()):dispatch(openSideDrawer())}>
            <i className="fas fa-angle-right report-side-drawer-navbar-icon"></i>
        </div>
          <header className='report-container-header-row'>
              <span className='report-container-header report-overall-header'>Overall</span>
          </header>
          <div className="text-left mb-4 d-flex sticky-container-top report-button-container">
            <button
              className={`util-spacing will-hover rounded question-page-tab ${
                lastXMeetings === 'all' && 'is-active'
              }`}
              onClick={() => {
                dispatch(push(`/report/overall/all`));
              }}
            >
              All
            </button>
            <button
              className={`util-spacing will-hover rounded question-page-tab ${
                lastXMeetings === '5' && 'is-active'
              }`}
              onClick={() => {
                dispatch(push(`/report/overall/5`));
              }}
            >
              Last 5 Meetings
            </button>
            <button
              className={`util-spacing will-hover rounded question-page-tab ${
                lastXMeetings === '10' && 'is-active'
              }`}
              onClick={() => {
                dispatch(push(`/report/overall/10`));
              }}
            >
              Last 10 Meetings
            </button>
            <button
              className={`util-spacing will-hover rounded question-page-tab ${
                lastXMeetings === '15' && 'is-active'
              }`}
              onClick={() => {
                dispatch(push(`/report/overall/15`));
              }}
            >
              Last 15 meetings
            </button>
          </div>
          <div className="d-flex flex-wrap">
            <div className="report-peak-view-outer flex-grow-1">
              <div className="report-header">
                <span>Meetings</span>
              </div>
              <div>{numberOfMeetings}</div>
            </div>
            <div className="report-peak-view-outer flex-grow-1">
              <div className="report-header">
                <span>Questions</span>
              </div>
              <div>{numberOfQuestions}</div>
            </div>
            <div className="report-peak-view-outer flex-grow-1">
              <div className="report-header">
                <span>Answered</span>
              </div>
              <div>{pieChartData.isAnswered}</div>
            </div>
            <div className="report-peak-view-outer flex-grow-1">
              <div className="report-header">
                <span>Converage</span>
              </div>
              <div>
                {(
                  (pieChartData.isAnswered / pieChartData.totalQuestions) *
                  100
                ).toFixed(2)}
                %
              </div>
            </div>
            <div className="report-peak-view-outer flex-grow-1">
              <div className="report-header">
                <span>Avg. Questions</span>
              </div>
              <div>{Math.floor(numberOfQuestions / numberOfMeetings)}</div>
            </div>
          </div>
          <div className="views-chart-outer">
            <div className="report-header">
              <span>Questions</span>
            </div>
            <ReportOverallLineChart
              range={lastXMeetings}
              all={allPlatform['questionCount']}
              youtube={youtube['questionCount']}
              facebook={facebook['questionCount']}
              handsup={handsup['questionCount']}
            />
          </div>
          <div className="questions-pie-chart-outer">
            <div className="report-header">
              <span>Questions Analysis</span>
            </div>
            <OverallQuestionsPieChart
              isHide={pieChartData.isHide}
              isAnswered={pieChartData.isAnswered}
              notAnswered={
                pieChartData.totalQuestions -
                pieChartData.isHide -
                pieChartData.isAnswered
              }
            />
          </div>
          <div className="questions-pie-chart-outer">
            <div className="report-header">
              <span>Questions Distribution</span>
            </div>
            <OverallQuestionDistributionPieChart
              youtube={pieChartDataDistribution.youtube}
              facebook={pieChartDataDistribution.facebook}
              handsup={pieChartDataDistribution.handsup}
            />
          </div>
          {lastXMeetings!=='all' && <div className="views-chart-outer">
            <div className="report-header">
              <span>Peak Views</span>
            </div>
            <OverallPeakViewBarChart data={barCharData} range={lastXMeetings}/>
          </div>}
        </div>
        </>
      )}{' '}
    </>
  );
};

export default ReportOverall;
