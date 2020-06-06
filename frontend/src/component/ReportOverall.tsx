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
import { IReportQuestion } from '../models/IReport';
import Loading from './Loading';
import { OverallQuestionsPieChart } from './OverallQuestionPieChart';
//import Example from './testChart';

const ReportOverall: React.FC = () => {
  const router = useReactRouter<{ lastXMeetings: string }>();
  const lastXMeetings = router.match.params.lastXMeetings;
  const dispatch = useDispatch();
  const questionByMeetingIds = useSelector(
    (rootState: RootState) => rootState.report.questionsByMeetingId
  );
  const questionsRoot = useSelector(
    (rootState: RootState) => rootState.report.questions
  );
  const questionsCount = useSelector(
    (rootState: RootState) => rootState.report.questionsCountOfLatestMeetings
  );
  // const [youtubeQuestions, setYoutubeQuestions] = useState<IReportQuestion[]>(
  //   []
  // );
  // const [facebookQuestions, setFacebookQuestions] = useState<IReportQuestion[]>(
  //   []
  // );
  // const [handsupQuestions, setHandsupQuestions] = useState<IReportQuestion[]>(
  //   []
  // );
  // const [youtubeHidQuestions, setYoutubeHidQuestions] = useState<
  //   IReportQuestion[]
  // >([]);
  // const [facebookHidQuestions, setFacebookHidQuestions] = useState<
  //   IReportQuestion[]
  // >([]);
  // const [handsupHidQuestions, setHandsupHidQuestions] = useState<
  //   IReportQuestion[]
  // >([]);
  const [youtubeAnsweredQuestions, setYoutubeAnsweredQuestions] = useState<
    IReportQuestion[]
  >([]);
  const [facebookAnsweredQuestions, setFacebookAnsweredQuestions] = useState<
    IReportQuestion[]
  >([]);
  const [handsupAnsweredQuestions, setHandsupAnsweredQuestions] = useState<
    IReportQuestion[]
  >([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    dispatch(fetchReportQuestions('all'));
  }, [dispatch]);
  useEffect(() => {
    dispatch(reportQuestionsCountOnLatestXMeetings('30'));
  }, [dispatch]);
  /* Pick recent n meetings */
  const t = questionsCount
    .slice()
    .sort((a, b) => b.meetingId - a.meetingId)
    .slice(0, parseInt(lastXMeetings));
  /* data of recent n meetings - lite version for drawing the overall line */
  const data = t
    .slice()
    .sort((a, b) => a.meetingId - b.meetingId)
    .map((elem) => {
      const obj = { meetingName: elem.meetingName, count: elem.count };
      return obj;
    });
  /* get only the meeting id of recent x meetings -- will use to map questions */
  const meetingIds = t
    .slice()
    .sort((a, b) => a.meetingId - b.meetingId)
    .map((elem) => elem.meetingId);

  /* Data for no of questions */
  type dataSubset = { meetingName: string; count: number };
  type dataType = { questionCount: dataSubset[]};
  const youtube: dataType = { questionCount: []};
  const facebook: dataType = { questionCount: []};
  const handsup: dataType = { questionCount: []};
  const pieChartData:{isHide:number, isAnswered:number, totalQuestions:number}={isHide:0, isAnswered:0, totalQuestions:0}
  useEffect(() => {
    const youtubeQuestions: IReportQuestion[] = [];
    const facebookQuestions: IReportQuestion[] = [];
    const handsupQuestions: IReportQuestion[] = [];
    const youtubeHidQuestions: IReportQuestion[] = [];
    const facebookHidQuestions: IReportQuestion[] = [];
    const handsupHidQuestions: IReportQuestion[] = [];
    const youtubeAnsweredQuestions: IReportQuestion[] = [];
    const facebookAnsweredQuestions: IReportQuestion[] = [];
    const handsupAnsweredQuestions: IReportQuestion[] = [];
    for (const key in questionsRoot) {
      if (questionsRoot[key].platformid === 3) {
        youtubeQuestions.push(questionsRoot[key]);
        if (questionsRoot[key].ishide) {
          youtubeHidQuestions.push(questionsRoot[key]);
        } else if (questionsRoot[key].isanswered) {
          youtubeAnsweredQuestions.push(questionsRoot[key]);
        }
      } else if (questionsRoot[key].platformid === 2) {
        facebookQuestions.push(questionsRoot[key]);
        if (questionsRoot[key].ishide) {
          facebookHidQuestions.push(questionsRoot[key]);
        } else if (questionsRoot[key].isanswered) {
          facebookAnsweredQuestions.push(questionsRoot[key]);
        }
      } else if (questionsRoot[key].platformid === 1) {
        handsupQuestions.push(questionsRoot[key]);
        if (questionsRoot[key].ishide) {
          handsupHidQuestions.push(questionsRoot[key]);
        } else if (questionsRoot[key].isanswered) {
          handsupAnsweredQuestions.push(questionsRoot[key]);
        }
      }
    }
    // setYoutubeQuestions(youtubeQuestions);
    // setFacebookQuestions(facebookQuestions);
    // setHandsupQuestions(handsupQuestions);
    // setYoutubeHidQuestions(youtubeHidQuestions);
    // setFacebookHidQuestions(facebookHidQuestions);
    // setHandsupHidQuestions(handsupHidQuestions);
    setYoutubeAnsweredQuestions(youtubeAnsweredQuestions);
    setFacebookAnsweredQuestions(facebookAnsweredQuestions);
    setHandsupAnsweredQuestions(handsupAnsweredQuestions);
  }, [questionsRoot]);
  for (const id of meetingIds) {
    const questionIds = questionByMeetingIds[`${id}`];
    const questions = questionIds?.map((id) => questionsRoot[`${id}`]);
    if (questions?.length > 0) {
      const yt = questions.filter((elem) => elem?.platformid === 3);
      const fb = questions.filter((elem) => elem?.platformid === 2);
      const hp = questions.filter((elem) => elem?.platformid === 1);
      const isHide = questions.filter((elem) => elem?.ishide);
      const isAnswered = questions.filter((elem) => !elem?.ishide && elem?.isanswered);
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
      pieChartData.isHide += isHide.length;
      pieChartData.isAnswered += isAnswered.length;
      pieChartData.totalQuestions += questions.length;
    }
  }
  useEffect(()=>{
setTimeout(()=>setLoading(false), 400)
  },[]);

  return (
    <>
      {loading && (
        <Loading />
      )}
      {!loading && (
        <div className="report-container">
          Overall
          <div className="d-flex">
            <div className="report-peak-view-outer flex-grow-1">
              <div className="report-header">
                <span>Meetings</span>
              </div>
              <div>{Object.keys(questionByMeetingIds).length}</div>
            </div>
            <div className="report-peak-view-outer flex-grow-1">
              <div className="report-header">
                <span>Questions</span>
              </div>
              <div>{Object.keys(questionsRoot).length}</div>
            </div>
            <div className="report-peak-view-outer flex-grow-1">
              <div className="report-header">
                <span>Answered</span>
              </div>
              <div>
                {youtubeAnsweredQuestions.length +
                  facebookAnsweredQuestions.length +
                  handsupAnsweredQuestions.length}
              </div>
            </div>
            <div className="report-peak-view-outer flex-grow-1">
              <div className="report-header">
                <span>Converage</span>
              </div>
              <div>
                {(
                  ((youtubeAnsweredQuestions.length +
                    facebookAnsweredQuestions.length +
                    handsupAnsweredQuestions.length) /
                    Object.keys(questionsRoot).length) *
                  100
                ).toFixed(2)}
                %
              </div>
            </div>
            <div className="report-peak-view-outer flex-grow-1">
              <div className="report-header">
                <span>Avg. Questions</span>
              </div>
              <div>
                {Math.floor(
                  Object.keys(questionsRoot).length /
                    Object.keys(questionByMeetingIds).length
                )}
              </div>
            </div>
          </div>
          Recent
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
              <span>Questions</span>
            </div>
            <ReportOverallLineChart
              all={data}
              youtube={youtube['questionCount']}
              facebook={facebook['questionCount']}
              handsup={handsup['questionCount']}
            />
          </div>
          <div className="questions-pie-chart-outer">
                    <div className="report-header"><span>Your Questions Analysis</span></div>
                    <OverallQuestionsPieChart isHide={pieChartData.isHide} isAnswered={pieChartData.isAnswered} notAnswered={pieChartData.totalQuestions-pieChartData.isHide-pieChartData.isAnswered}/>
          </div>
          {/* <Example /> */}
        </div>
      )}{' '}
    </>
  );
};

export default ReportOverall;
