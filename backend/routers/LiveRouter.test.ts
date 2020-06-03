import { LiveRouter } from './LiveRouter';
import { seed } from "../seeds/create-questions";
import Knex from 'knex';
import { IQuestionService } from "../models/Interface/IQuestionService";
import { QuestionService } from "../services/QuestionService";
import { IQuestionDAO } from "../models/Interface/IQuestionDAO";
import { IReplyDAO } from "../models/Interface/IReplyDAO";
import { QuestionDAO } from "../services/dao/questionDAO";
import { ReplyDAO } from "../services/dao/replyDAO";
import { UserService } from '../services/UserService';
import fetch from 'node-fetch'


jest.mock('node-fetch');


const knexConfig = require('../knexfile');
const knex = Knex(knexConfig[process.env.TESTING_ENV || "cicd"]);

describe('LiveRouter', () => {
    let questionDAO: IQuestionDAO = new QuestionDAO(knex);
    let replyDAO: IReplyDAO = new ReplyDAO(knex);
    let questionService: IQuestionService;
    let liveRouter:LiveRouter;
    let userService = new UserService(knex)
    const io = {
        in: jest.fn(() => io),
        emit: jest.fn()
    } as any
    beforeEach(async () => {
        questionService = new QuestionService(questionDAO, replyDAO)
        liveRouter = new LiveRouter(questionService,io,userService)
        io.in.mockClear();
        io.emit.mockClear(); 
        jest.useFakeTimers();
        await seed(knex); 
    })
    afterAll(async () => {
        await knex.destroy();
    })
    it('checkYoutubeLiveBroadcast - no Live broadcast', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            youtubeRefreshToken: 'token',
            personInfo:{userId:1},
            params: {
                meetingId: 1
            }
        } as any;
        const mock1 = jest.fn();
        // jest.useFakeTimers();
        const mock2 = jest.fn();
        liveRouter.youtubeExchangeForAccessToken = mock1;
        liveRouter.fetchYTComments = mock2;
        mock1.mockReturnValue({access_token:'access token'});
        (fetch as any as jest.Mock).mockReturnValue({json:()=>{return {items:[],pageInfo:{totalResults:0}}}});
       mock2.mockImplementation(()=>{});
       await liveRouter.checkYTLiveBroadcast(req, res)
       expect(res.json).toBeCalledTimes(1);
        expect(res.json).toBeCalledWith({ status: false, message: 'No LiveBroadCast on Youtube!' });
        expect(res.status).toBeCalledWith(404);
    })
    it('checkYoutubeLiveBroadcast - normal', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            youtubeRefreshToken: 'token',
            personInfo:{userId:1},
            params: {
                meetingId: 1
            }
        } as any;
        const mock1 = jest.fn();
        const mock2 = jest.fn();
        liveRouter.youtubeExchangeForAccessToken = mock1;
        liveRouter.fetchYTComments = mock2;
        mock1.mockReturnValue({access_token:'access token'});
        (fetch as any as jest.Mock).mockReturnValue({json:()=>{return {items:[{snippet:{liveChatId:1}}],pageInfo:{totalResults:1}}}});
        mock2.mockImplementation(()=>{});
       await liveRouter.checkYTLiveBroadcast(req, res)
       expect(res.json).toBeCalledTimes(1);
       expect(res.json).toBeCalledWith({ status: true, message: 'Start to fetch comments from Youtube' });
       expect(res.status).toBeCalledWith(200);
        
    })
    it('checkYoutubeLiveBroadcast - normal', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            youtubeRefreshToken: 'token',
            personInfo:{userId:1},
            params: {
                meetingId: 1
            }
        } as any;
        const mock1 = jest.fn();
        const mock2 = jest.fn();
        liveRouter.youtubeExchangeForAccessToken = mock1;
        liveRouter.fetchYTComments = mock2;
        mock1.mockReturnValue({access_token:'access token'});
        (fetch as any as jest.Mock).mockReturnValueOnce({json:()=>{return {items:[{snippet:{liveChatId:1}}],pageInfo:{totalResults:1}}}});
        // (fetch as any as jest.Mock).mockReturnValueOnce({json:()=>{return {items:[{snippet:{liveChatId:1}}],pageInfo:{totalResults:1}}}}).mockReturnValueOnce({json:()=>{return {nextPageToken:'next token',items:[{snippet:{displayMessage:'display message'}}],pageInfo:{totalResults:1}}}});
        mock2.mockImplementation(()=>{});
       await liveRouter.checkYTLiveBroadcast(req, res)
       expect(res.json).toBeCalledTimes(1);
       expect(res.json).toBeCalledWith({ status: true, message: 'Start to fetch comments from Youtube' });
       expect(res.status).toBeCalledWith(200);
        
    })
    it('checkYoutubeLiveBroadcast - not host', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            youtubeRefreshToken: 'token',
            personInfo:{userId:2},
            params: {
                meetingId: 1
            }
        } as any;
        const mock1 = jest.fn();
        const mock2 = jest.fn();
        liveRouter.youtubeExchangeForAccessToken = mock1;
        liveRouter.fetchYTComments = mock2;
        mock1.mockReturnValue({access_token:'access token'});
        (fetch as any as jest.Mock).mockReturnValueOnce({json:()=>{return {items:[{snippet:{liveChatId:1}}],pageInfo:{totalResults:1}}}});
        // (fetch as any as jest.Mock).mockReturnValueOnce({json:()=>{return {items:[{snippet:{liveChatId:1}}],pageInfo:{totalResults:1}}}}).mockReturnValueOnce({json:()=>{return {nextPageToken:'next token',items:[{snippet:{displayMessage:'display message'}}],pageInfo:{totalResults:1}}}});
        mock2.mockImplementation(()=>{});
       await liveRouter.checkYTLiveBroadcast(req, res)
       expect(res.json).toBeCalledTimes(1);
       expect(res.json).toBeCalledWith({ status: false, message:'You are not allowed to enable the youtube live comments in this meeting!', platform:true });
       expect(res.status).toBeCalledWith(401);
        
    })
    it('checkYoutubeLiveBroadcast - duplicate instance', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            youtubeRefreshToken: 'token',
            personInfo:{userId:1},
            params: {
                meetingId: 1
            }
        } as any;
        const mock1 = jest.fn();
        // jest.useFakeTimers();
        //const mock2 = jest.fn();
        liveRouter.youtubeExchangeForAccessToken = mock1;
        // liveRouter.fetchYTComments = mock2;
        mock1.mockReturnValue({access_token:'access token'});
        //(fetch as any as jest.Mock).mockReturnValueOnce({json:()=>{return {items:[{snippet:{liveChatId:1}}],pageInfo:{totalResults:1}}}});
        // (fetch as any as jest.Mock).mockReturnValueOnce({json:()=>{return {items:[{snippet:{liveChatId:1}}],pageInfo:{totalResults:1}}}}).mockReturnValueOnce({json:()=>{return {nextPageToken:'next token',items:[{snippet:{displayMessage:'display message'}}],pageInfo:{totalResults:1}}}});
        (fetch as any as jest.Mock).mockReturnValueOnce({json:()=>{return {items:[{snippet:{liveChatId:1}}],pageInfo:{totalResults:1}}}}).mockReturnValueOnce({json:()=>{return {offlineAt:'123',nextPageToken:'next token',items:[{snippet:{displayMessage:'display message'}}],pageInfo:{totalResults:1}}}});
       // mock2.mockImplementation(()=>{});
       await liveRouter.checkYTLiveBroadcast(req, res)
       await liveRouter.checkYTLiveBroadcast(req, res)
       expect(res.json).toBeCalledTimes(2);
        expect(res.json).toHaveBeenNthCalledWith(1,{ status: true, message: 'Start to fetch comments from Youtube' });
     expect(res.json).toHaveBeenNthCalledWith(2,{ status: false, message: 'Fetch Youtube comment is already running, fail to create another instance!'});
        expect(res.status).toHaveBeenNthCalledWith(1,200);
     expect(res.status).toHaveBeenNthCalledWith(2,400);    
  
    })
    it('checkYoutubeLiveBroadcast - continue youtube live chat', async () => {
        let res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        } as any;
        let req = {
            youtubeRefreshToken: 'token',
            personInfo:{userId:1},
            params: {
                meetingId: 1
            }
        } as any;
        const mock1 = jest.fn();
        // jest.useFakeTimers();
        //const mock2 = jest.fn();
        liveRouter.youtubeExchangeForAccessToken = mock1;
        // liveRouter.fetchYTComments = mock2;
        mock1.mockReturnValue({access_token:'access token'});
        //(fetch as any as jest.Mock).mockReturnValueOnce({json:()=>{return {items:[{snippet:{liveChatId:1}}],pageInfo:{totalResults:1}}}});
        // (fetch as any as jest.Mock).mockReturnValueOnce({json:()=>{return {items:[{snippet:{liveChatId:1}}],pageInfo:{totalResults:1}}}}).mockReturnValueOnce({json:()=>{return {nextPageToken:'next token',items:[{snippet:{displayMessage:'display message'}}],pageInfo:{totalResults:1}}}});
        (fetch as any as jest.Mock).mockClear();
        (fetch as any as jest.Mock).mockReturnValueOnce({json:()=>{return {items:[{snippet:{liveChatId:1}}],pageInfo:{totalResults:1}}}}).mockReturnValueOnce({json:()=>{return {offlineAt:'123',nextPageToken:'next token',items:[{snippet:{displayMessage:'display message'}}],pageInfo:{totalResults:1}}}});
       // mock2.mockImplementation(()=>{});
       await liveRouter.checkYTLiveBroadcast(req, res)
       await liveRouter.stopGettingYoutubeComments(req, res)
       await liveRouter.checkYTLiveBroadcast(req, res)
       expect(res.json).toBeCalledTimes(3);
        expect(res.json).toHaveBeenNthCalledWith(1,{ status: true, message: 'Start to fetch comments from Youtube' });
        expect(res.json).toHaveBeenNthCalledWith(2,{ status: true, message:'Successfully stop fetching comments from youtube'});
     expect(res.json).toHaveBeenNthCalledWith(3,{ status: true, message: 'Continue fetching comments from Youtube'});
        expect(res.status).toHaveBeenNthCalledWith(1,200);
     expect(res.status).toHaveBeenNthCalledWith(2,200);    
     expect(res.status).toHaveBeenNthCalledWith(3,200);    
  
    })

})