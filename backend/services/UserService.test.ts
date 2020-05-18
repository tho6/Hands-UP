import { seed } from '../seeds/create-users'
import Knex from 'knex'
import { UserService } from './UserService';
import { UserForm } from './models/UserInterface';

const knexConfig = require('../knexfile');
const knex = Knex(knexConfig[process.env.TESTING_ENV || "testing"]);

describe('testing User Service', ()=>{
    let userService: UserService
    beforeEach(async ()=>{
        await seed(knex)
        userService = new UserService(knex)
    })

    afterAll(()=>{
        knex.destroy();
    })

    // ------------------------ START getUserByID ------------------------
    it('get user by ID - one user', async ()=>{
        const userId = [1]
        const result = [{
            id: 1,
            name: 'ivan',
            email: 'ivan@gmail.com',
            googleId: "1"
        }]
        const serviceResult = await userService.getUserById(userId)
        expect(serviceResult).toEqual(result);
    })

    it('get user by ID - multiple user', async()=>{
        const userId = [1,2]
        const result = [{
            id: 1,
            name: 'ivan',
            email: 'ivan@gmail.com',
            googleId: "1"
        },
        {
            id: 2,
            name: 'peter',
            email: 'peter@hibye.com',
            googleId: "2"
        }]
        const serviceResult = await userService.getUserById(userId)
        expect(serviceResult).toEqual(result);
    })

    it('get user by ID - without providing ID', async()=>{
        const userId: number[] = []
        await expect(userService.getUserById(userId)).rejects.toThrow("ID array is empty")
    })

    it('get user by ID - Id smaller than 1', async ()=>{
        const userId = [1,0]
        // const result:{}[] = []
        await expect(userService.getUserById(userId)).rejects.toThrow("ID array contain value smaller than 1")
    })

    it('get user by ID - ID not exits', async ()=>{
        const userId: number[] = [999]
        const serviceResult = await userService.getUserById(userId)
        expect(serviceResult).toEqual([]);
    })

    // ------------------------ END getUserByID ------------------------

    // ------------------------ START getUserByName ------------------------

    it('get user by Name - one user', async ()=>{
        const names = ['ivan']
        const result = [{
            id: 1,
            name: 'ivan',
            email: 'ivan@gmail.com',
            googleId: "1"
        }]
        const serviceResult = await userService.getUserByName(names)
        expect(serviceResult).toEqual(result);
    })

    it('get user by Name - multiple user', async()=>{
        const names = ['peter','ivan']
        const result = [{
            id: 1,
            name: 'ivan',
            email: 'ivan@gmail.com',
            googleId: "1"
        },
        {
            id: 2,
            name: 'peter',
            email: 'peter@hibye.com',
            googleId: "2"
        }]
        const serviceResult = await userService.getUserByName(names)
        expect(serviceResult).toEqual(result);
    })

    it('get user by Name - without providing Name', async()=>{
        const names: string[] = []
        await expect(userService.getUserByName(names)).rejects.toThrow("Name array is empty")
    })

    it('get user by Name - name not exist', async()=>{
        const names = ['name not exist','ivan']
        const result = [{
            id: 1,
            name: 'ivan',
            email: 'ivan@gmail.com',
            googleId: "1"
        }]
        const serviceResult = await userService.getUserByName(names)
        expect(serviceResult).toEqual(result);
    })

    // ------------------------ END getUserByName ------------------------

    // ------------------------ START getUserByEmail ------------------------

    it('get user by Email - one user', async ()=>{
        const emails = ['ivan@gmail.com']
        const result = [{
            id: 1,
            name: 'ivan',
            email: 'ivan@gmail.com',
            googleId: "1"
        }]
        const serviceResult = await userService.getUserByEmail(emails)
        expect(serviceResult).toEqual(result);
    })

    it('get user by Email - multiple user', async()=>{
        const emails = ['peter@hibye.com','ivan@gmail.com']
        const result = [{
            id: 1,
            name: 'ivan',
            email: 'ivan@gmail.com',
            googleId: "1"
        },
        {
            id: 2,
            name: 'peter',
            email: 'peter@hibye.com',
            googleId: "2"
        }]
        const serviceResult = await userService.getUserByEmail(emails)
        expect(serviceResult).toEqual(result);
    })

    it('get user by Email - without providing Email', async()=>{
        const emails: string[] = []
        await expect(userService.getUserByEmail(emails)).rejects.toThrow("Email array is empty")
    })

    it('get user by Email - email not exist', async()=>{
        const emails: string[] = ['emailNotExist@gmail.com']
        const serviceResult = await userService.getUserByEmail(emails)
        expect(serviceResult).toEqual([]);
    })

    // ------------------------ END getUserByEmail ------------------------

    // ------------------------ START getUserByGoogleID ------------------------
    it('get user by google ID - one user', async ()=>{
        const googleId = ["1"]
        const result = [{
            id: 1,
            name: 'ivan',
            email: 'ivan@gmail.com',
            googleId: "1"
        }]
        const serviceResult = await userService.getUserByGoogleId(googleId)
        expect(serviceResult).toEqual(result);
    })

    it('get user by google ID - multiple user', async()=>{
        const googleId = ["1","2"]
        const result = [{
            id: 1,
            name: 'ivan',
            email: 'ivan@gmail.com',
            googleId: "1"
        },
        {
            id: 2,
            name: 'peter',
            email: 'peter@hibye.com',
            googleId: "2"
        }]
        const serviceResult = await userService.getUserByGoogleId(googleId)
        expect(serviceResult).toEqual(result);
    })

    it('get user by google ID - without providing google ID', async()=>{
        const googleId: string[] = []
        await expect(userService.getUserByGoogleId(googleId)).rejects.toThrow("GoogleId array is empty")
    })


    it('get user by Google ID - ID not exits', async ()=>{
        const googleId = ["999"]
        const serviceResult = await userService.getUserByGoogleId(googleId)
        expect(serviceResult).toEqual([]);
    })

    // ------------------------ END getUserByGoogleID ------------------------

    // ------------------------ START creatUser ------------------------

    it('create user', async ()=>{
        // const userService = new UserService(knex)
        const name = 'sam'
        const email = 'sam456@gmail.com'
        const id = 4;
        const googleId = "4"
        const serviceResult = await userService.createUser(name, email, googleId)
        expect(serviceResult).toBe(id)
    })

    // ------------------------ END creatUser ------------------------

    // ------------------------ START deleteUserByID ------------------------

    it('delete user by ID - one user', async ()=>{
        const userId = [1]
        const serviceResult = await userService.deleteUserById(userId)
        expect(serviceResult).toEqual(1)
        const getUserResult = await userService.getUserById(userId)
        expect(getUserResult).toEqual([]);
        
    })

    it('delete user by ID - multiple users', async ()=>{
        const userId = [1,2]
        const serviceResult = await userService.deleteUserById(userId)
        expect(serviceResult).toEqual(2)
        const getUserResult = await userService.getUserById(userId)
        expect(getUserResult).toEqual([]);
    })

    it('delete user by ID - without providing ID', async ()=>{
        const userId: number[] = []
        await expect(userService.deleteUserById(userId)).rejects.toThrow('ID array is empty')
    })

    it('delete user by ID - ID array contains value < 1', async ()=>{
        const userId: number[] = [0,1,2]
        await expect(userService.deleteUserById(userId)).rejects.toThrow('ID array contain value smaller than 1')
    })

    it('delete user by ID - ID array contains id not exist', async ()=>{
        const userId: number[] = [999,1,2]
        const serviceResult = await userService.deleteUserById(userId)
        expect(serviceResult).toEqual(2)    
    })

    // ------------------------ END deleteUserByID ------------------------

    // // ------------------------ START deleteUserByEmail ------------------------

    // it('delete user by Email - one user', async ()=>{
    //     const emails = ['ivan@gmail.com']
    //     const serviceResult = await userService.deleteUserByEmail(emails)
    //     expect(serviceResult).toEqual(1);
    //     const getUserResult = await userService.getUserByEmail(emails)
    //     expect(getUserResult).toEqual([]);
        
    // })

    // it('delete user by Email - multiple users', async ()=>{
    //     const emails = ['peter@hibye.com','ivan@gmail.com']
    //     const serviceResult = await userService.deleteUserByEmail(emails)
    //     expect(serviceResult).toEqual(2);
    //     const getUserResult = await userService.getUserByEmail(emails)
    //     expect(getUserResult).toEqual([]);
    // })

    // it('delete user by Email - without providing Email', async ()=>{
    //     const emails: string[] = []
    //     await expect(userService.deleteUserByEmail(emails)).rejects.toThrow('Email array is empty')
    // })

    // it('delete user by Email - email not exist', async ()=>{
    //     const emails: string[] = ['emailNotExist@gmail.com']
    //     const serviceResult = await userService.deleteUserByEmail(emails)
    //     expect(serviceResult).toEqual(0);
    // })

    // // ------------------------ END deleteUserByEmail ------------------------

    // ------------------------- START updateUserById -------------------------
    it('update user by ID - one user', async ()=>{
        const updateForms:UserForm[] = [{
            id: 1,
            name: 'test',
            email: 'testing@gmail.com',
            googleId: 'testGoogleId'
        }]
        await userService.updateUserById(updateForms)
        const serviceResult = await userService.getUserById([1])
        expect(serviceResult).toEqual(updateForms)
    })

    it('update user by ID - multiple user', async ()=>{
        const updateForms:UserForm[] = [{
            id: 1,
            name: 'test',
            email: 'testing@gmail.com',
            googleId: 'testGoogleId'
        },
        {
            id: 2,
            name: 'test2',
            email: 'testing2@gmail.com',
            googleId: 'testGoogleId2'
        }]
        const updateLength = await userService.updateUserById(updateForms)
        const serviceResult = await userService.getUserById([1,2])
        expect(serviceResult).toEqual(updateForms)
        expect(updateLength).toEqual(2)
    })

    it('update user by ID - without providing update form', async()=>{
        const updateForms:UserForm[] = []
        await expect(userService.updateUserById(updateForms)).rejects.toThrow("Update array is empty")
    })

    it('update user by ID - id not exist', async()=>{
        const updateForms:UserForm[] = [{
            id: 999,
            name: 'test',
            email: 'testing@gmail.com',
            googleId: 'testGoogleId'
        }]
        const upadtedRows = await userService.updateUserById(updateForms)
        // const serviceResult = await userService.getUserById([999])
        expect(upadtedRows).toEqual(0)
    })
    // ------------------------- END updateUserById -------------------------

    // ------------------------ START gatAllUsers ------------------------
    it('get all user - normal', async ()=>{
        const result = [{
            id: 1,
            name: 'ivan',
            email: 'ivan@gmail.com',
            googleId: "1"
        },
        {
            id: 2,
            name: 'peter',
            email: 'peter@hibye.com',
            googleId: "2"
        },
        {
            id: 3,
            name:'mary',
            email: "mary1@hey.com",
            googleId: "3"
        }]
       const serviceResult = await userService.getAllUsers();
       expect(serviceResult).toEqual(result)
    })

    it('get all user - no users in database', async ()=>{
        const result: [] = []

        await userService.deleteUserById([1,2,3]);
        const serviceResult = await userService.getAllUsers();
        expect(serviceResult).toEqual(result)
    })
    // ------------------------ END gatAllUsers ------------------------
})