import { ReportRouter } from "./ReportRouter"
import { ReportService } from "../services/ReportService"
import Knex from "knex";
import { seed } from '../seeds/create-views'

const knexConfig = require('../knexfile');
const knex = Knex(knexConfig[process.env.TESTING_ENV || "testing"]);
/*Timestamps Output the same number */
const createdAt = new Date("2020-05-23T12:00:00.000z")  // Date.parse createdDate --> = 1590235200000
//@ts-ignore
const updatedAt = new Date("2020-05-23T13:00:00.000z")  // Date.parse createdDate --> = 1590238800000
const scheduleTime = new Date("2020-05-30T13:00:00.000z")  // Date.parse createdDate --> = 1590238800000

describe('Report Router test', ()=>{
    let reportRouter: ReportRouter
    let reportService: ReportService
    beforeEach(async ()=>{
        reportService = new ReportService(knex)
        reportRouter = new ReportRouter(reportService)
        await seed(knex)
    })
    afterAll(async ()=>{
        await knex.destroy()
    })
    //get questions-------
    it('getQuestionsByMeetingId - normal', async ()=>{
        const req = {
            personInfo:{
                userId: 1
            },
            params:{
                paramsArray: 'all'
            }
        } as any
        const res={
            status: jest.fn(()=>res),
            json: jest.fn()
            
        } as any
        const result = {
            success:true,
            message: [
                {
                  id: 2,
                  isanswered: false,
                  questionaskedbyid: 2,
                  isapproved: true,
                  ishide: false,
                  questioncreatedat: createdAt,
                  meetingid: 1,
                  meetingname: 'Meeting Room 1',
                  meetingscheduletime: scheduleTime,
                  meetingcreatedat: createdAt,
                  meetingupdatedat: createdAt,
                  platformid: 2,
                  platformname: 'facebook',
                  meetingownerid: 1,
                  meetingsownername: 'ivan',
                  questionlikes: '1'
                },
                {
                  id: 1,
                  isanswered: false,
                  questionaskedbyid: 1,
                  isapproved: true,
                  ishide: false,
                  questioncreatedat: createdAt,
                  meetingid: 1,
                  meetingname: 'Meeting Room 1',
                  meetingscheduletime: scheduleTime,
                  meetingcreatedat: createdAt,
                  meetingupdatedat: createdAt,
                  platformid: 1,
                  platformname: 'project3',
                  meetingownerid: 1,
                  meetingsownername: 'ivan',
                  questionlikes: '2'
                },
                {
                  id: 4,
                  isanswered: false,
                  questionaskedbyid: 2,
                  isapproved: true,
                  ishide: false,
                  questioncreatedat: createdAt,
                  meetingid: 1,
                  meetingname: 'Meeting Room 1',
                  meetingscheduletime: scheduleTime,
                  meetingcreatedat: createdAt,
                  meetingupdatedat: createdAt,
                  platformid: 1,
                  platformname: 'project3',
                  meetingownerid: 1,
                  meetingsownername: 'ivan',
                  questionlikes: null
                },
                {
                  id: 3,
                  isanswered: true,
                  questionaskedbyid: 2,
                  isapproved: true,
                  ishide: false,
                  questioncreatedat: createdAt,
                  meetingid: 1,
                  meetingname: 'Meeting Room 1',
                  meetingscheduletime: scheduleTime,
                  meetingcreatedat: createdAt,
                  meetingupdatedat: createdAt,
                  platformid: 3,
                  platformname: 'youtube',
                  meetingownerid: 1,
                  meetingsownername: 'ivan',
                  questionlikes: null
                },
                {
                    id: 5,
                    isanswered: false,
                    questionaskedbyid: 2,
                    isapproved: true,
                    ishide: false,
                    questioncreatedat: createdAt,
                    meetingid: 2,
                    meetingname: 'Meeting Room 2',
                    meetingscheduletime: scheduleTime,
                    meetingcreatedat: createdAt,
                    meetingupdatedat: createdAt,
                    platformid: 1,
                    platformname: 'project3',
                    meetingownerid: 1,
                    meetingsownername: 'ivan',
                    questionlikes: null
                  },
                  {
                    id: 6,
                    isanswered: false,
                    questionaskedbyid: 3,
                    isapproved: true,
                    ishide: false,
                    questioncreatedat: createdAt,
                    meetingid: 2,
                    meetingname: 'Meeting Room 2',
                    meetingscheduletime: scheduleTime,
                    meetingcreatedat: createdAt,
                    meetingupdatedat: createdAt,
                    platformid: 1,
                    platformname: 'project3',
                    meetingownerid: 1,
                    meetingsownername: 'ivan',
                    questionlikes: null
                  }
              ]}
        await reportRouter.getQuestionsByMeetingId(req, res)
        expect(res.json).toBeCalledWith(result)
    })

    it('getQuestionsByMeetingId - empty meetingId', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            personInfo:{
                userId:5
            },
            params:{
                paramsArray: '1,2'
            }
        } as any
        const result = {"message": "Please Input meetingId to search question", "success": false}

        await reportRouter.getQuestionsByMeetingId(req ,res);
        expect(res.status).toBeCalledWith(400)
        expect(res.json).toBeCalledWith(result)
    })

    //get views-------
    it('getViewsByMeetingId - one meetingId', async ()=>{
        const req = {
            personInfo:{
                userId: '1'
            },
            params:{
                paramsArray: '1'
            }
        } as any
        const res={
            status: jest.fn(()=>res),
            json: jest.fn()
            
        } as any
        const result = {
            success:true,
            message: [{
                id:1,
                meetingid: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 0, 0)
            },{
                id:2,
                meetingid: 1,
                youtube: 5,
                facebook: 5,
                handsup: 9,
                created_at: new Date(2020, 5, 20, 10, 0, 30)
            },{
                id:3,
                meetingid: 1,
                youtube: 6,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 1, 0)
            },{
                id:4,
                meetingid: 1,
                youtube: 9,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 1, 30)
            },{
                id:5,
                meetingid: 1,
                youtube: 10,
                facebook: 12,
                handsup: 11,
                created_at: new Date(2020, 5, 20, 10, 2, 0)
            },{
                id:6,
                meetingid: 1,
                youtube: 21,
                facebook: 23,
                handsup: 25,
                created_at: new Date(2020, 5, 20, 10, 2, 30)
            },{
                id:7,
                meetingid: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 3, 0)
            },{
                id:8,
                meetingid: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 3, 30)
            },{
                id:9,
                meetingid: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 4, 0)
            },{
                id:10,
                meetingid: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 4, 30)
            },{
                id:11,
                meetingid: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 5, 0)
            },{
                id:12,
                meetingid: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 5, 30)
            },{
                id:13,
                meetingid: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 6, 0)
            },{
                id:14,
                meetingid: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 6, 30)
            },{
                id:15,
                meetingid: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 7, 0)
            },{
                id:16,
                meetingid: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 7, 30)
            },{
                id:17,
                meetingid: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 8, 0)
            },{
                id:18,
                meetingid: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 8, 30)
            },{
                id:19,
                meetingid: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 9, 0)
            },{
                id:20,
                meetingid: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 9, 30)
            },{
                id:21,
                meetingid: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 10, 0)
            },{
                id:25,
                meetingid: 1,
                youtube: 16,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 10, 30)
            },{
                id:22,
                meetingid: 1,
                youtube: 14,
                facebook: 30,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 11, 0)
            }]}
        await reportRouter.getViewsByMeetingId(req, res)
        expect(res.json).toBeCalledWith(result)
    })

    it('getViewsByMeetingId - empty meetingId', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            personInfo:{
                userId:5
            },
            params:{
                paramsArray: '1,2'
            }
        } as any
        const result = {"message": "Please Input meetingId to get views", "success": false}

        await reportRouter.getViewsByMeetingId(req ,res);
        expect(res.status).toBeCalledWith(400)
        expect(res.json).toBeCalledWith(result)
    })
})