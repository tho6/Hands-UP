import fetch from 'node-fetch';
import { QuestionData, youtubeExchangeForAccessToken } from './utils';
import { workerData, parentPort } from "worker_threads";
import { redisClient, getAsync, setHmAsync, getHallAsync, delAsync } from "../redisClient"

const { videoId, userId, liveChatId, meetingId, accessToken, refreshToken } = workerData;
// console.log(`Youtube Worker starts working on meetingId ${meetingId}!`)
const fetchYTComments = async (videoId: string, userId: number, liveChatId: string, meetingId: number, accessToken: string, refreshToken: string, pageTokenStr: string = '',) => {
    let pageTokenString = pageTokenStr;
    let viewCounter = 0;
    setInterval(async () => {
        try {
            // console.log('[LiveRouter] fetch Youtube Comments');
            const fetchLiveChat = await fetch(`https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet&part=authorDetails&${pageTokenString}key=${process.env.YOUTUBE_API_KEY}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await fetchLiveChat.json();
            /* If access token expires in the middle of live broadcast */
            if (result.error) {
                if (result.error.code === 404) {
                    parentPort?.postMessage({ type: "youtube-stop" });
                    await delAsync(`EVENTSOURCE_${meetingId}_YOUTUBE`);
                    process.exit(1);
                }
                const refreshResult = await youtubeExchangeForAccessToken(refreshToken);
                if (!refreshResult['access_token']) {
                    /* io emit to toggle the button */
                    parentPort?.postMessage({ type: "youtube-stop" });
                    await delAsync(`EVENTSOURCE_${meetingId}_YOUTUBE`);
                    process.exit(1);
                }
                const newAccessToken = encodeURIComponent(refreshResult['access_token']);
                fetchYTComments(videoId, userId, liveChatId, meetingId, newAccessToken, refreshToken, pageTokenString,);
                return;
            }
            /* Check if live broadcast ends */
            if (result.offlineAt) {
                console.log('[Live Status] Youtube Live Chat ends')
                parentPort?.postMessage({ type: "youtube-stop" });
                await delAsync(`EVENTSOURCE_${meetingId}_YOUTUBE`);
                process.exit(0);
            }
            pageTokenString = `pageToken=${result.nextPageToken}&`;
            /* Check if user stops the live fetch function */
            const isExist = await getAsync(`EVENTSOURCE_${meetingId}_YOUTUBE`).then((data: any) => data)
            if (isExist !== "true") return;
            /* update views */
            viewCounter += 1;
            if (viewCounter === 4) {
                fetchYTViews(accessToken, videoId, userId, meetingId);
                viewCounter = 0;
            }
            /* Create questions and io emit */
            for (const item of result.items) {
                if (!item.snippet.displayMessage) continue;
                const obj: QuestionData = { meetingId, message: item.snippet.displayMessage, platformId: 3, name: item.authorDetails.displayName || 'Anonymous' }
                parentPort?.postMessage({ type: "CREATE_QUESTION", value: obj });
            }
        } catch (e) {
            console.error(e);
            parentPort?.postMessage({ type: "youtube-stop" });
            await delAsync(`EVENTSOURCE_${meetingId}_YOUTUBE`);
            process.exit(1);
        }
    }, 10000);

    /* Let server knows the live function is operating in which room and on which platform */
    redisClient.set(`EVENTSOURCE_${meetingId}_YOUTUBE`, "true")
}

fetchYTComments(videoId, userId, liveChatId, meetingId, accessToken, refreshToken);

const fetchYTViews = async (accessToken: string, videoId: string, userId: number, meetingId: number) => {
    try {
        // console.log('[LiveRouter] fetch views from Youtube');
        const fetchViewRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        /* Check response */
        if (fetchViewRes.status !== 200) {
            parentPort?.postMessage({ type: "youtube--views-stop" });
            return;
        }
        const result = await fetchViewRes.json();
        /* check liveBroadcast status */
        if (!result.items[0].liveStreamingDetails.concurrentViewers) {
            // console.log('[Live Status] Youtube live broadcast ends...')
            return;
        }
        const liveViews = result.items[0].liveStreamingDetails.concurrentViewers;
        const viewsTimer = await getHallAsync(`VIEWS_TIMER_${meetingId}`).then((data: any) => data?.status ?? null)
        if (viewsTimer !== "true") return;
        await setHmAsync(`VIEWS_TIMER_${meetingId}`, "youtube", `${liveViews}`)
        parentPort?.postMessage({ type: "youtube-views-update", value: liveViews });
        return;
    } catch (error) {
        console.log(error)
        return;
    }
}
