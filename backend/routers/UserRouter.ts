import { UserService } from "../services/UserService";
import express, { Request, Response } from 'express'
import { UserForm } from "../models/UserInterface";

//check ids is empty first
export class UserRouter {
    constructor(private userService: UserService){}

    router() {
        const router = express.Router();
        router.get('/all', this.getAllUsers)
        router.get('/:paramsArray', this.getUsers)
        // router.post()
        // router.put()
        return router
    }
    //get all users
    
    getAllUsers = async (req: Request, res: Response) => {
        try {
            const users:UserForm[] = await this.userService.getAllUsers();
            const outputUsers = users.map(({ googleId, ...item }) => item);
            return res.status(200).json({success: true, message: outputUsers})
            
        } catch (error) {
            return error.name == 'RangeError'? 
                res.status(400).json({success: false, message: error.message}):
                res.status(500).json({success: false, message: 'internal error'})        
            }
    }
    
    getUsers = async (req: Request, res: Response) => {
        try {
            let users: UserForm[]
            const getBy = req.query.getBy
            if (getBy !== 'id' && getBy !== 'name' && getBy !== 'email' && getBy !== 'googleId'){
                res.status(400).json({message: 'getBy query string should be [id / email / name/ googleId]'})
                return
            }
            const searchString = req.params?.paramsArray
            if (!searchString) {
                return res.status(400).json({success: false, message: 'Please Input email/id/googleId/name to search'})
            }
            const searchArrayPre = searchString.split(',')
            const searchArray = searchArrayPre.map(v=>v.trim())


            let searchArrayNum
            switch (getBy){
                case 'id':
                    searchArrayNum = searchArray.map(n => parseInt(n))
                    users = await this.userService.getUserById(searchArrayNum)
                    break
                case 'name':
                    users = await this.userService.getUserByName(searchArray)
                    break
                case 'email':
                    users = await this.userService.getUserByEmail(searchArray)
                    break
                case 'googleId':
                    users = await this.userService.getUserByGoogleId(searchArray)
                    break
            }
            const outputUsers = users!.map(({ googleId, ...item }) => item);
            console.log(searchArray)
            return res.status(200).json({success: true, message: outputUsers})
        } catch (error) {
            return error.name == 'RangeError'? 
                res.status(400).json({success: false, message: error.message}):
                res.status(500).json({success: false, message: 'internal error'})
        }
    }

    // //create users --> auth router
    // createUser = async (req: Request, res: Response)=>{
    //     const name = req.body.name
    //     const email = req.body.email
    //     const googleId = req.body.googleId
    // }

    //update users
    updateUsers = async (req: Request, res: Response) => {
        try {
            const updateForms:UserForm[] = req.body.updateForms
            if (!updateForms) return res.status(400).json({success: false, message: 'UpdateForm is not found'})
            const updatedUsersRows = await this.userService.updateUserById(updateForms)
            return res.status(200).json({success: true, message: updatedUsersRows})
        } catch (error) {
            return error.name == 'RangeError'? 
                res.status(400).json({success: false, message: error.message}):
                res.status(500).json({success: false, message: 'internal error'})
        }

    }

    //delete users
    deleteUsers = async (req: Request, res: Response) => {
        try {
            const idsInput: Array<string> = req.body.ids
            if (!idsInput) return res.status(400).json({success: false, message: 'ID array is not found'})
            const ids = idsInput.map(n => parseInt(n))

            const deletedRowsNum = await this.userService.deleteUserById(ids)
            return res.status(200).json({success: true, message: deletedRowsNum})
        } catch (error) {
            return error.name == 'RangeError'? 
                res.status(400).json({success: false, message: error.message}):
                res.status(500).json({success: false, message: 'internal error'})
        }

    }
}