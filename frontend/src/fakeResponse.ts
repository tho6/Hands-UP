export const tFetchRoomInformation = {
    status: true, message: {
        id: 1,
        owenId: 1,
        name: 'TestingRoom1',
        code: '#string',
        is_live: true,
        canModerate: false, canUploadFiles: true, questionLimit: 10
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
    status: true, message: { userId: 1, name: 'Host', isHost: true }

}
export const tFetchQuestions = {//load questions at first
    status: true, message: [{
        id: 1,
        questioner: {
            name: 'Anonymous',
            id: 1,
        },
        content: "Hi how are you? akjdfk kjsadkj hakjdk jkshdkj kjadskjk akjdhkj kahdskj akdsjhkajsd aksjdhkj sdkjahskd aksjdka sdkjaskd askjd kjss dkjfkdf jdfkjshfahdjfahdljfk hwif sjdhf kajhsdfklhdfkjahsdkjfha kdfhakjshdf sjhdfkjasd fkjahsd kfha ksjdfh kashdjf lakjshdfkahskdjfhak dfhlaks fkah dfk",
        likes: [2, 3, 4, 5, 6, 7, 8, 9],
        replies: [],
        isEdit: false,
        files: [{ id: 1, filename: '456.png' }, { id: 2, filename: '123.png' }],
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
export const tDeleteReplySuccess = { status: true, message: { meetingId: 1, questionId: 1, replyId: 1 } }
export const tDeleteQuestionSuccess = { status: true, message: { meetingId: 1, questionId: 1 } }
export const tEditQuestionSuccess = { status: true, message: { content: 'Delete 2 images and add 1 back', questionId: 1, deleteFilesId: [1, 2], files: [{ id: 3, filename: '789.png' }] } }
export const tUserToken = null;
export const tGuestToken = null;