import { ReportService } from "./ReportService";
import Knex from "knex";
import { seed } from '../seeds/create-views'

const knexConfig = require('../knexfile');
// const knex = Knex(knexConfig[process.env.TESTING_ENV || "testing"]);
const knex = Knex(knexConfig[process.env.TESTING_ENV||'cicd']);
/*Timestamps Output the same number */
const createdAt = new Date("2020-05-23T12:00:00.000z")  // Date.parse createdDate --> = 1590235200000
//@ts-ignore
const updatedAt = new Date("2020-05-23T13:00:00.000z")  // Date.parse createdDate --> = 1590238800000
const scheduleTime = new Date("2020-05-30T13:00:00.000z")  // Date.parse createdDate --> = 1590238800000
describe.skip('Report Service Test', ()=>{
    let reportService: ReportService
    
    beforeEach(async ()=>{
        await seed(knex)
        reportService = new ReportService(knex)
    })
    afterAll(async()=>{
        await seed(knex)
        await knex.destroy()
    })

    it('get views - normal', async ()=>{
        const result = [{
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
        },{
            id:24,
            meetingid: 2,
            youtube: 214,
            facebook: 435,
            handsup: 599,
            created_at: new Date(2020, 5, 20, 10, 11, 0)
        },{
            id:23,
            meetingid: 2,
            youtube: 124,
            facebook: 320,
            handsup: 52,
            created_at: new Date(2020, 5, 20, 10, 11, 30)
        }]
        const serviceResult = await reportService.getViewsByMeetingId([2,1])
        expect(serviceResult).toEqual(result)
    })

    it('get views - normal', async ()=>{
        const result = [{
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
        }]
        const serviceResult = await reportService.getViewsByMeetingId([1])
        expect(serviceResult).toEqual(result)
    })

    it('get views - no meeting id', async ()=>{
        try {
            await reportService.getViewsByMeetingId([])
        } catch (error) {
            expect(error.message).toEqual('meetingId array is empty')
        }
    })

    it('get views - contain negative meeting id', async ()=>{
        try {
            await reportService.getViewsByMeetingId([-1])
        } catch (error) {
            expect(error.message).toEqual('meetingId array contain value smaller than 1')
        }
    })


    // get questions
    it('getQuestionReportDataByMeetingId - multiple meetingId', async ()=>{
        const result = [
            {
              id: 2,
              isanswered: false,
              questionaskedbyid: 2,
              isapproved: true,
              ishide: false,
              questioncreatedat: createdAt,
              questioncontent: 'question 2',
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
              questioncontent: 'question 1',
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
              questioncontent: 'question 4',
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
              questioncontent: 'question 3',
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
              questioncontent: 'question 5',
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
              questioncontent: 'question 6',
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
          ]
        const serviceResult = await reportService.getQuestionReportDataByMeetingId([2,1])
        expect(serviceResult).toEqual(result)
    })

    it('getQuestionReportDataByMeetingId - one meetingId', async ()=>{
        const result = [
            {
              id: 2,
              isanswered: false,
              questionaskedbyid: 2,
              isapproved: true,
              ishide: false,
              questioncreatedat: createdAt,
              questioncontent: 'question 2',
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
              questioncontent: 'question 1',
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
              questioncontent: 'question 4',
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
              questioncontent: 'question 3',
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
            }
          ]
        const serviceResult = await reportService.getQuestionReportDataByMeetingId([1])
        expect(serviceResult).toEqual(result)
    })

    it('getQuestionReportDataByMeetingId - no meeting id', async ()=>{
        try {
            await reportService.getQuestionReportDataByMeetingId([])
        } catch (error) {
            expect(error.message).toEqual('meetingId array is empty')
        }
    })

    it('getQuestionReportDataByMeetingId - contain negative meeting id', async ()=>{
        try {
            await reportService.getQuestionReportDataByMeetingId([-1])
        } catch (error) {
            expect(error.message).toEqual('meetingId array contain value smaller than 1')
        }
    })
})