import { NextFunction, Request, Response } from 'express';
import { IQuestionService } from './models/Interface/IQuestionService';
import { redisClient } from "./redisClient"

export function rateLimiter(questionService: IQuestionService) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { guestId } = req.personInfo!;
        const { id } = req.params
        const questionLimit = await questionService.getRoomQuestionLimitByMeetingId(parseInt(id));
        redisClient.incr(`${guestId}`, (err, value) => {
            if (value === 1) redisClient.expire(`${guestId}`, 10);
            if (value > questionLimit) return res.status(429).json({ status: false, message: "Too many request!" });
            return next();
        })
    }
}