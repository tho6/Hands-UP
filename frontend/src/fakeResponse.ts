export const tFetchRoomInformation = {
    status: true, message: {
        id: 1,
        owenId: 1,
        name: 'TestingRoom1',
        code: '#string',
        is_live: true,
        canModerate: false, canUploadFiles: true, questionLimit: 3,
    }
}
export const tLoginAsGuest = {
    status: true, message: 'fakeToken'

}
export const tUserIsNotAHost = {
    status: true, message: { user: { guestId: 1, isHost: false, name: 'im not a host' }, meetingId: 1 }

}
export const tCurrentGuest = {
    status: true, message: { user: { guestId: 1, isHost: false, name: 'Anonymous' }, meetingId: 1 }

}
export const tCurrentHost = {
    status: true, message: { user: { guestId: 1, name: 'Host', isHost: true }, meetingId: 1 }

}
export const tFetchQuestions = {//load questions at first
    status: true, message: [{
        id: 1,
        questioner: {
            name: 'Anonymous',
            id: 1,
        },
        content: "Hi how are you? akjdfk kjsadkj hakjdk jkshdkj kjadskjk akjdhkj kahdskj akdsjhkajsd aksjdhkj sdkjahskd aksjdka sdkjaskd askjd kjss dkjfkdf jdfkjshfahdjfahdljfk hwif sjdhf kajhsdfklhdfkjahsdkjfha kdfhakjshdf sjhdfkjasd fkjahsd kfha ksjdfh kashdjf lakjshdfkahskdjfhak dfhlaks fkah dfk",
        likes: [1, 2, 3, 7, 8, 9],
        replies: [],
        files: [{ id: 1, filename: '1234.png' }, { id: 2, filename: '123.png' }],
        meetingId: 1,
        isHide: false,
        isAnswered: false,
        isApproved: true,
        createdAt: new Date(Date.now() - 1000),
        updatedAt: new Date(Date.now() - 1000),
        platform: { id: 2, name: 'facebook' },
    }, {
        id: 2,
        questioner: {
            name: 'Anonymous',
            id: 2,
        },
        content: "Hi how are you? akjdfk kjsadkj hakjdk jkshdkj kjadskjk akjdhkj kahdskj akdsjhkajsd aksjdhkj sdkjahskd aksjdka sdkjaskd askjd kjss dkjfkdf jdfkjshfahdjfahdljfk hwif sjdhf kajhsdfklhdfkjahsdkjfha kdfhakjshdf sjhdfkjasd fkjahsd kfha ksjdfh kashdjf lakjshdfkahskdjfhak dfhlaks fkah dfk",
        likes: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        replies: [],
        files: [],
        meetingId: 1,
        isHide: false,
        isAnswered: false,
        isApproved: true,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        platform: { id: 2, name: 'facebook' },
    }
    ]
}
export const tNewQuestion = {//add reply
    status: true, message: {
        id: 3,
        questioner: {
            name: 'Anonymous',
            id: 1,
        },
        content: "This is a new question",
        likes: [2, 3, 4, 5, 6, 7, 11, 12],
        replies: [],
        files: [],
        meetingId: 1,
        platform: { id: 2, name: 'facebook' },
        isHide: true,
        isAnswered: false,
        isApproved: false,
        createdAt: new Date(Date.now() + 2000),
        updatedAt: new Date(Date.now() + 2000),
    }
}
export const tNewReply = {//add reply
    status: true, message: {
        id: 1,
        guestId: 1,
        guestName: 'Anonymous',
        content: 'string string',
        questionId: 1,
        isEdit: false,//maybe dont need this
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        isHide: true
    }
}
export const tUpdateReply = {//add reply
    status: true, message: {
        questionId: 1,
        replyId: 1,
        content: 'update reply',
        updatedAt: new Date(Date.now() + 100)
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
export const tDeleteReplySuccess = { status: true, message: {questionId: 1, replyId: 1 } }
export const tDeleteQuestionSuccess = { status: true, message: { meetingId: 1, questionId: 1 } }
export const tEditQuestionSuccess = { status: true, message: { content: 'Delete 2 images and add 1 back', questionId: 1, deleteFilesId: [1, 2], files: [{ id: 3, filename: '789.png' }], updatedAt: new Date(Date.now() + 1 ), isApproved:true} }
export const tUserToken = null;
export const tGuestToken = null;
export const tHideReplySuccess = { status: true, message: { replyId: 1, questionId: 1, isHide: false } }
export const tHideQuestion = { status: true, message: { questionId: 3, isHide: false } }
export const tAnsweredQuestion = { status: true, message: { questionId: 1, isAnswered: true } }

//update question may need to return need approve or not 