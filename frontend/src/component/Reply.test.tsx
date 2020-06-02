import '@testing-library/jest-dom'
import React from 'react';
import {render, screen} from '@testing-library/react'
import Reply, {IReplyProps} from './Reply';
import { reply } from '../models/IQuestion';
import { PersonInfo } from '../redux/auth/reducers';

jest.mock('react-redux');

describe("Reply component",()=>{
    let props:IReplyProps ;
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
  const host:PersonInfo= {guestName:'host',guestId:10,userId:1};
  const guest1:PersonInfo = {guestName:'Anonymous',guestId:1};
  const guest2:PersonInfo = {guestName:'Anonymous2',guestId:2};
  
    it("render reply component - you are the replier edit -> cancel",async ()=>{
        render(<Reply reply={reply} user={guest1} meetingId={1} isHost={false}/>);
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
        render(<Reply reply={reply} user={guest1} meetingId={1} isHost={false}/>)
        const element = screen.queryByTestId('edit-button');
        element?.click();
        screen.queryByTestId('delete-button')?.click();
        expect(screen.getByText('Delete Warnings!')).toBeInTheDocument();
    })
    it("render reply component - you are not the replier",async ()=>{
      const replyWithSecondGuestName = {...reply, guestName:'Anonymous2'}
        render(<Reply reply={replyWithSecondGuestName} user={guest2} meetingId={1} isHost={false}/>)
        const element = screen.queryByTestId('edit-button');
        const name = screen.getByText('Anonymous2');
        expect(name).toBeInTheDocument();
        expect(element).toBeFalsy();
    })
    it("render reply component - guestId not the same, but you are the host",async ()=>{
        render(<Reply reply={reply} user={host} meetingId={1} isHost={true}/>)
        const element = screen.queryByTestId('edit-button');
        expect(element).toBeInTheDocument();
    })
    it("render reply component - edited ",async ()=>{
      const editedReply = {...reply, updatedAt:new Date(Date.now()+1)}
        render(<Reply reply={editedReply} user={guest1} meetingId={1} isHost={false}/>)
        const element = screen.getByText(/\[Edited\]/);
        const element2 = screen.getByText('[Edited]');
        expect(element).toBeInTheDocument();
        expect(element2).toBeInTheDocument();
    })
    it("render reply component - not edited ",async ()=>{
        render(<Reply reply={reply} user={guest1} meetingId={1} isHost={false}/>)
        expect(screen.queryByText('[Edited]')).not.toBeInTheDocument();
    })
    it("render reply component - host, hide button occurs ",async ()=>{
        render(<Reply reply={reply} user={host} meetingId={1} isHost={true}/>)
        expect(screen.queryByTestId('hide-button')).toBeInTheDocument();
    })
    it("render reply component - guest, no hide button ",async ()=>{
        render(<Reply reply={reply} user={guest1} meetingId={1} isHost={false}/>)
        expect(screen.queryByTestId('hide-button')).not.toBeInTheDocument();
    })
    it("render reply component - host, inappropriate reply",async ()=>{
        const newReply={...reply, isHide:true}
        render(<Reply reply={newReply} user={host} meetingId={1} isHost={true}/>)
        expect(screen.queryByTestId('display-button')).toBeInTheDocument();
        expect(screen.queryByTestId('hide-button')).not.toBeInTheDocument();
    })
});

