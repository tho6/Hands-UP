import { NextFunction, Request, Response } from 'express';
import redis from 'redis';
import { IQuestionService } from './models/Interface/IQuestionService';
const client = redis.createClient();

export function rateLimiter(questionService:IQuestionService) {
    return async (req: Request, res: Response, next: NextFunction) => {
       const  {guestId} = req.personInfo!;
       const {id} = req.params
                const questionLimit = await questionService.getRoomQuestionLimitByMeetingId(parseInt(id));
                client.incr(`${guestId}`, (err, value)=>{
                    if(value === 1) client.expire(`${guestId}`, 10);
                    if(value>questionLimit) return res.status(429).json({status: false, message:"Too many request!"});
                    return next();
                })
    }
}