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
    status: true, message: { userId: 1, isHost: false, name: 'im not a host' }

}
export const tCurrentGuest = {
    status: true, message: { guestId: 1, name: 'Anonymous' }

}
export const tCurrentHost = {
    status: true, message: { userId: 1, name: 'Host', isHost:true }

}
export const tFetchQuestions = {//load questions at first
    status: true, message: [{
        id: 1,
        questioner: {
            name: 'Anonymous',
            id: 1,
        },
        content: "Hi how are you? akjdfk kjsadkj hakjdk jkshdkj kjadskjk akjdhkj kahdskj akdsjhkajsd aksjdhkj sdkjahskd aksjdka sdkjaskd askjd kjss dkjfkdf jdfkjshfahdjfahdljfk hwif sjdhf kajhsdfklhdfkjahsdkjfha kdfhakjshdf sjhdfkjasd fkjahsd kfha ksjdfh kashdjf lakjshdfkahskdjfhak dfhlaks fkah dfk",
        likes: [2,3,4,5,6,7,8,9],
        replies: [],
        isEdit: false,
        files: [],
        meetingId: 1,
        isHide: false,
        isAnswered: false,
        isModerate: false,
        createdAt: new Date(),
        updatedAt: new Date()
    }]
}
export const tNewReply = {//add reply
    status: true, message: {
        id: 1,
        guestId: 1,
        guestName: 'Anonymous',
        content: 'string string',
        questionId: 1,
        isEdit: false
    }
}
export const tUpdateReply = {//add reply
    status: true, message: {
        questionId: 1,
        replyId: 1,
        content: 'update reply'
    }
}
export const tAddedVote = {//add reply
    status: true, message: {
        guestId: 1,
        questionId: 1,
    }
}
export const tRemovedVote = {//add reply
    status: true, message: {
        guestId: 1,
        questionId: 1,
    }
}
export const tDeleteReplySuccess = { status: true, message: { meetingId: 1, questionId: 1, replyId:1 } }
export const tDeleteQuestionSuccess = { status: true, message: { meetingId: 1, questionId: 1 } }
export const tEditQuestionPlainTextSuccess = { status: true, message: { content: 'string string string', questionId: 1 } }
export const tUserToken = null;
export const tGuestToken = null;