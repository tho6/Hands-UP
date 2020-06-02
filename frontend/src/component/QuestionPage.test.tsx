import '@testing-library/jest-dom';
import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import Reply, { IReplyProps } from './Reply';
import Question, { IQuestionProps } from './Question';
import { reply } from '../models/IQuestion';
import { IGuest } from '../models/IUserQ';
// import { useDispatch } from 'react-redux';
import * as dependency from 'react-redux';
import useReactRouter from 'use-react-router';
import { mockComponent } from 'react-dom/test-utils';
import { IRoomInformation } from '../models/IRoomInformation';
import { push } from 'connected-react-router';
import QuestionPage from './QuestionPage';
import { debuglog } from 'util';
jest.mock('./Question',()=>{
  return {
    __esModule: true,
    A: true,
    default: () => {
      return <div>QuestionComponent</div>;
    },
  };
});
jest.mock('react-redux', () => {
  const mockQuestions = [
    {
      id: 1,
      questioner: {
        name: 'Anonymous',
        id: 1
      },
      content:
        'Hi how are you? akjdfk kjsadkj hakjdk jkshdkj kjadskjk akjdhkj kahdskj akdsjhkajsd aksjdhkj sdkjahskd aksjdka sdkjaskd askjd kjss dkjfkdf jdfkjshfahdjfahdljfk hwif sjdhf kajhsdfklhdfkjahsdkjfha kdfhakjshdf sjhdfkjasd fkjahsd kfha ksjdfh kashdjf lakjshdfkahskdjfhak dfhlaks fkah dfk',
      likes: [1, 2, 3, 7, 8, 9],
      replies: [],
      files: [
        { id: 1, filename: '1234.png' },
        { id: 2, filename: '123.png' }
      ],
      meetingId: 1,
      isHide: false,
      isAnswered: false,
      isApproved: true,
      createdAt: Date.now() - 1000,
      updatedAt: Date.now() - 1000
    },
    {
      id: 2,
      questioner: {
        name: 'Anonymous',
        id: 2
      },
      content:
        'Hi how are you? akjdfk kjsadkj hakjdk jkshdkj kjadskjk akjdhkj kahdskj akdsjhkajsd aksjdhkj sdkjahskd aksjdka sdkjaskd askjd kjss dkjfkdf jdfkjshfahdjfahdljfk hwif sjdhf kajhsdfklhdfkjahsdkjfha kdfhakjshdf sjhdfkjasd fkjahsd kfha ksjdfh kashdjf lakjshdfkahskdjfhak dfhlaks fkah dfk',
      likes: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      replies: [],
      files: [],
      meetingId: 1,
      isHide: false,
      isAnswered: false,
      isApproved: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ];
  const tCurrentGuest = {
    user: { userId:1, guestId: 1, isHost: true, name: 'Anonymous' }
  };
  
  // const tCurrentHost = {
  //   user: { guestId: 1, name: 'Host', isHost: true }
  // };
  
  const roomInformation: IRoomInformation = {
    id: 1,
    owenId: 1,
    name: 'TestingRoom1',
    code: '#string',
    is_live: true,
    canModerate: true,
    canUploadFiles: true,
    questionLimit: 10,
  };
  const personInfo ={
    userId: 1,
    guestId: 1,
    guestName: 'Annonymous'
  }
  const questionStatus ={}
  const liveStatus={1:{facebook:false, youtube:false}}
  return {
    connect: (mapStateToProps:any, mapDispatchToProps:any) => (ReactComponent:any) => ({
      mapStateToProps,
      mapDispatchToProps,
      ReactComponent
    }),
    //useSelector:jest.fn().mockReturnValueOnce([1,2]).mockReturnValueOnce(personInfo).mockReturnValueOnce(mockQuestions).mockReturnValueOnce(roomInformation).mockReturnValueOnce(questionStatus).mockResolvedValueOnce(liveStatus),
    useSelector: jest.fn().mockImplementation(selector => selector({
      roomsInformation: {
        roomsInformation:{
          1: roomInformation
        },
        liveStatus:liveStatus,
        questionLimitStatus:questionStatus
      },
      questions: { 
        questionsByMeetingId: {
          1:[1,2]
        },
        questions:{
          1:mockQuestions[0],
          2:mockQuestions[1]
        }
      },
      auth:{
        personInfo:personInfo
        
      }
    }
    )),
    //@ts-ignore
    Provider: ({ children }) => children,
    useDispatch:jest.fn(()=>{return ()=>{}})
  }
})
jest.mock('use-react-router',()=>{
  const useReactRouter = jest.fn().mockReturnValue({match:{params:{ id: 1, page: 'main' }}})
  return useReactRouter;
});
jest.mock('connected-react-router');


describe.skip('QuestionPage component', () => {
  beforeEach(() => {
   // (Question as any as jest.Mock).mockReturnValue(<div>QuestionComponent</div>);
    // (Reply as any as  jest.Mock).mockReturnValue(<div>ReplyComponent</div>);
  });
  //const props:IQuestionProps = {question, user: guest1, canUploadFiles:false, answering:false}
  describe('guest', () => {
    it('render QuestionPage component - contains textarea for new question, 2 question components', async () => {
      const debug = render(<QuestionPage />);
      debug.debug();
      expect(screen.queryByTestId('textarea-new-question')).toBeInTheDocument();
     //expect(screen.queryAllByText(/QuestionComponent/)).toBeInTheDocument();
    });
    it('render QuestionPage component - host, different tabs', async () => {
      render(<QuestionPage />);
      expect(screen.queryByTestId('textarea-new-question')).toBeInTheDocument();
      expect(screen.queryByTestId('moderation-count')).not.toBeInTheDocument();
      expect(screen.queryByTestId('moderation-tab')).toBeInTheDocument();
      expect(screen.queryByTestId('inappropriate-questions-tab')).toBeInTheDocument();
      expect(screen.queryByTestId('inappropriate-replies-tab')).toBeInTheDocument();
      expect(screen.queryByTestId('facebook-live')).toBeInTheDocument();
      expect(screen.queryByTestId('youtube-live')).toBeInTheDocument();
    });
   });
});
