import '@testing-library/jest-dom';
import React from 'react';
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
    user: { guestId: 1, isHost: false, name: 'Anonymous' }
  };
  
  const tCurrentHost = {
    user: { guestId: 1, name: 'Host', isHost: true }
  };
  
  const roomInformation: IRoomInformation = {
    id: 1,
    owenId: 1,
    name: 'TestingRoom1',
    code: '#string',
    is_live: true,
    canModerate: true,
    canUploadFiles: true,
    questionLimit: 10,
    userInformation: { ...tCurrentGuest.user }
  };
  return {
    connect: (mapStateToProps:any, mapDispatchToProps:any) => (ReactComponent:any) => ({
      mapStateToProps,
      mapDispatchToProps,
      ReactComponent
    }),
    useSelector:jest.fn().mockReturnValueOnce([1,2])
    .mockReturnValueOnce(mockQuestions)
    .mockReturnValueOnce(roomInformation),
    //@ts-ignore
    Provider: ({ children }) => children,
    useDispatch:jest.fn(()=>{return ()=>{}})
  }
})
jest.mock('use-react-router');
jest.mock('connected-react-router');
jest.mock('./Question');

describe('QuestionPage component', () => {
  beforeEach(() => {
    (Question as any as  jest.Mock).mockReturnValue(<div>QuestionComponent</div>);
    (useReactRouter as jest.Mock).mockReturnValue({match:{params:{ id: 1, page: 'main' }}});
  });
  const reply: reply = {
    id: 1,
    guestId: 1,
    guestName: 'Anonymous',
    content: 'string string',
    questionId: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isHide: false
  };
  const question = {
    id: 3,
    questioner: {
      name: 'Anonymous',
      id: 3
    },
    content: 'This is a new question',
    likes: [2, 3, 4, 5, 6, 7, 11, 12],
    replies: [reply],
    files: [],
    meetingId: 1,
    isHide: false,
    isAnswered: false,
    isApproved: true,
    createdAt: Date.now() + 2000,
    updatedAt: Date.now() + 2000
  };
  const host: IGuest = { name: 'host', guestId: 2, isHost: true };
  const guest1: IGuest = { isHost: false, name: 'Anonymous', guestId: 1 };
  const guest2: IGuest = { isHost: false, name: 'Anonymous2', guestId: 2 };
  const meetingId = 1;
  //const props:IQuestionProps = {question, user: guest1, canUploadFiles:false, answering:false}
  describe('guest', () => {
    it('render QuestionPage component - contains textarea for new question, 2 question components', async () => {
      const{debug} = render(<QuestionPage />);
     debug();
  
      expect(screen.queryByTestId('textarea-new-question')).toBeInTheDocument();
      expect(screen.queryAllByText(/QuestionComponent/).length).toBe(2);
    });
//     it('render reply component - contains no reply', async () => {
//       render(
//         <Question
//           question={{ ...question, replies: [] }}
//           user={guest1}
//           canUploadFiles={false}
//           answering={false}
//           isModerate={false}
//         />
//       );
//       // const elements = screen.getAllByText(/ReplyComponent/);
//       // expect(elements.length).toEqual(0);
//       expect(screen.queryByText('ReplyComponent')).not.toBeInTheDocument();
//     });
//     it('render reply component - not questioner, no edit button, not answering', async () => {
//       render(
//         <Question
//           question={question}
//           user={guest1}
//           canUploadFiles={false}
//           answering={false}
//           isModerate={false}
//         />
//       );
//       expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument();
//       expect(screen.queryByTestId('answering')).not.toBeInTheDocument();
//     });
//     it('render reply component - questioner, edit button, answering', async () => {
//       render(
//         <Question
//           isModerate={false}
//           question={question}
//           user={{ ...guest1, guestId: 3 }}
//           canUploadFiles={false}
//           answering={true}
//         />
//       );
//       const elements = screen.queryByTestId('edit-button');
//       expect(elements).toBeInTheDocument();
//       expect(screen.queryByTestId('answering')).toBeInTheDocument();
//     });
//     it('render reply component - upload image enable', async () => {
//       render(
//         <Question
//           isModerate={false}
//           question={question}
//           user={{ ...guest1, guestId: 3 }}
//           canUploadFiles={true}
//           answering={true}
//         />
//       );
//       const elements = screen.queryByTestId('edit-button');
//       elements!.click();
//       expect(screen.queryByTestId('camera')).toBeInTheDocument();
//     });
//     it('render reply component - upload image disable', async () => {
//       render(
//         <Question
//           isModerate={false}
//           question={question}
//           user={{ ...guest1, guestId: 3 }}
//           canUploadFiles={false}
//           answering={true}
//         />
//       );
//       const elements = screen.queryByTestId('edit-button');
//       elements!.click();
//       expect(screen.queryByTestId('camera')).not.toBeInTheDocument();
//     });
//     it('render reply component - no images', async () => {
//       render(
//         <Question
//           isModerate={false}
//           question={question}
//           user={{ ...guest1, guestId: 3 }}
//           canUploadFiles={true}
//           answering={true}
//         />
//       );
//       expect(screen.queryByTestId('image')).not.toBeInTheDocument();
//     });
//     it('render reply component - has 2 images', async () => {
//       render(
//         <Question
//           isModerate={false}
//           question={{
//             ...question,
//             files: [
//               { id: 1, filename: '123.png' },
//               { id: 2, filename: '456.png' }
//             ]
//           }}
//           user={{ ...guest1, guestId: 3 }}
//           canUploadFiles={true}
//           answering={true}
//         />
//       );
//       expect(screen.queryAllByTestId('image').length).toBe(2);
//     });
//     it('render reply component - contains reply but the reply is hidden', async () => {
//       render(
//         <Question
//           question={{ ...question, replies: [{ ...reply, isHide: true }] }}
//           user={guest1}
//           canUploadFiles={false}
//           answering={false}
//           isModerate={false}
//         />
//       );
//       expect(screen.queryAllByText(/ReplyComponent/).length).toEqual(0);
//       expect(screen.queryByText('[0]')).toBeInTheDocument();
//     });
//     it('render reply component - when question is at moderation, but you are not host', async () => {
//       render(
//         <Question
//           question={question}
//           user={guest1}
//           canUploadFiles={false}
//           answering={false}
//           isModerate={true}
//         />
//       );
//       expect(screen.queryByTestId('approved-button')).not.toBeInTheDocument();
//       expect(screen.queryByTestId('hide-button')).not.toBeInTheDocument();
//     });
//   });
//   describe('host', () => {
//     it('render reply component - not questioner, but edit button should be displayed, hide button should be displayed', async () => {
//       render(
//         <Question
//           question={question}
//           user={host}
//           canUploadFiles={false}
//           answering={false}
//           isModerate={false}
//         />
//       );
//       expect(screen.queryByTestId('edit-button')).toBeInTheDocument();
//       expect(screen.queryByTestId('hide-button')).toBeInTheDocument();
//     });
//     it('render reply component - when question is at moderation', async () => {
//       render(
//         <Question
//           question={question}
//           user={host}
//           canUploadFiles={false}
//           answering={false}
//           isModerate={true}
//         />
//       );
//       expect(screen.queryByTestId('approve-button')).toBeInTheDocument();
//       expect(screen.queryAllByTestId('hide-button').length).toBe(2);
//     });
   });
});
