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
    it('getQuestionsByMeetingId - one meetingId', async ()=>{
        const req = {
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
            content: 'question 1',
            is_answered: false,
            is_approved: true,
            is_hide: false,
            meeting_id: 1,
            platform_id: 1,
            guest_id: 1,
            created_at: createdAt,
            updated_at: createdAt,
            platform_username: null
        },
        {
            id:2,
            content: 'question 2',
            is_answered: false,
            is_approved: true,
            is_hide: false,
            meeting_id: 1,
            platform_id: 2,
            guest_id: 2,
            created_at: createdAt,
            updated_at: createdAt,
            platform_username: null
        },
        {
            id:3,
            content: 'question 3',
            is_answered: true,
            is_approved: true,
            is_hide: false,
            meeting_id: 1,
            platform_id: 3,
            guest_id: 2,
            created_at: createdAt,
            updated_at: createdAt,
            platform_username: null
        },
        {
            id:4,
            content: 'question 4',
            is_answered: false,
            is_approved: true,
            is_hide: false,
            meeting_id: 1,
            platform_id: 1,
            guest_id: 2,
            created_at: createdAt,
            updated_at: createdAt,
            platform_username: null
        }]}
        await reportRouter.getQuestionsByMeetingId(req, res)
        expect(res.json).toBeCalledWith(result)
    })

    it('getQuestionsByMeetingId - multiple meetingId', async ()=>{
        const req = {
            params:{
                paramsArray: '1,2'
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
            content: 'question 1',
            is_answered: false,
            is_approved: true,
            is_hide: false,
            meeting_id: 1,
            platform_id: 1,
            guest_id: 1,
            created_at: createdAt,
            updated_at: createdAt,
            platform_username: null
        },
        {
            id:2,
            content: 'question 2',
            is_answered: false,
            is_approved: true,
            is_hide: false,
            meeting_id: 1,
            platform_id: 2,
            guest_id: 2,
            created_at: createdAt,
            updated_at: createdAt,
            platform_username: null
        },
        {
            id:3,
            content: 'question 3',
            is_answered: true,
            is_approved: true,
            is_hide: false,
            meeting_id: 1,
            platform_id: 3,
            guest_id: 2,
            created_at: createdAt,
            updated_at: createdAt,
            platform_username: null
        },
        {
            id:4,
            content: 'question 4',
            is_answered: false,
            is_approved: true,
            is_hide: false,
            meeting_id: 1,
            platform_id: 1,
            guest_id: 2,
            created_at: createdAt,
            updated_at: createdAt,
            platform_username: null
        },
        {
            id: 5,
            content: 'question 5',
            is_answered: false,
            is_approved: true,
            is_hide: false,
            meeting_id: 2,
            platform_id: 1,
            guest_id: 2,
            created_at: createdAt,
            updated_at: createdAt,
            platform_username: null
        },
        {
            id: 6,
            content: 'question 6',
            is_answered: false,
            is_approved: true,
            is_hide: false,
            meeting_id: 2,
            platform_id: 1,
            guest_id: 3,
            created_at: createdAt,
            updated_at: createdAt,
            platform_username: null
        }]}
        await reportRouter.getQuestionsByMeetingId(req, res)
        expect(res.json).toBeCalledWith(result)
    })

    it('getQuestionsByMeetingId - empty meetingId', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
        } as any
        const result = {"message": "Please Input meetingId to search question", "success": false}

        await reportRouter.getQuestionsByMeetingId(req ,res);
        expect(res.status).toBeCalledWith(400)
        expect(res.json).toBeCalledWith(result)
    })

    it('getQuestionsByMeetingId - meetingid not exist', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            params:{
                paramsArray: '1,999'
            }
        } as any
        const result = {
            "success": true,
            "message": [
                {
                    id:1,
                    content: 'question 1',
                    is_answered: false,
                    is_approved: true,
                    is_hide: false,
                    meeting_id: 1,
                    platform_id: 1,
                    guest_id: 1,
                    created_at: createdAt,
                    updated_at: createdAt,
                    platform_username: null
                },
                {
                    id:2,
                    content: 'question 2',
                    is_answered: false,
                    is_approved: true,
                    is_hide: false,
                    meeting_id: 1,
                    platform_id: 2,
                    guest_id: 2,
                    created_at: createdAt,
                    updated_at: createdAt,
                    platform_username: null
                },
                {
                    id:3,
                    content: 'question 3',
                    is_answered: true,
                    is_approved: true,
                    is_hide: false,
                    meeting_id: 1,
                    platform_id: 3,
                    guest_id: 2,
                    created_at: createdAt,
                    updated_at: createdAt,
                    platform_username: null
                },
                {
                    id:4,
                    content: 'question 4',
                    is_answered: false,
                    is_approved: true,
                    is_hide: false,
                    meeting_id: 1,
                    platform_id: 1,
                    guest_id: 2,
                    created_at: createdAt,
                    updated_at: createdAt,
                    platform_username: null
                }
            ]
          }
        await reportRouter.getQuestionsByMeetingId(req ,res);
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })

    it('getQuestionsByMeetingId - id < 1', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            params:{
                paramsArray: '1,-999'
            }
        } as any
        const result = {"message": "meetingId array contain value smaller than 1", "success": false}

        await reportRouter.getQuestionsByMeetingId(req ,res)
        expect(res.status).toBeCalledWith(400)
        expect(res.json).toBeCalledWith(result)
    })

    //get views-------
    it('getViewsByMeetingId - one meetingId', async ()=>{
        const req = {
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
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 0, 0)
            },{
                meeting_id: 1,
                youtube: 5,
                facebook: 5,
                handsup: 9,
                created_at: new Date(2020, 5, 20, 10, 0, 30)
            },{
                meeting_id: 1,
                youtube: 6,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 1, 0)
            },{
                meeting_id: 1,
                youtube: 9,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 1, 30)
            },{
                meeting_id: 1,
                youtube: 10,
                facebook: 12,
                handsup: 11,
                created_at: new Date(2020, 5, 20, 10, 2, 0)
            },{
                meeting_id: 1,
                youtube: 21,
                facebook: 23,
                handsup: 25,
                created_at: new Date(2020, 5, 20, 10, 2, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 3, 0)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 3, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 4, 0)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 4, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 5, 0)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 5, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 6, 0)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 6, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 7, 0)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 7, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 8, 0)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 8, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 9, 0)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 9, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 10, 0)
            },{
                meeting_id: 1,
                youtube: 16,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 10, 30)
            },{
                meeting_id: 1,
                youtube: 14,
                facebook: 30,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 11, 0)
            }]}
        await reportRouter.getViewsByMeetingId(req, res)
        expect(res.json).toBeCalledWith(result)
    })

    it('getQuestionsByMeetingId - multiple meetingId', async ()=>{
        const req = {
            params:{
                paramsArray: '1,2'
            }
        } as any
        const res={
            status: jest.fn(()=>res),
            json: jest.fn()
            
        } as any
        const result = {
            success:true,
            message: [{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 0, 0)
            },{
                meeting_id: 1,
                youtube: 5,
                facebook: 5,
                handsup: 9,
                created_at: new Date(2020, 5, 20, 10, 0, 30)
            },{
                meeting_id: 1,
                youtube: 6,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 1, 0)
            },{
                meeting_id: 1,
                youtube: 9,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 1, 30)
            },{
                meeting_id: 1,
                youtube: 10,
                facebook: 12,
                handsup: 11,
                created_at: new Date(2020, 5, 20, 10, 2, 0)
            },{
                meeting_id: 1,
                youtube: 21,
                facebook: 23,
                handsup: 25,
                created_at: new Date(2020, 5, 20, 10, 2, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 3, 0)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 3, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 4, 0)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 4, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 5, 0)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 5, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 6, 0)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 6, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 7, 0)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 7, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 8, 0)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 8, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 9, 0)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 9, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 10, 0)
            },{
                meeting_id: 1,
                youtube: 16,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 10, 30)
            },{
                meeting_id: 1,
                youtube: 14,
                facebook: 30,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 11, 0)
            },{
                meeting_id: 2,
                youtube: 214,
                facebook: 435,
                handsup: 599,
                created_at: new Date(2020, 5, 20, 10, 11, 0)
            },{
                meeting_id: 2,
                youtube: 124,
                facebook: 320,
                handsup: 52,
                created_at: new Date(2020, 5, 20, 10, 11, 30)
            }]}
        await reportRouter.getViewsByMeetingId(req, res)
        expect(res.json).toBeCalledWith(result)
    })

    it('getQuestionsByMeetingId - empty meetingId', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
        } as any
        const result = {"message": "Please Input meetingId to get views", "success": false}

        await reportRouter.getViewsByMeetingId(req ,res);
        expect(res.status).toBeCalledWith(400)
        expect(res.json).toBeCalledWith(result)
    })

    it('getQuestionsByMeetingId - meetingid not exist', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            params:{
                paramsArray: '1,999'
            }
        } as any
        const result = {
            "success": true,
            "message": [{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 0, 0)
            },{
                meeting_id: 1,
                youtube: 5,
                facebook: 5,
                handsup: 9,
                created_at: new Date(2020, 5, 20, 10, 0, 30)
            },{
                meeting_id: 1,
                youtube: 6,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 1, 0)
            },{
                meeting_id: 1,
                youtube: 9,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 1, 30)
            },{
                meeting_id: 1,
                youtube: 10,
                facebook: 12,
                handsup: 11,
                created_at: new Date(2020, 5, 20, 10, 2, 0)
            },{
                meeting_id: 1,
                youtube: 21,
                facebook: 23,
                handsup: 25,
                created_at: new Date(2020, 5, 20, 10, 2, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 3, 0)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 3, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 4, 0)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 4, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 5, 0)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 5, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 6, 0)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 6, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 7, 0)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 7, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 8, 0)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 8, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 9, 0)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 9, 30)
            },{
                meeting_id: 1,
                youtube: 1,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 10, 0)
            },{
                meeting_id: 1,
                youtube: 16,
                facebook: 3,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 10, 30)
            },{
                meeting_id: 1,
                youtube: 14,
                facebook: 30,
                handsup: 5,
                created_at: new Date(2020, 5, 20, 10, 11, 0)
            }]
          }
        await reportRouter.getViewsByMeetingId(req ,res);
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })

    it('getQuestionsByMeetingId - id < 1', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            params:{
                paramsArray: '1,-999'
            }
        } as any
        const result = {"message": "meetingId array contain value smaller than 1", "success": false}

        await reportRouter.getViewsByMeetingId(req ,res)
        expect(res.status).toBeCalledWith(400)
        expect(res.json).toBeCalledWith(result)
    })
    
})