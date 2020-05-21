import '@testing-library/jest-dom'
import React from 'react';
import {render, screen, fireEvent, queryByTestId} from '@testing-library/react'
import Reply, {IReplyProps} from './Reply';
import { reply } from '../models/IQuestion';
import { IUserQ, IGuest } from '../models/IUserQ';
// import { useDispatch } from 'react-redux';
import * as dependency from 'react-redux';

jest.mock('react-redux');

describe("Reply component",()=>{
    let props:IReplyProps ;
    const reply:reply = {
      id: 1,
      guestId: 1,
      guestName: 'Anonymous',
      content: 'string string',
      questionId: 1,
      createdAt: Date.now(),
      updatedAt: Date.now()
  }
  const host:IUserQ = {name:'host',userId:1, isHost:true}
  const guest1:IGuest = {name:'Anonymous',guestId:1}
  const guest2:IGuest = {name:'Anonymous2',guestId:2}
  const meetingId = 1;
  
    it("render reply component - you are the replier edit -> cancel",async ()=>{
        render(<Reply reply={reply} user={guest1} meetingId={1}/>);
        const name = screen.getByText('Anonymous');
        expect(name).toBeInTheDocument();
        const element = screen.queryByTestId('edit-button');
        expect(element).toBeInTheDocument();
        element?.click();
        expect(element).not.toBeInTheDocument();
        expect(screen.queryByTestId('text-area')).toHaveTextContent(reply.content);
        expect(screen.queryByTestId('cancel-button')).toBeInTheDocument();
        expect(screen.queryByTestId('save-button')).toBeInTheDocument();
        expect(screen.queryByTestId('delete-button')).toBeInTheDocument();
        screen.queryByTestId('cancel-button')?.click();
        expect(screen.queryByTestId('edit-button')).toBeInTheDocument();
        expect(screen.queryByTestId('cancel-button')).not.toBeInTheDocument();
        expect(screen.queryByTestId('save-button')).not.toBeInTheDocument();
        expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
        expect(screen.queryByTestId('text-area')).not.toBeInTheDocument();
    })
    it("render reply component - press delete button",async ()=>{
        render(<Reply reply={reply} user={guest1} meetingId={1}/>)
        const element = screen.queryByTestId('edit-button');
        element?.click();
        screen.queryByTestId('delete-button')?.click();
        expect(screen.getByText('Delete Warnings!')).toBeInTheDocument();
    })
    it("render reply component - you are not the replier",async ()=>{
      const replyWithSecondGuestName = {...reply, guestName:'Anonymous2'}
        render(<Reply reply={replyWithSecondGuestName} user={guest2} meetingId={1}/>)
        const element = screen.queryByTestId('edit-button');
        const name = screen.getByText('Anonymous2');
        expect(name).toBeInTheDocument();
        expect(element).toBeFalsy();
    })
    it("render reply component - userId equals to guestId, should not be able to edit",async ()=>{
        render(<Reply reply={reply} user={host} meetingId={1}/>)
        const element = screen.queryByTestId('edit-button');
        expect(element).toBeFalsy();
    })
    it("render reply component - edited ",async ()=>{
      const editedReply = {...reply, updatedAt:1}
        render(<Reply reply={editedReply} user={guest1} meetingId={1}/>)
        const element = screen.getByText(/\[Edited\]/);
        const element2 = screen.getByText('[Edited]');
        expect(element).toBeInTheDocument();
        expect(element2).toBeInTheDocument();
    })
    it("render reply component - not edited ",async ()=>{
        render(<Reply reply={reply} user={guest1} meetingId={1}/>)
        expect(screen.queryByTestId('edited-sign')).not.toBeInTheDocument();
    })
});

