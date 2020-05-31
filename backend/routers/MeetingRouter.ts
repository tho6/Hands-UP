import express from 'express'
import { Request, Response } from 'express'
import { MeetingService } from '../services/MeetingService';

export class MeetingRouter {
    constructor(private meetingService: MeetingService) { }

    router() {
        const router = express.Router();
        router.get('/', this.getMeeting);
        router.post('/create', this.createMeeting);
        router.put('/:id', this.editMeeting);
        router.delete('/:id', this.deleteMeeting);
        return router;
    }

    getMeeting = async (req: Request, res: Response) => {
        try {
            const result = await this.meetingService.getMeeting();
            res.json(result);
            // return;
        } catch (err) {
            console.log(err.message);
            res.status(500).json({ message: "Meeting Router getMeeting error" });
        }
    }

    createMeeting = async (req: Request, res: Response) => {
        try {
            const { name, date_time, code, url, owner_id } = req.body;
            const checkMeeting = await this.meetingService.getMeetingByMeetingName(name);
            if (checkMeeting) {
                res.status(400).json({ message: "Meeting name existed" });
                return;
            }
            const meetingId = await this.meetingService.createMeeting(name, date_time, code, url, owner_id);
            res.json({ meeting_id: meetingId });
        } catch (err) {
            console.log(err.message);
            res.json({ message: "Cannot create meeting" });
        }
    }

    editMeeting = async (req: Request, res: Response) => {
        const { name, date_time, code, url, owner_id } = req.body;
        const meetingId = parseInt(req.params.id);
        if (isNaN(meetingId)) {
            res.status(400).json({ message: "Id is not a number" })
            return;
        }
        const result = await this.meetingService.editMeeting(meetingId, name, date_time, code, url, owner_id);
        res.json({ result });
    }

    deleteMeeting = async (req: Request, res: Response) => {
        let meetingId = parseInt(req.params.id);
        if (isNaN(meetingId)) {
            res.status(400).json({ message: "Id is not a number" })
            return;
        }
        const result = await this.meetingService.deleteMeeting(meetingId);
        res.json({ result });
    }
}