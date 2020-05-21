import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const authenticateUserToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(401).json({success:false, message: 'No Token'})
    const decoded = jwt.decode(token)
    if (decoded?.hasOwnProperty('userId')){
        jwt.verify(token, process.env.USER_ACCESS_TOKEN_SECRET as string, (err, info)=>{
            if(err) return res.status(403).json({success:false, message:"Invalid Token"})
            req.personInfo = info
            next()
            return
        })
    }
    return res.status(401).json({success:false, message:"Unauthorized"})
}

export const authenticateGuestToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(401).json({success:false, message: 'No Token'})
    const decoded = jwt.decode(token)
    if (decoded?.hasOwnProperty('guestId')){
        jwt.verify(token, process.env.GUEST_ACCESS_TOKEN_SECRET as string, (err, info)=>{
            if(err) return res.status(403).json({success:false, message:"Invalid Token"})
            req.personInfo = info
            next()
            return
        })
    }
    return res.status(401).json({success:false, message:"Unauthorized"})
}