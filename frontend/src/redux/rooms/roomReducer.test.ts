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
            owenId: 1,
            name: 'TestingRoom1',
            code: '#string',
            is_live: true,
            canModerate: false, canUploadFiles: false, questionLimit: 10,
        }
        initialState = {
            roomsInformation: {},
            token: null,
        };

    })

    it("fetch room information", () => {
        const finalState = roomsReducer(initialState, action.loadedRoomInformation(roomInformation));
        expect(finalState).toEqual({
           roomsInformation:{1:roomInformation}, token: null
        });
    });
    // it("update room information", () => {
    //     const roomConfiguration:IRoomConfiguration = {canModerate:true, canUploadFiles:true, question_limit:20}
    //     const finalState = roomsReducer(initialState, action.successfullyUpdatedRoomConfiguration(2,roomConfiguration));
    //     expect(finalState).toEqual({
    //        roomsInformation:{2:{...roomInformation, canModerate:true,canUploadFiles:true,question_limit:20}}, token: null
    //     });
    // });
});