import '@testing-library/jest-dom'
import React from 'react';
import {render, screen} from '@testing-library/react'
import Reply from './Reply';
import Question from './Question';
import { reply } from '../models/IQuestion';
import {  IGuest } from '../models/IUserQ';


jest.mock('react-redux');
jest.mock('./Reply');


describe("Question component",()=>{
    beforeEach(()=>{
        (Reply as any as  jest.Mock).mockReturnValue(<div>ReplyComponent</div>);
    })
    const reply:reply = {
        id: 1,
        guestId: 1,
        guestName: 'Anonymous',
        content: 'string string',
        questionId: 1,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        isHide: false
    }
    const question = {
        id: 3,
        questioner: {
            name: 'Anonymous',
            id: 3,
        },
        content: "This is a new question",
        likes: [2, 3, 4, 5, 6, 7, 11, 12],
        replies: [reply],
        files: [],
        meetingId: 1,
        isHide: false,
        isAnswered: false,
        isApproved: true,
        createdAt: new Date(Date.now()+2000),
        updatedAt: new Date(Date.now()+2000),
        platform:{id:1, name:'project3'}
    }
    const host:IGuest= {name:'host',guestId:10, isHost:true}
    const guest1:IGuest = {isHost: false, name:'Anonymous',guestId:1}
    const guest2:IGuest = {isHost: false, name:'Anonymous2',guestId:2}
    const meetingId = 1;
    //const props:IQuestionProps = {question, user: guest1, canUploadFiles:false, answering:false}
    describe('guest',()=>{
        it("render question component - contains one reply",async ()=>{
            render(<Question question={question} user={guest1} canUploadFiles={false} answering={false} isModerate={false}/>);
            const elements = screen.getAllByText(/ReplyComponent/);
            expect(elements.length).toEqual(1);
            expect(screen.getByText('[1]')).toBeInTheDocument();
        })
        it("render question component - contains no reply",async ()=>{
            render(<Question question={{...question, replies:[]}} user={guest1} canUploadFiles={false} answering={false} isModerate={false}/>);
            // const elements = screen.getAllByText(/ReplyComponent/);
            // expect(elements.length).toEqual(0);
           expect(screen.queryByText('ReplyComponent')).not.toBeInTheDocument();
        })
        it("render question component - not questioner, no edit button, not answering",async ()=>{
            render(<Question question={question} user={guest1} canUploadFiles={false} answering={false} isModerate={false}/>);
            expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument();
            expect(screen.queryByTestId('answering')).not.toBeInTheDocument();
        })
        it("render question component - questioner, edit button, answering",async ()=>{
            render(<Question  isModerate={false} question={question} user={{...guest1, guestId:3}} canUploadFiles={false} answering={true}/>);
            const elements = screen.queryByTestId('edit-button');
            expect(elements).toBeInTheDocument();
            expect(screen.queryByTestId('answering')).toBeInTheDocument();
        })
        it("render question component - upload image enable",async ()=>{
            render(<Question  isModerate={false} question={question} user={{...guest1, guestId:3}} canUploadFiles={true} answering={true}/>);
            const elements = screen.queryByTestId('edit-button');
            elements!.click();
            expect(screen.queryByTestId('camera')).toBeInTheDocument();
        })
        it("render question component - upload image disable",async ()=>{
            render(<Question isModerate={false} question={question} user={{...guest1, guestId:3}} canUploadFiles={false} answering={true}/>);
            const elements = screen.queryByTestId('edit-button');
            elements!.click();
            expect(screen.queryByTestId('camera')).not.toBeInTheDocument();
        })
        it("render question component - no images",async ()=>{
            render(<Question isModerate={false} question={question} user={{...guest1, guestId:3}} canUploadFiles={true} answering={true}/>);
            expect(screen.queryByTestId('image')).not.toBeInTheDocument();
        })
        it("render question component - has 2 images",async ()=>{
            render(<Question isModerate={false} question={{...question, files:[{id:1, filename:'123.png'}, {id:2, filename:'456.png'}]}} user={{...guest1, guestId:3}} canUploadFiles={true} answering={true}/>);
            expect(screen.queryAllByTestId('image').length).toBe(2);
        })
        it("render question component - contains reply but the reply is hidden",async ()=>{
            render(<Question question={{...question, replies:[{...reply, isHide:true}]}} user={guest1} canUploadFiles={false} answering={false} isModerate={false}/>);
            expect(screen.queryAllByText(/ReplyComponent/).length).toEqual(0);
            expect(screen.queryByText('[0]')).toBeInTheDocument();
        })
        it("render question component - when question is at moderation, but you are not host",async ()=>{
            render(<Question question={question} user={guest1} canUploadFiles={false} answering={false} isModerate={true}/>);
            expect(screen.queryByTestId('approved-button')).not.toBeInTheDocument();
            expect(screen.queryByTestId('hide-button')).not.toBeInTheDocument();
        })
    });
    describe('host',()=>{
        it("render question component - not questioner, but edit button should be displayed, hide button should be displayed",async ()=>{
            render(<Question question={question} user={host} canUploadFiles={false} answering={false} isModerate={false}/>);
            expect(screen.queryByTestId('edit-button')).toBeInTheDocument();
            expect(screen.queryByTestId('hide-button')).toBeInTheDocument();
            expect(screen.queryByTestId('approve-button')).not.toBeInTheDocument();
        })
        it("render question component - when question is at moderation",async ()=>{
            render(<Question question={question} user={host} canUploadFiles={false} answering={false} isModerate={true}/>);
            expect(screen.queryByTestId('approve-button')).toBeInTheDocument();
            expect(screen.queryAllByTestId('hide-button').length).toBe(1);
        })
        it("render question component - when question is at not answered and is approved",async ()=>{
            render(<Question question={question} user={host} canUploadFiles={false} answering={false} isModerate={false}/>);
            expect(screen.queryByTestId('answer-button')).toBeInTheDocument();
        })
        it("render question component - inappropriate question should show display button",async ()=>{
            const newQuestion={...question, isApproved:false, isHide:true}
            render(<Question question={newQuestion} user={host} canUploadFiles={false} answering={false} isModerate={false}/>);
            expect(screen.queryByTestId('display-button')).toBeInTheDocument();
        })
    });

});

