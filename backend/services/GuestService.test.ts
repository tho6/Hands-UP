import Knex from 'knex'
import { seed } from '../seeds/create-guests'
import { GuestService } from './GuestService';
import { GuestForm } from '../models/GuestInterface';

const knexConfig = require('../knexfile');
const knex = Knex(knexConfig[process.env.TESTING_ENV || "testing"]);

describe('testing Guest Service', () => {
    let guestService: GuestService
    beforeEach(async () => {
        await seed(knex)
        guestService = new GuestService(knex)
    })

    afterAll(async () => {
        await knex.destroy();
    })

    // ------------------------ START getGuestByID ------------------------
    it('get guest by ID - one guest', async () => {
        const guestId = [1]
        const result = [{
            id: 1,
            name: 'guest1'
        }]
        const serviceResult = await guestService.getGuestById(guestId)
        expect(serviceResult).toEqual(result);
    })

    it('get guest by ID - multiple guest', async () => {
        const guestId = [1, 2]
        const result = [{
            id: 1,
            name: 'guest1',
        },
        {
            id: 2,
            name: 'guest2',
        }]
        const serviceResult = await guestService.getGuestById(guestId)
        expect(serviceResult).toEqual(result);
    })

    it('get guest by ID - without providing ID', async () => {
        const guestId: number[] = []
        await expect(guestService.getGuestById(guestId)).rejects.toThrow("ID array is empty")
    })

    it('get guest by ID - Id smaller than 1', async () => {
        const guestId = [1, 0]
        // const result:{}[] = []
        await expect(guestService.getGuestById(guestId)).rejects.toThrow("ID array contain value smaller than 1")
    })

    it('get guest by ID - ID not exits', async () => {
        const guestId: number[] = [999]
        const serviceResult = await guestService.getGuestById(guestId)
        expect(serviceResult).toEqual([]);
    })

    // ------------------------ END getGuestByID ------------------------

    // ------------------------ START creatGuest ------------------------

    it('create guest', async ()=>{
        const id = 4
        const serviceResult = await guestService.createGuest()
        expect(serviceResult).toBe(id)
    })

    // ------------------------ END creatGuest ------------------------

    // ------------------------ START deleteGuestByID ------------------------

    it('delete guest by ID - one guest', async ()=>{
        const guestId = [1]
        const serviceResult = await guestService.deleteGuestById(guestId)
        expect(serviceResult).toEqual(1)
        const getGuestResult = await guestService.getGuestById(guestId)
        expect(getGuestResult).toEqual([]);
        
    })

    it('delete guest by ID - multiple guests', async ()=>{
        const guestId = [1,2]
        const serviceResult = await guestService.deleteGuestById(guestId)
        expect(serviceResult).toEqual(2)
        const getGuestResult = await guestService.getGuestById(guestId)
        expect(getGuestResult).toEqual([]);
    })

    it('delete guest by ID - without providing ID', async ()=>{
        const guestId: number[] = []
        await expect(guestService.deleteGuestById(guestId)).rejects.toThrow('ID array is empty')
    })

    it('delete guest by ID - ID array contains value < 1', async ()=>{
        const guestId: number[] = [0,1,2]
        await expect(guestService.deleteGuestById(guestId)).rejects.toThrow('ID array contain value smaller than 1')
    })

    it('delete guest by ID - ID array contains id not exist', async ()=>{
        const guestId: number[] = [999,1,2]
        const serviceResult = await guestService.deleteGuestById(guestId)
        expect(serviceResult).toEqual(2)    
    })

    // ------------------------ END deleteGuestByID ------------------------

    // ------------------------ START getAllGuests ------------------------
    it('get all guest - normal', async ()=>{
        const result = [{
            id: 1,
            name: 'guest1'
        },
        {
            id: 2,
            name: 'guest2'
        },
        {
            id: 3,
            name:'guest3'
        }]
        const serviceResult = await guestService.getAllGuests();
        expect(serviceResult).toEqual(result)
    })

    it('get all guest - no guests in database', async ()=>{
        const result: [] = []

        await guestService.deleteGuestById([1,2,3]);
        const serviceResult = await guestService.getAllGuests();
        expect(serviceResult).toEqual(result)
    })
    // ------------------------ END getAllGuests ------------------------

    // ------------------------ START updateGuest ------------------------
    it('update guest by ID - one guest', async ()=>{
        const updateForms:GuestForm[] = [{
            id: 1,
            name: 'test'
        }]
        await guestService.updateGuestById(updateForms)
        const serviceResult = await guestService.getGuestById([1])
        expect(serviceResult).toEqual(updateForms)
    })

    it('update guest by ID - multiple guest', async ()=>{
        const updateForms:GuestForm[] = [{
            id: 1,
            name: 'test'
        },
        {
            id: 2,
            name: 'test2'
        }]
        const updateLength = await guestService.updateGuestById(updateForms)
        const serviceResult = await guestService.getGuestById([1,2])
        expect(serviceResult).toEqual(updateForms)
        expect(updateLength).toEqual(2)
    })

    it('update guest by ID - without providing update form', async()=>{
        const updateForms:GuestForm[] = []
        await expect(guestService.updateGuestById(updateForms)).rejects.toThrow("Update array is empty")
    })

    it('update guest by ID - id not exist', async()=>{
        const updateForms:GuestForm[] = [{
            id: 999,
            name: 'test'
        }]
        const updatedRows = await guestService.updateGuestById(updateForms)
        // const serviceResult = await guestService.getGuestById([999])
        expect(updatedRows).toEqual(0)
    })

    // ------------------------ END updateGuest ------------------------
})