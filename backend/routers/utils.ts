import { IQuestionService } from "../models/Interface/IQuestionService";
import fetch from 'node-fetch';

export interface QuestionData {
    meetingId: number,
    message: string,
    platformId: number,
    name: string
}


export const createQuestion = async (questionData: QuestionData, io: SocketIO.Server, questionService: IQuestionService) => {
    const { meetingId, message, platformId, name } = questionData
    const regex = RegExp(/(不如)+|(.唔.)+|(點)+|(幾)+|(問)+|(多數)+|(how)+|(what)+|(when)+|(why)+|(where)+|(如果)+|(\?)+|(\？)+|^(can)+|(呢)$/, 'i');
    if (!regex.test(message)) return;
    try {
        const question = await questionService.createQuestionFromPlatform(meetingId, message, platformId, name);
        io.in(`event:${question.meetingId}`).emit('create-question', question);
    } catch (e) {
        console.error(e);
        return;
        //do we need to notice the user here??
    }
}

export const youtubeExchangeForAccessToken = async (refreshToken: string) => {
    const bodyString = 'client_id=' + process.env.GOOGLE_CLIENT_ID + '&client_secret=' + process.env.GOOGLE_CLIENT_SECRET + '&refresh_token=' + encodeURIComponent(refreshToken) + '&grant_type=refresh_token';
    const fetchRes = await fetch('https://accounts.google.com/o/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyString,
    })
    const result = await fetchRes.json();
    return result;
}

/* Silent refresh */
        // setTimeout(async()=>{
        //     console.log('[Youtube] Silent Refresh')
        //     this.clearTimeIntervalAndTimer(fetchYTTimer, 'youtube', meetingId);
        //     const refreshResult = await this.youtubeExchangeForAccessToken(refreshToken);
        //     if (!refreshResult['access_token']) {
        //         /* io emit to toggle the button */
        //         this.io.in('host:' + userId).emit('youtube-stop', 'stop youtube live comments');
        //         return
        //     }
        //     const newAccessToken = encodeURIComponent(refreshResult['access_token']);
        //     this.fetchYTComments(videoId, userId, liveChatId, meetingId, newAccessToken, refreshToken, pageTokenString);
        // }, 3400000);

