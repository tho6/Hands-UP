import Knex from 'knex'
import { seed } from '../seeds/create-guests'
import { GuestService } from '../services/GuestService';
import { GuestRouter } from './GuestRouter';

const knexConfig = require('../knexfile');
const knex = Knex(knexConfig[process.env.TESTING_ENV || "testing"]);

describe('Guest Router Testing', ()=>{
    let guestService: GuestService
    let guestRouter: GuestRouter
    beforeEach(async ()=>{
        await seed(knex)
        guestService = new GuestService(knex);
        guestRouter = new GuestRouter(guestService)
    })

    afterAll(async ()=>{
        await knex.destroy();
    })

    // --- START getAllGuests --

    it('get all guests', async ()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const result = {
            "success": true,
            "message": [
              {
                "id": 1,
                "name": "guest1"
              },
              {
                "id": 2,
                "name": "guest2"
              },
              {
                "id": 3,
                "name": "guest3"
              }
            ]
          }
        await guestRouter.getAllGuests({} as any,res);
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })
    // --- END getAllGuests --

    // --- START getGuestsById --
    it('get guest by Id - one guest', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            query:{
                getBy: 'id'
            },
            params:{
                paramsArray: '1'
            }
        } as any
        const result = {
            "success": true,
            "message": [
              {
                "id": 1,
                "name": "guest1"
              }
            ]
          }
        await guestRouter.getGuests(req ,res);
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })

    it('get guest by Id - multiple guest', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            query:{
                getBy: 'id'
            },
            params:{
                paramsArray: '1,2'
            }
        } as any
        const result = {
            "success": true,
            "message": [
              {
                "id": 1,
                "name": "guest1"
              },
              {
                "id": 2,
                "name": "guest2"
              }
            ]
          }
        await guestRouter.getGuests(req ,res);
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })

    it('get guest by Id - empty id', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            query:{
                getBy: 'id'
            }
        } as any
        const result = {"message": "Please Input id/name to search", "success": false}

        await guestRouter.getGuests(req ,res);
        expect(res.status).toBeCalledWith(400)
        expect(res.json).toBeCalledWith(result)
    })

    it('get guest by Id - id not exist', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            query:{
                getBy: 'id'
            },
            params:{
                paramsArray: '1,999'
            }
        } as any
        const result = {
            "success": true,
            "message": [
              {
                "id": 1,
                "name": "guest1"
              }
            ]
          }
        await guestRouter.getGuests(req ,res);
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })

    it('get guest by Id - id < 1', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            query:{
                getBy: 'id'
            },
            params:{
                paramsArray: '1,-999'
            }
        } as any
        const result = {"message": "ID array contain value smaller than 1", "success": false}

        await guestRouter.getGuests(req ,res)
        expect(res.status).toBeCalledWith(400)
        expect(res.json).toBeCalledWith(result)
    })
    // --- END getGuestsById --

    // --- START updateGuests --

    it('update guests - one guest', async ()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            body:{
                updateForms:[{
                    id: 1,
                    name: 'testName'
                }]
            }
        } as any
        const result = {success: true, message: 1}
        const resultGuest = [{
            id: 1,
            name: 'testName'
        }]

        await guestRouter.updateGuests(req ,res)
        const serviceResult = await guestService.getGuestById([1])
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
        expect(serviceResult).toEqual(resultGuest)
    })

    it('update guests - update multiple guests', async ()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            body:{
                updateForms:[{
                    id: 1,
                    name: 'testName'
                },
                {
                    id: 2,
                    name: 'testName2'
                }]
            }
        } as any
        const result = {success: true, message: 2}
        const resultGuest = [{
            id: 1,
            name: 'testName'
        },
        {
            id: 2,
            name: 'testName2'
        }]

        await guestRouter.updateGuests(req ,res)
        const serviceResult = await guestService.getGuestById([1,2])
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
        expect(serviceResult).toEqual(resultGuest)
    })

    it('update guests - id not exist', async ()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            body:{
                updateForms:[{
                    id: 9999,
                    name: 'testName'
                },
                {
                    id: 99999,
                    name: 'testName2'
                }]
            }
        } as any
        const result = {success: true, message: 0}

        await guestRouter.updateGuests(req ,res)
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })

    // --- END updateGuests --

    // --- START deleteGuests --
    it('delete guests by Id - one guest', async ()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            body:{
                ids:[1]
            }
        } as any
        const result = {success: true, message: 1}

        await guestRouter.deleteGuests(req ,res)
        const serviceResult = await guestService.getGuestById([1])
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
        expect(serviceResult).toEqual([])
    })

    it('delete guests by Id - multiple guest', async ()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            body:{
                ids:[1,2]
            }
        } as any
        const result = {success: true, message: 2}

        await guestRouter.deleteGuests(req ,res)
        const serviceResult = await guestService.getGuestById([1,2])
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
        expect(serviceResult).toEqual([])
    })

    it('delete guests by Id - with Id string', async ()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            body:{
                ids:['1']
            }
        } as any

        const result = {success: true, message: 1}

        await guestRouter.deleteGuests(req ,res)
        const serviceResult = await guestService.getGuestById([1])
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
        expect(serviceResult).toEqual([])
    })

    it('delete guests by id - id not exist', async ()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            body:{
                ids:[999]
            }
        } as any

        const result = {success: true, message: 0}

        await guestRouter.deleteGuests(req ,res)
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })

})