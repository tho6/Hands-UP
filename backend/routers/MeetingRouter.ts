import express, { Request, Response, Router } from 'express'

export class MeetingRouter {
    constructor(private meetingService: MeetingService) { }

    router() {
        const router = express.Router();
        router.get('/all', this.getAllMeeting);
        router.get('/', this.getMeeting);
        router.post('/', this.createMeeting);
        router.put('/', this.editMeeting)
        router.delete('/', this.deleteMeeting);
        return router;
    }

    getAllMeeting = async (req: Request, res: Response) => {
        try {
            const result = 
            return result.rows;
        } catch (error) {
            console.log("Meeting Service getAllMeeting error")
            throw error;
        }
    }

    getMeeting = async (req: Request, res: Response) => {

    }

    createMeeting = async (req: Request, res: Response) => {

    }

    editMeeting = async (req: Request, res: Response) => {

    }

    deleteMeeting = async (req: Request, res: Response) => {

    }
}