
import express, { Request, Response } from 'express'
import { GuestForm } from "../models/GuestInterface";
import { GuestService } from '../services/GuestService';

//check ids is empty first
export class GuestRouter {
    constructor(private guestService: GuestService){}

    router() {
        const router = express.Router();
        router.get('/all', this.getAllGuests)
        router.get('/:paramsArray', this.getGuests)
        router.delete('/', this.deleteGuests)
        router.put('/', this.updateGuests)
        return router
    }
    //get all guests
    
    getAllGuests = async (req: Request, res: Response) => {
        try {
            const outputGuests:GuestForm[] = await this.guestService.getAllGuests();
            
            return res.status(200).json({success: true, message: outputGuests})
            
        } catch (error) {
            return error.name == 'RangeError'? 
                res.status(400).json({success: false, message: error.message}):
                res.status(500).json({success: false, message: 'internal error'})        
            }
    }
    
    getGuests = async (req: Request, res: Response) => {
        try {
            const getBy = req.query.getBy
            if (getBy !== 'id' && getBy !== 'name'){
                res.status(400).json({message: 'getBy query string should be [id / name]'})
                return
            }
            const searchString = req.params?.paramsArray
            if (!searchString) {
                return res.status(400).json({success: false, message: 'Please Input id/name to search'})
            }
            const searchArrayPre = searchString.split(',')
            const searchArray = searchArrayPre.map(v=>v.trim())

            const searchArrayNum = searchArray.map(n => parseInt(n))
            const outputGuests: GuestForm[] = await this.guestService.getGuestById(searchArrayNum)
            
            return res.status(200).json({success: true, message: outputGuests})
        } catch (error) {
            return error.name == 'RangeError'? 
                res.status(400).json({success: false, message: error.message}):
                res.status(500).json({success: false, message: 'internal error'})
        }
    }

    // //create guests --> auth router
    // createGuest = async (req: Request, res: Response)=>{
    //     const name = req.body.name
    //     const email = req.body.email
    //     const googleId = req.body.googleId
    // }

    //update guests
    updateGuests = async (req: Request, res: Response) => {
        try {
            const updateForms:GuestForm[] = req.body.updateForms
            if (!updateForms) return res.status(400).json({success: false, message: 'UpdateForm is not found'})
            const updatedGuestsRows = await this.guestService.updateGuestById(updateForms)
            return res.status(200).json({success: true, message: updatedGuestsRows})
        } catch (error) {
            return error.name == 'RangeError'? 
                res.status(400).json({success: false, message: error.message}):
                res.status(500).json({success: false, message: 'internal error'})
        }

    }

    //delete guests
    deleteGuests = async (req: Request, res: Response) => {
        try {
            const idsInput: Array<string> = req.body.ids
            if (!idsInput) return res.status(400).json({success: false, message: 'ID array is not found'})
            const ids = idsInput.map(n => parseInt(n))

            const deletedRowsNum = await this.guestService.deleteGuestById(ids)
            return res.status(200).json({success: true, message: deletedRowsNum})
        } catch (error) {
            return error.name == 'RangeError'? 
                res.status(400).json({success: false, message: error.message}):
                res.status(500).json({success: false, message: 'internal error'})
        }

    }
}