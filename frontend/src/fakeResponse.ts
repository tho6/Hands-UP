export const tFetchRoomInformation = {
    status: true, message: {
        id: 1,
        owenId: 1,
        name: 'TestingRoom1',
        code: '#string',
        is_live: true,
        canModerate: false, canUploadFiles: false, questionLimit: 10
    }
}
export const tLoginAsGuest = {
    status: true, message: 'fakeToken'
    
}
export const tUserIsNotAHost = {
    status: true, message: {userId:1, isHost:false, name:'im not a host'}
    
}
export const tCurrentGuest = {
    status: true, message: {guestId:1, name:'Anonymous'}
    
}
export const tFetchQuestions = {
    status: true, message: [{
        id: 1,
        questioner: {
            name: 'Anonymous',
            id: 1,
        },
        content: "Hi how are you? akjdfk kjsadkj hakjdk jkshdkj kjadskjk akjdhkj kahdskj akdsjhkajsd aksjdhkj sdkjahskd aksjdka sdkjaskd askjd kjss dkjfkdf jdfkjshfahdjfahdljfk hwif sjdhf kajhsdfklhdfkjahsdkjfha kdfhakjshdf sjhdfkjasd fkjahsd kfha ksjdfh kashdjf lakjshdfkahskdjfhak dfhlaks fkah dfk",
        likes: 10,
        replies: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        files: [],
        meetingId: 1,
        isHide: false,
        isAnswered: false,
        isModerate: false
    }]
}
export const tDeleteQuestionSuccess = {status: true, message:''}
export const tEditQuestionPlainTextSuccess = {status: true, message:''}
export const tUserToken = null;
export const tGuestToken = null;