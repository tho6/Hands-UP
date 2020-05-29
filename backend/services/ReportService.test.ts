import { ReportService } from "./ReportService";
import Knex from "knex";


const knexConfig = require('../knexfile');
const knex = Knex(knexConfig[process.env.TESTING_ENV || "testing"]);

describe('Report Service Test', ()=>{
    let reportService: ReportService
    
    beforeEach(()=>{
        reportService = new ReportService(knex)
    })
    afterAll(async()=>{
        await knex.destroy()
    })

    it('get views',()=>{
        const result = [{
            meeting_id: 1,
            youtube: 1,
            facebook: 3,
            handsup: 5,
            created_at: new Date(2020, 5, 20, 10, 0, 0)
        }]
    })
})