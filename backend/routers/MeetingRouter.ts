import express from 'express'
import { Request, Response } from 'express'
import { MeetingService } from '../services/MeetingService';
export class MeetingRouter {
    constructor(private meetingService: MeetingService, private io: SocketIO.Server) { }

    router() {
        const router = express.Router();
        // router.get('/', this.getMeeting);
        router.get('/', this.getMeetingByUserId);
        router.get('/:id', this.getMeetingById);
        router.post('/create', this.createMeeting);
        router.put('/edit/:id', this.editMeeting);
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
            console.log(result)
            res.status(200).json({ success: true, message: result });
            // return;
        } catch (err) {
            console.log(err.message);
            res.status(500).json({ message: "Meeting Router getMeeting error" });
        }
    }

    createMeeting = async (req: Request, res: Response) => {
        try {
            const { name, code, question_limit, pre_can_moderate, pre_can_upload_file } = req.body.meetingContent;
            const date_time = req.body.datetime
            console.log(date_time)
            const can_moderate = pre_can_moderate === '1' ? true : false
            const can_upload_file = pre_can_upload_file === '1' ? true : false
            const userId = req.personInfo?.userId
            const fake_url = req.body.meetingContent.code;
            // const userId = 1 // change later
            // console.log(req.body.name);
            if (!name|| !code|| !question_limit|| !pre_can_moderate|| !pre_can_upload_file) {
                const arr=[];
                for(const key in req.body.meetingContent){
                    if(req.body.meetingContent[key].length === 0) arr.push(key);
                }
                // const str = arr.join(', ')
                // res.json({ message: str + " field missing" });
                res.json({ message: "Please fill out all required fields" });
                return;
            }
            console.log(code)
            const checkMeeting = await this.meetingService.getMeetingByMeetingCode(code);
            if (checkMeeting) {
                console.log("Meeting code existed already")
                res.json({ message: "Meeting code existed already" });
                return;
            }
            const checkMeetingName = await this.meetingService.getMeetingByMeetingName(name);
            if (checkMeetingName) {
                console.log("Meeting name existed already")
                res.json({ message: "Meeting name existed already" });
                return;
            }

            if (!userId) {
                return res.json({ message: "UserId not found" });
            }
            const meetingId = await this.meetingService.createMeeting(name, date_time, code, fake_url, userId, question_limit, can_moderate, can_upload_file);
            return res.json({ meeting_id: meetingId });
        } catch (err) {
            console.log(err.message);
            res.json({ message: "Can't create meeting" });
            return;
        }
    }

    editMeeting = async (req: Request, res: Response) => {
        try {
            const meetingId = parseInt(req.params.id);
            if (!meetingId || isNaN(meetingId)) return res.status(400).json({ message: 'Invalid meetingId' })
            const hvMeeting = await this.meetingService.checkMeetingId(meetingId)
            console.log(hvMeeting)
            // const meetings = await this.meetingService.getMeetingByUserId(req.personInfo?.userId!);
            // console.log(meetings)
            if (!hvMeeting) return res.status(401).json({ message: "Can't Edit meeting. This meeting is not owned by you" })
            if (hvMeeting > 0) {
            const meeting = await this.meetingService.getMeetingById(meetingId);
            if (meeting.ownerId !== req.personInfo?.userId) return res.status(401).json({ message: "Can't edit meeting. This meeting is not owned by you" })
            const { name, dateTime, code } = req.body;
            if (isNaN(meetingId)) {
                res.status(400).json({ message: "Meeting Id is not a number" })
                return;
            }
            const checkMeeting = await this.meetingService.getMeetingByMeetingCode(code);
            if (checkMeeting) {
                console.log("Meeting code existed already")
                res.json({ message: "Can't edit meeting. Meeting code existed already" });
                return;
            }
            const checkMeetingName = await this.meetingService.getMeetingByMeetingName(name);
            if (checkMeetingName) {
                console.log("Meeting name existed already")
                res.json({ message: "Can't edit meeting. Meeting name existed already" });
                return;
            }
            await this.meetingService.editMeeting(parseInt(req.params.id), name, code, dateTime);
            return res.status(200).json({status:true});
        }
        return res.status(500).json({status:false});
    }
        catch (err) {
            console.log(err.message);
            res.json({ message: "Can't edit meeting" });
            return;
        }
    
    }


    deleteMeeting = async (req: Request, res: Response) => {
        try {
            let meetingId = parseInt(req.params.id);
            if (!meetingId || isNaN(meetingId)) return res.status(400).json({ message: 'Invalid meetingId' })
            const hvMeeting = await this.meetingService.checkMeetingId(meetingId)
            console.log(hvMeeting)
            // const meetings = await this.meetingService.getMeetingByUserId(req.personInfo?.userId!);
            // console.log(meetings)
            if (!hvMeeting) return res.status(401).json({ message: "Can't delete meeting. This meeting is not owned by you" })
            if (hvMeeting > 0) {
                const deletedRows = await this.meetingService.deleteMeeting(meetingId);
                if (deletedRows === 0) {
                    return res.status(401).json({ message: "Can't delete meeting." })
                } else {
                    return res.status(200).json({ success: true, message: meetingId });
                }
            } else {
                return res.status(400).json({ message: "Meeting Id is not a number" })
            }

        } catch (err) {
            console.log(err.message);
            res.json({ message: "Can't delete meeting" });
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

    convertCodeToId = async (req: Request, res: Response) => {
        try {
            if (typeof req.query.code !== typeof 'abc') return res.status(400).json({ status: true, message: 'Invalid param' });
            const roomId = await this.meetingService.convertCodeToRoomId(req.query.code as string);
            res.status(200).json({ status: true, message: roomId });
            return;
        } catch (err) {
            console.log(err.message);
            res.status(404).json({ status: false, message: 'Room not found!' });
            return;
        }
    }
}