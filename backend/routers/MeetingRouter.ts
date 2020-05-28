import express, { Request, Response } from 'express'
import { MeetingService } from '../services/MeetingService';

export class MeetingRouter {
    constructor(private meetingService: MeetingService) { }

    router() {
        const router = express.Router();
        router.get('/', this.getMeeting);
        router.post('/', this.createMeeting);
        // router.get('/all', this.getAllMeeting);
        // router.put('/', this.editMeeting)
        // router.delete('/', this.deleteMeeting);
        return router;
    }

    getMeeting = async (req: Request, res: Response) => {
        try {
            const result = await this.meetingService.getMeeting();
            res.json(result);
            // return;
        } catch (err) {
            console.log(err.message);
            res.status(500).json({ message: "Meeting Router getMeeting error"});
        }
    }

    // getAllMeeting = async (req: Request, res: Response) => {
    //     try {
    //         const result = await this.meetingService.getAllMeeting();
    //         console.log(result);
    //         res.json({ result });
    //     } catch (err) {
    //         console.log(err);
    //         res.json({ message: "Get all meeting error" });
    //     };
    // }

    createMeeting = async (req: Request, res: Response) => {
        try {
            const { name, date_time, code } = req.body;
            const checkMeeting = await this.meetingService.getMeetingByMeetingName(name);
            if (checkMeeting) {
                res.status(400).json({ message: "Meeting name existed" });
                return;
            }
            const meetingId = await this.meetingService.createMeeting("name", date_time, code, "url");
            res.json({ meeting_id: meetingId });
        } catch (err) {
            console.log(err.message);
            res.json({ message: "Cannot create meeting" });
        }
    }
}

    // editMeeting = async (req: Request, res: Response) => {

        // }

        // deleteMeeting = async (req: Request, res: Response) => {

    // }
// }