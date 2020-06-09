import express from 'express'
import { Request, Response } from 'express'
import { MeetingService } from '../services/MeetingService';

export class MeetingRouter {
    constructor(private meetingService: MeetingService, private io: SocketIO.Server) { }

    router() {
        const router = express.Router();
        // router.get('/', this.getMeeting);
        router.get('/', this.getMeetingByUserId);
        // router.get('/:id', this.getMeetingById);
        router.post('/create', this.createMeeting);
        router.put('/:id', this.editMeeting);
        router.put('/in/room/:id([0-9]+)', this.updateMeetingInRoom);
        router.delete('/delete/:id', this.deleteMeeting);
        return router;
    }

    // getMeeting = async (req: Request, res: Response) => {
    //     try {
    //         const result = await this.meetingService.getMeeting();
    //         res.json(result);
    //         // return;
    //     } catch (err) {
    //         console.log(err.message);
    //         res.status(500).json({ message: "Meeting Router getMeeting error" });
    //     }
    // }

    getMeetingByUserId = async (req: Request, res: Response) => {
        try {
            console.log(req.personInfo?.userId)
            const userId = req.personInfo?.userId!
            // const userId = 1 // change later
            const result = await this.meetingService.getMeetingByUserId(userId);
            res.status(200).json({ success: true, message: result });
            // return;
        } catch (err) {
            console.log(err.message);
            res.status(500).json({ message: "Meeting Router getMeeting error" });
        }
    }

    createMeeting = async (req: Request, res: Response) => {
        try {
            const { name, date, time, code, url, question_limit, pre_can_moderate, pre_can_upload_file } = req.body;
            const date_time = new Date(date + ' ' + time)
            console.log(date_time);
            const can_moderate = pre_can_moderate === '1' ? true : false
            const can_upload_file = pre_can_upload_file === '1' ? true : false
            const userId = req.personInfo?.userId
            // const userId = 1 // change later
            console.log(req.body.name);
            const checkMeeting = await this.meetingService.getMeetingByMeetingCode(code);
            if (checkMeeting) {
                res.status(400).json({ message: "Meeting code existed" });
                return;
            }
            if (!userId) {
                return res.status(400).json({ message: "UserId not found" });
            }
            const meetingId = await this.meetingService.createMeeting(name, date_time, code, url, userId, question_limit, can_moderate, can_upload_file);
            return res.json({ meeting_id: meetingId });
        } catch (err) {
            console.log(err.message);
            res.json({ message: "Cannot create meeting" });
            return;
        }
    }

    editMeeting = async (req: Request, res: Response) => {
        try {
            const meetingId = parseInt(req.params.id);
            const meetings = await this.meetingService.getMeetingByUserId(req.personInfo?.userId!);
            if (!(meetingId in meetings)) return res.status(401).json({ message: "Not Own By You" })
            const { name, date_time, code, url, owner_id } = req.body;
            if (isNaN(meetingId)) {
                res.status(400).json({ message: "Meeting Id is not a number" })
                return;
            }
            const result = await this.meetingService.editMeeting(meetingId, name, date_time, code, url, owner_id);
            return res.json({ result });
        }
        catch (err) {
            console.log(err.message);
            res.json({ message: "Cannot edit meeting" });
            return;
        }
    }

    deleteMeeting = async (req: Request, res: Response) => {
        try {
            let meetingId = parseInt(req.params.id);
            const meetings = await this.meetingService.getMeetingByUserId(req.personInfo?.userId!);
            if (!(meetingId in meetings)) return res.status(401).json({ message: "Not Own By You" })
            if (isNaN(meetingId)) {
                res.status(400).json({ message: "Meeting Id is not a number" })
                return;
            }
            const result = await this.meetingService.deleteMeeting(meetingId);
            return res.json({ result });
        } catch (err) {
            console.log(err.message);
            res.json({ message: "Cannot delete meeting" });
            return;
        }
    }

    getMeetingById = async (req: Request, res: Response) => {
        try {
            const meetingInformation = await this.meetingService.getMeetingById(parseInt(req.params.id));
            res.status(200).json({ status: true, message: meetingInformation })
        } catch (err) {
            console.log(err.message);
            res.status(404).json({ status: false, message: err.message });
            return;
        }
    }

    updateMeetingInRoom = async (req: Request, res: Response) => {
        try {
            const roomConfiguration = { ...req.body.roomConfiguration }
            const isUpdate = await this.meetingService.updateMeetingInRoom(parseInt(req.params.id), roomConfiguration);
            if (isUpdate) {
                this.io.in(`event:${req.params.id}`).emit('update-room-configuration', { meetingId: parseInt(req.params.id), roomConfiguration });
                res.status(200).json({ status: true, message: roomConfiguration });
                return;
            } else {
                throw new Error('Unknown Error - Fail to update meeting in room!');
            }
        } catch (err) {
            console.log(err.message);
            res.status(404).json({ status: false, message: err.message });
            return;
        }
    }
}