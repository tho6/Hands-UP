import Knex from 'knex'
import { seed } from '../seeds/create-users'
import { UserService } from '../services/UserService';
import { UserRouter } from './UserRouter';

const knexConfig = require('../knexfile');
const knex = Knex(knexConfig[process.env.TESTING_ENV || "testing"]);

describe('User Router Testing', ()=>{
    let userService: UserService
    let userRouter: UserRouter
    beforeEach(async ()=>{
        await seed(knex)
        userService = new UserService(knex);
        userRouter = new UserRouter(userService)
    })

    afterAll(async ()=>{
        await knex.destroy();
    })

    // --- START getAllUsers --

    it('get all users', async ()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const result = {
            "success": true,
            "message": [
              {
                "id": 1,
                "name": "ivan",
                "email": "ivan@gmail.com"
              },
              {
                "id": 2,
                "name": "peter",
                "email": "peter@hibye.com"
              },
              {
                "id": 3,
                "name": "mary",
                "email": "mary1@hey.com"
              }
            ]
          }
        await userRouter.getAllUsers({} as any,res);
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })
    // --- END getAllUsers --

    // --- START getUsersById --
    it('get user by Id - one user', async()=>{
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
                "name": "ivan",
                "email": "ivan@gmail.com"
              }
            ]
          }
        await userRouter.getUsers(req ,res);
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })

    it('get user by Id - multiple user', async()=>{
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
                "name": "ivan",
                "email": "ivan@gmail.com"
              },
              {
                "id": 2,
                "name": "peter",
                "email": "peter@hibye.com"
              }
            ]
          }
        await userRouter.getUsers(req ,res);
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })

    it('get user by Id - empty id', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            query:{
                getBy: 'id'
            }
        } as any
        const result = {"message": "Please Input email/id/googleId/name to search", "success": false}

        await userRouter.getUsers(req ,res);
        expect(res.status).toBeCalledWith(400)
        expect(res.json).toBeCalledWith(result)
    })

    it('get user by Id - id not exist', async()=>{
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
                "name": "ivan",
                "email": "ivan@gmail.com"
              }
            ]
          }
        await userRouter.getUsers(req ,res);
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })

    it('get user by Id - id < 1', async()=>{
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

        await userRouter.getUsers(req ,res)
        expect(res.status).toBeCalledWith(400)
        expect(res.json).toBeCalledWith(result)
    })
    // --- END getUsersById --

    // --- START getUsersByEmail --
    it('get user by Email - one user', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            query:{
                getBy: 'email'
            },
            params:{
                paramsArray: 'ivan@gmail.com'
            }
        } as any
        const result = {
            "success": true,
            "message": [
              {
                "id": 1,
                "name": "ivan",
                "email": "ivan@gmail.com"
              }
            ]
          }
        await userRouter.getUsers(req ,res);
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })

    it('get user by Email - multiple user', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            query:{
                getBy: 'email'
            },
            params:{
                paramsArray: 'ivan@gmail.com,peter@hibye.com'
            }
        } as any
        const result = {
            "success": true,
            "message": [
              {
                "id": 1,
                "name": "ivan",
                "email": "ivan@gmail.com"
              },
              {
                "id": 2,
                "name": "peter",
                "email": "peter@hibye.com"
              }
            ]
          }
        await userRouter.getUsers(req ,res);
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })

    it('get user by Email - empty Email', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            query:{
                getBy: 'email'
            }
        } as any
        const result = {"message": "Please Input email/id/googleId/name to search", "success": false}

        await userRouter.getUsers(req ,res);
        expect(res.status).toBeCalledWith(400)
        expect(res.json).toBeCalledWith(result)
    })

    it('get user by Email - email not exist', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            query:{
                getBy: 'email'
            },
            params:{
                paramsArray: 'testNotExist@gmail.com,  ivan@gmail.com  '
            }
        } as any
        const result = {
            "success": true,
            "message": [
              {
                "id": 1,
                "name": "ivan",
                "email": "ivan@gmail.com"
              }
            ]
          }
        await userRouter.getUsers(req ,res);
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })

    // --- END getUsersByEmail --

    // --- START getUsersByName --
    it('get user by Name - one user', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            query:{
                getBy: 'name'
            },
            params:{
                paramsArray: 'ivan'
            }
        } as any
        const result = {
            "success": true,
            "message": [
              {
                "id": 1,
                "name": "ivan",
                "email": "ivan@gmail.com"
              }
            ]
          }
        await userRouter.getUsers(req ,res);
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })

    it('get user by Name - multiple user', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            query:{
                getBy: 'name'
            },
            params:{
                paramsArray: 'ivan,peter'
            }
        } as any
        const result = {
            "success": true,
            "message": [
              {
                "id": 1,
                "name": "ivan",
                "email": "ivan@gmail.com"
              },
              {
                "id": 2,
                "name": "peter",
                "email": "peter@hibye.com"
              }
            ]
          }
        await userRouter.getUsers(req ,res);
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })

    it('get user by Name - empty Name', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            query:{
                getBy: 'name'
            }
        } as any
        const result = {"message": "Please Input email/id/googleId/name to search", "success": false}

        await userRouter.getUsers(req ,res);
        expect(res.status).toBeCalledWith(400)
        expect(res.json).toBeCalledWith(result)
    })

    it('get user by Name - Name not exist', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            query:{
                getBy: 'name'
            },
            params:{
                paramsArray: 'testNotExist,  ivan '
            }
        } as any
        const result = {
            "success": true,
            "message": [
              {
                "id": 1,
                "name": "ivan",
                "email": "ivan@gmail.com"
              }
            ]
          }
        await userRouter.getUsers(req ,res);
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })

    // --- END getUsersByName --

    // --- START getUsersByGoogleId --
    it('get user by googleId - one user', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            query:{
                getBy: 'googleId'
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
                "name": "ivan",
                "email": "ivan@gmail.com"
              }
            ]
          }
        await userRouter.getUsers(req ,res);
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })

    it('get user by googleId - multiple user', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            query:{
                getBy: 'googleId'
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
                "name": "ivan",
                "email": "ivan@gmail.com"
              },
              {
                "id": 2,
                "name": "peter",
                "email": "peter@hibye.com"
              }
            ]
          }
        await userRouter.getUsers(req ,res);
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })

    it('get user by googleId - empty googleId', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            query:{
                getBy: 'googleId'
            }
        } as any
        const result = {"message": "Please Input email/id/googleId/name to search", "success": false}

        await userRouter.getUsers(req ,res);
        expect(res.status).toBeCalledWith(400)
        expect(res.json).toBeCalledWith(result)
    })

    it('get user by googleId - googleId not exist', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            query:{
                getBy: 'googleId'
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
                "name": "ivan",
                "email": "ivan@gmail.com"
              }
            ]
          }
        await userRouter.getUsers(req ,res);
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })

    it('get user by googleId - googleId < 1', async()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            query:{
                getBy: 'googleId'
            },
            params:{
                paramsArray: '1,-999'
            }
        } as any
        const result = {
            "success": true,
            "message": [
              {
                "id": 1,
                "name": "ivan",
                "email": "ivan@gmail.com"
              }
            ]
          }

        await userRouter.getUsers(req ,res)
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })
    // --- END getUsersByGoogleId --

    // --- START updateUsers --

    it('update users - without update googleId', async ()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            body:{
                updateForms:[{
                    id: 1,
                    name: 'testName',
                    email: 'testing@test.com'
                }]
            }
        } as any
        const result = {success: true, message: 1}
        const resultUser = [{
            id: 1,
            name: 'testName',
            email: 'testing@test.com',
            googleId: '1'
        }]

        await userRouter.updateUsers(req ,res)
        const serviceResult = await userService.getUserById([1])
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
        expect(serviceResult).toEqual(resultUser)
    })

    it('update users - with update googleId', async ()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            body:{
                updateForms:[{
                    id: 1,
                    name: 'testName',
                    email: 'testing@test.com',
                    googleId: '9999992'
                }]
            }
        } as any
        const result = {success: true, message: 1}
        const resultUser = [{
            id: 1,
            name: 'testName',
            email: 'testing@test.com',
            googleId: '9999992'
        }]

        await userRouter.updateUsers(req ,res)
        const serviceResult = await userService.getUserById([1])
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
        expect(serviceResult).toEqual(resultUser)
    })

    it('update users - update multiple users', async ()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            body:{
                updateForms:[{
                    id: 1,
                    name: 'testName',
                    email: 'testing@test.com',
                    googleId: '9999992'
                },
                {
                    id: 2,
                    name: 'testName2',
                    email: 'testing2@test.com',
                    googleId: '9999992222'
                }]
            }
        } as any
        const result = {success: true, message: 2}
        const resultUser = [{
            id: 1,
            name: 'testName',
            email: 'testing@test.com',
            googleId: '9999992'
        },
        {
            id: 2,
            name: 'testName2',
            email: 'testing2@test.com',
            googleId: '9999992222'
        }]

        await userRouter.updateUsers(req ,res)
        const serviceResult = await userService.getUserById([1,2])
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
        expect(serviceResult).toEqual(resultUser)
    })

    it('update users - id not exist', async ()=>{
        const res = {
            status: jest.fn(()=>res),
            json: jest.fn()
        } as any
        const req = {
            body:{
                updateForms:[{
                    id: 9999,
                    name: 'testName',
                    email: 'testing@test.com',
                    googleId: '9999992'
                },
                {
                    id: 99999,
                    name: 'testName2',
                    email: 'testing2@test.com',
                    googleId: '9999992222'
                }]
            }
        } as any
        const result = {success: true, message: 0}

        await userRouter.updateUsers(req ,res)
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })

    // --- END updateUsers --

    // --- START deleteUsers --
    it('delete users by Id - one user', async ()=>{
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

        await userRouter.deleteUsers(req ,res)
        const serviceResult = await userService.getUserById([1])
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
        expect(serviceResult).toEqual([])
    })

    it('delete users by Id - multiple user', async ()=>{
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

        await userRouter.deleteUsers(req ,res)
        const serviceResult = await userService.getUserById([1,2])
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
        expect(serviceResult).toEqual([])
    })

    it('delete users by Id - with Id string', async ()=>{
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

        await userRouter.deleteUsers(req ,res)
        const serviceResult = await userService.getUserById([1])
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
        expect(serviceResult).toEqual([])
    })

    it('delete users by id - id not exist', async ()=>{
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

        await userRouter.deleteUsers(req ,res)
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith(result)
    })

})