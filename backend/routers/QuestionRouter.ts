import express from "express";
import { Request, Response } from "express";
import { IQuestionService } from "../models/Interface/IQuestionService";
import { question } from "../models/type/question";
import { customFileDB } from "../models/type/questionFromDB";
import socketIO from 'socket.io';

export class QuestionRouter {
    private counter: { [id: string]: { counting: boolean, count: number } } = {};
    constructor(private questionService: IQuestionService, private upload: any, private io: socketIO.Server) { }

    router() {
        const router = express.Router();
        router.get("/:id([0-9]+)/questions", this.getQuestionsByRoomId);//ticketId
        router.post("/:id([0-9]+)/questions", this.upload.array('images[]', 3), this.createQuestion);
        router.put("/questions/:id([0-9]+)", this.upload.array('images[]', 3), this.updateQuestion);
        router.delete("/questions/:id([0-9]+)", this.deleteQuestion);
        router.put("/questions/:id([0-9]+)/vote", this.addVote);
        router.put("/questions/:id([0-9]+)/votef", this.removeVote);
        router.put("/questions/:id([0-9]+)/answered", this.answeredQuestion);
        router.put("/questions/:id([0-9]+)/hide", this.hideOrApprovedQuestion);
        router.put("/questions/reply/:id([0-9]+)", this.updateReply);
        router.post("/questions/:id([0-9]+)/reply", this.createReply);
        router.delete("/questions/reply/:id([0-9]+)", this.deleteReply);
        router.put("/questions/reply/:id([0-9]+)/hide", this.hideOrNotHideReply);
        return router;
    }
    getQuestionsByRoomId = async (req: Request, res: Response) => {
        try {
            const questions: question[] = await this.questionService.getQuestionsByRoomId(parseInt(req.params.id));
            res.status(200).json({ status: true, message: questions });
            return;
        } catch (e) {
            console.error(e);
            res.status(500).json({ status: false, message: e.message });
            return;
        }
    }
    createQuestion = async (req: Request, res: Response) => {
        if (req.personInfo) {
            try {
              // console.log(this.counter[`${req.personInfo.guestId}`]);
                const idx = `${req.personInfo.guestId}`;
                if (this.counter[`${req.personInfo.guestId}`]) {
                    if (this.counter[idx].count >= 3) throw new Error('Exceed question limits!');
                    this.counter[idx].count += 1;
                    console.log( this.counter[idx].count);
                }else{
                    this.counter[idx] = {counting: true, count:1};
                        setTimeout(() => {
                        delete this.counter[idx];
                        }, 10000)
                }
                /* Validation */
                const { content } = req.body;
                if (content.trim().length === 0) throw new Error('Question cannot be empty!');
                /* Action */
                try {
                    const files = req.files.length === 0 ? [] : (req.files as Express.Multer.File[]).map((file) => file.filename);
                    const resQuestion: question = await this.questionService.createQuestion(parseInt(req.params.id), content, files, 1, req.personInfo.guestId);
                    this.io.in(`event:${resQuestion.meetingId}`).emit('create-question', resQuestion);
                    res.status(200).json({ status: true, message: resQuestion });
                    return;
                } catch (e) {
                    console.error(e);
                    res.status(500).json({ status: false, message: e.message });
                    return;
                }
            } catch (e) {
                res.status(400).json({ status: false, message: e.message });
                return;
            }
        }
        else {
            res.status(400).json({ status: false, message: 'Not Logged In Yet!' });
            return;
        }
    }
    updateQuestion = async (req: Request, res: Response) => {
        if (req.personInfo) {
            try {
                /* Validation */
                const { content, deleteFilesId } = req.body;
                if (content.trim().length === 0) throw new Error('Question cannot be empty!');
                if (!deleteFilesId) throw new Error('Property deleteFilesId is missing!');
                const deleteFilesIdArr = JSON.parse(deleteFilesId);
                    for (const id of deleteFilesIdArr) {
                        if (!Number.isInteger(id) || id < 0) throw new Error('Invalid deleFilesId!')
                    }
                const questionId = parseInt(req.params.id);
                if (!(await this.checkHost(questionId, (req.personInfo.userId || 0)) || await this.checkQuestionOwner(questionId, req.personInfo.guestId))) throw new Error('You are not allowed to update the question!');
                /* Action */
                try {
                    const files = req.files.length === 0 ? [] : (req.files as Express.Multer.File[]).map((file) => file.filename);
                    const result: { files: customFileDB[], needApproved: boolean } = await this.questionService.updateQuestion(questionId, content, deleteFilesIdArr, files);
                    const data = { content, questionId, deleteFilesId:deleteFilesIdArr, files: result.files, updatedAt: new Date(Date.now()), isApproved: result.needApproved ? false : true };
                    const meetingId = await this.questionService.getRoomIdByQuestionId(questionId);
                    this.io.in(`event:${meetingId}`).emit('update-question', data);
                    res.status(200).json({ status: true, message: data });
                    return;
                } catch (e) {
                    console.error(e);
                    res.status(500).json({ status: false, message: e.message });
                    return;
                }
            } catch (e) {
                res.status(400).json({ status: false, message: e.message });
                return;
            }
        }
        else {
            res.status(400).json({ status: false, message: 'Not Logged In Yet!' });
            return;
        }
    }
    deleteQuestion = async (req: Request, res: Response) => {
        if (req.personInfo) {
            try {
                /* Validation */
                const questionId = parseInt(req.params.id);
                if (!(await this.checkHost(questionId, (req.personInfo.userId || 0)) || await this.checkQuestionOwner(questionId, req.personInfo.guestId))) throw new Error('You are not allowed to delete the question!');
                /* Action */
                try {
                    const meetingId = await this.questionService.getRoomIdByQuestionId(questionId);
                    await this.questionService.deleteQuestion(questionId);
                    this.io.in(`event:${meetingId}`).emit('delete-question', { meetingId: meetingId, questionId });
                    res.status(200).json({ status: true, message: { meetingId: meetingId, questionId } });
                    return;
                } catch (e) {
                    console.error(e);
                    res.status(500).json({ status: false, message: e.message });
                    return;
                }
            } catch (e) {
                res.status(400).json({ status: false, message: e.message });
                return;
            }
        }
        else {
            res.status(400).json({ status: false, message: 'Not Logged In Yet!' });
            return;
        }
    }
    addVote = async (req: Request, res: Response) => {
        if (req.personInfo) {
            try {
                /* Validation */
                const questionId = parseInt(req.params.id);
                /* Action */
                try {
                    await this.questionService.addVote(questionId, req.personInfo.guestId);
                    const meetingId = await this.questionService.getRoomIdByQuestionId(questionId);
                    this.io.in(`event:${meetingId}`).emit('add-vote', { guestId: req.personInfo.guestId, questionId });
                    res.status(200).json({ status: true, message: { guestId: req.personInfo.guestId, questionId } });
                    return;
                } catch (e) {
                    console.error(e);
                    res.status(500).json({ status: false, message: e.message });
                    return;
                }
            } catch (e) {
                res.status(400).json({ status: false, message: e.message });
                return;
            }
        }
        else {
            res.status(400).json({ status: false, message: 'Not Logged In Yet!' });
            return;
        }
    }
    removeVote = async (req: Request, res: Response) => {
        if (req.personInfo) {
            try {
                /* Validation */
                const questionId = parseInt(req.params.id);
                /* Action */
                try {
                    await this.questionService.removeVote(questionId, req.personInfo.guestId);
                    const meetingId = await this.questionService.getRoomIdByQuestionId(questionId);
                    this.io.in(`event:${meetingId}`).emit('remove-vote', { guestId: req.personInfo.guestId, questionId });
                    res.status(200).json({ status: true, message: { guestId: req.personInfo.guestId, questionId } });
                    return;
                } catch (e) {
                    console.error(e);
                    res.status(500).json({ status: false, message: e.message });
                    return;
                }
            } catch (e) {
                res.status(400).json({ status: false, message: e.message });
                return;
            }
        }
        else {
            res.status(400).json({ status: false, message: 'Not Logged In Yet!' });
            return;
        }
    }
    answeredQuestion = async (req: Request, res: Response) => {
        if (req.personInfo) {
            try {
                /* Validation */
                const questionId = parseInt(req.params.id);
                if (!(await this.checkHost(questionId, (req.personInfo.userId || 0)))) throw new Error('You are not allowed to answer the question!')
                /* Action */
                try {
                    await this.questionService.answeredQuestion(questionId);
                    const meetingId = await this.questionService.getRoomIdByQuestionId(questionId);
                    this.io.in(`event:${meetingId}`).emit('answered-question', { questionId });
                    res.status(200).json({ status: true, message: { questionId } });
                    return;
                } catch (e) {
                    console.error(e);
                    res.status(500).json({ status: false, message: e.message });
                    return;
                }
            } catch (e) {
                res.status(400).json({ status: false, message: e.message });
                return;
            }
        }
        else {
            res.status(400).json({ status: false, message: 'Not Logged In Yet!' });
            return;
        }
    }
    hideOrApprovedQuestion = async (req: Request, res: Response) => {
        if (req.personInfo) {
            try {
                /* Validation */
                const { isHide } = req.body;
                if (!(typeof isHide === 'boolean')) throw new Error('isHide should be a boolean!')
                const questionId = parseInt(req.params.id);
                if (!(await this.checkHost(questionId, (req.personInfo.userId || 0)))) throw new Error('You are not allowed to hide/approve the question!')
                /* Action */
                try {
                    await this.questionService.hideOrApprovedQuestion(questionId, isHide);
                    const meetingId = await this.questionService.getRoomIdByQuestionId(questionId);
                    this.io.in(`event:${meetingId}`).emit('hideOrApproved-question', { questionId, isHide });
                    res.status(200).json({ status: true, message: { questionId, isHide } });
                    return;
                } catch (e) {
                    console.error(e);
                    res.status(500).json({ status: false, message: e.message });
                    return;
                }
            } catch (e) {
                res.status(400).json({ status: false, message: e.message });
                return;
            }
        }
        else {
            res.status(400).json({ status: false, message: 'Not Logged In Yet!' });
            return;
        }
    }
    updateReply = async (req: Request, res: Response) => {
        if (req.personInfo) {
            try {
                /* Validation */
                const { content } = req.body;
                if (content.trim().length === 0) throw new Error('Reply cannot be empty!');
                const replyId = parseInt(req.params.id);
                const questionId = await this.questionService.getQuestionIdByReplyId(replyId);
                if (!(await this.checkHost(questionId, (req.personInfo.userId || 0)) || await this.checkReplyOwner(replyId, req.personInfo.guestId))) throw new Error('You are not allowed to update this reply!');
                /* Action */
                try {
                    await this.questionService.updateReply(replyId, content);
                    const data = { questionId, replyId, content, updatedAt: new Date(Date.now()) };
                    const meetingId = await this.questionService.getRoomIdByReplyId(replyId);
                    this.io.in(`event:${meetingId}`).emit('update-reply', data);
                    res.status(200).json({ status: true, message: data });
                    return;
                } catch (e) {
                    console.error(e);
                    res.status(500).json({ status: false, message: e.message });
                    return;
                }
            } catch (e) {
                res.status(400).json({ status: false, message: e.message });
                return;
            }
        }
        else {
            res.status(400).json({ status: false, message: 'Not Logged In Yet!' });
            return;
        }
    }
    createReply = async (req: Request, res: Response) => {
        if (req.personInfo) {
            try {
                /* Validation */
                const { content } = req.body;
                if (content.trim().length === 0) throw new Error('Reply cannot be empty!');
                const questionId = parseInt(req.params.id);
                /* Action */
                try {
                    const reply = await this.questionService.createReply(questionId, content, req.personInfo.guestId);
                    const meetingId = await this.questionService.getRoomIdByQuestionId(questionId);
                    this.io.in(`event:${meetingId}`).emit('create-reply', reply);
                    res.status(200).json({ status: true, message: reply });
                    return;
                } catch (e) {
                    console.error(e);
                    res.status(500).json({ status: false, message: e.message });
                    return;
                }
            } catch (e) {
                res.status(400).json({ status: false, message: e.message });
                return;
            }
        }
        else {
            res.status(400).json({ status: false, message: 'Not Logged In Yet!' });
            return;
        }
    }
    deleteReply = async (req: Request, res: Response) => {
        if (req.personInfo) {
            try {
                /* Validation */
                const replyId = parseInt(req.params.id);
                const questionId = await this.questionService.getQuestionIdByReplyId(replyId);
                if (!(await this.checkHost(questionId, (req.personInfo.userId || 0)) || await this.checkReplyOwner(replyId, req.personInfo.guestId))) throw new Error('You are not allowed to delete this reply!');
                /* Action */
                try {
                    const meetingId = await this.questionService.getRoomIdByReplyId(replyId);
                    await this.questionService.deleteReply(replyId);
                    this.io.in(`event:${meetingId}`).emit('delete-reply', { questionId, replyId });
                    res.status(200).json({ status: true, message: { questionId, replyId } });
                    return;
                } catch (e) {
                    console.error(e);
                    res.status(500).json({ status: false, message: e.message });
                    return;
                }
            } catch (e) {
                res.status(400).json({ status: false, message: e.message });
                return;
            }
        }
        else {
            res.status(400).json({ status: false, message: 'Not Logged In Yet!' });
            return;
        }
    }
    hideOrNotHideReply = async (req: Request, res: Response) => {
        if (req.personInfo) {
            try {
                /* Validation */
                const { isHide } = req.body;
                const replyId = parseInt(req.params.id);
                const questionId = await this.questionService.getQuestionIdByReplyId(replyId);
                if (!(await this.checkHost(questionId, (req.personInfo.userId || 0)))) throw new Error('You are not allowed to hide/display this reply!');
                /* Action */
                try {
                    await this.questionService.hideReply(replyId, isHide);
                    const meetingId = await this.questionService.getRoomIdByReplyId(replyId);
                    this.io.in(`event:${meetingId}`).emit('hideOrNotHide-reply', { replyId, questionId, isHide });
                    res.status(200).json({ status: true, message: { replyId, questionId, isHide } });
                    return;
                } catch (e) {
                    console.error(e);
                    res.status(500).json({ status: false, message: e.message });
                    return;
                }
            } catch (e) {
                res.status(400).json({ status: false, message: e.message });
                return;
            }
        }
        else {
            res.status(400).json({ status: false, message: 'Not Logged In Yet!' });
            return;
        }
    }
    async checkQuestionOwner(questionId: number, guestId: number) {
        const ownerId = await this.questionService.getQuestionOwner(questionId);
        return guestId === ownerId;
    }
    async checkReplyOwner(replyId: number, guestId: number) {
        const ownerId = await this.questionService.getReplyOwner(replyId);
        return guestId === ownerId;
    }
    async checkHost(questionId: number, userId: number) {
        const ownerId = await this.questionService.getRoomHost(questionId);
        return userId === ownerId;
    }
    async checkHostByMeetingId(meetingId: number, userId: number) {
        const ownerId = await this.questionService.getRoomHostByMeetingId(meetingId);
        return userId === ownerId;
    }


}