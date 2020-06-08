import { roomsReducer } from './reducers';
import { RoomState } from './reducers';
import * as action from './actions';
import { IRoomInformation, IRoomConfiguration } from '../../models/IRoomInformation';


describe('Question Reducer', () => {
    let initialState: RoomState;
    let roomInformation: IRoomInformation;

    beforeEach(() => {
        roomInformation = {
            id: 1,
            ownerId: 1,
            name: 'TestingRoom1',
            code: '#string',
            is_live: true,
            canModerate: false, canUploadFile: false, questionLimit: 10,
            url:'url',
            createdAt:expect.anything(),
            updatedAt:expect.anything(),
            dateTime:expect.anything(),
        }
        initialState = {
            roomsInformation: {},
            questionLimitStatus: {},
            liveStatus:{},
            message:{status:false, message:''}
        };

    })

    it("fetch room information", () => {
        const finalState = roomsReducer(initialState, action.loadedRoomInformation(roomInformation));
        expect(finalState).toEqual({
            roomsInformation: { 1: roomInformation }, questionLimitStatus: {}, liveStatus:{},  message:{status:false, message:''}
        });
    });
    it("set questionLimit status is checking to true", () => {
        const finalState = roomsReducer(initialState, action.setQuestionLimitState(1, true));
        expect(finalState).toEqual({
            roomsInformation: {}, questionLimitStatus:  {1:{ isChecking: true, count: 1 }}, liveStatus:{},  message:{status:false, message:''}
        });
    });
    it("set questionLimit status is checking to true", () => {
        const finalState = roomsReducer({ ...initialState, questionLimitStatus: {1:{ isChecking: true, count: 100 }} }, action.setQuestionLimitState(1, true));
        expect(finalState).toEqual({
            roomsInformation: {}, questionLimitStatus:  {1:{ isChecking: true, count: 101 }}, liveStatus:{},  message:{status:false, message:''}
        });
    });
    it("set questionLimit status is checking to false", () => {
        const newInitialState = { ...initialState, questionLimitStatus:  {1:{ isChecking: true, count: 100 }} }
        const finalState = roomsReducer(newInitialState, action.setQuestionLimitState(1, false));
        expect(finalState).toEqual({
            roomsInformation: {}, questionLimitStatus:  {1:{ isChecking: false, count: 0 }}, liveStatus:{},  message:{status:false, message:''}
        });
    });
    it("set questionLimit status is checking to false is questionLimitStatus was undefined at first", () => {
        const finalState = roomsReducer(initialState, action.setQuestionLimitState(1, false));
        expect(finalState).toEqual({
            roomsInformation: {}, questionLimitStatus:  {1:{ isChecking: false, count: 0 }}, liveStatus:{}, message:{status:false, message:''}
        });
    });
    // it("update room information", () => {
    //     const roomConfiguration:IRoomConfiguration = {canModerate:true, canUploadFile:true, question_limit:20}
    //     const finalState = roomsReducer(initialState, action.successfullyUpdatedRoomConfiguration(2,roomConfiguration));
    //     expect(finalState).toEqual({
    //        roomsInformation:{2:{...roomInformation, canModerate:true,canUploadFile:true,question_limit:20}}, token: null
    //     });
    // });
});