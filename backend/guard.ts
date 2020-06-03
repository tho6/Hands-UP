import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { TokenInfo } from './models/AuthInterface'
import { UserService } from './services/UserService'
import { GuestService } from './services/GuestService'

export function authenticateUserToken(userService: UserService, guestService: GuestService) {
    return (req: Request, res: Response, next: NextFunction) => {
        // const accessTokenPublicKey = JSON.parse(`"${process.env.ACCESS_TOKEN_PUBLIC_KEY}"`)
        const accessTokenPublicKey = process.env.ACCESS_TOKEN_PUBLIC_KEY!.replace(/\\n/g,"\n")
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (!token) return res.status(401).json({ success: false, message: 'No Token' })
        jwt.verify(token, accessTokenPublicKey, { algorithms: ["RS256"] }, async (err, info: TokenInfo) => {
            try {
                if (!info.hasOwnProperty('userId') ||
                    !info.guestId ||
                    !info ||
                    err) {
                    return res.status(401).json({ success: false, message: "Invalid Token" })
                }
                const userResult = await userService.getUserById([info.userId!])
                const guestResult = await guestService.getGuestById([info.guestId])
                if (!userResult || !guestResult) return res.status(401).json({ success: false, message: "Unauthorized" })
                req.personInfo = {
                    userName: userResult[0].name,
                    guestName: guestResult[0].name,
                    email: userResult[0].email,
                    userId: userResult[0].id,
                    guestId: info.guestId,
                    picture: userResult[0].picture
                }
                next()
                return
            } catch (error) {
                console.log(error)
                return res.status(401).json({ success: false, message: "Unauthorized" })
            }
        })
        return
    }
}

export function authenticateToken(guestService: GuestService, userService: UserService) {
    return (req: Request, res: Response, next: NextFunction) => {
        // console.log(process.env.ACCESS_TOKEN_PUBLIC_KEY?.replace(/\\n/g,"\n"))
        // const accessTokenPublicKey = JSON.parse(`"${process.env.ACCESS_TOKEN_PUBLIC_KEY}"`)
        const accessTokenPublicKey = process.env.ACCESS_TOKEN_PUBLIC_KEY!.replace(/\\n/g,"\n")
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (!token) return res.status(401).json({ success: false, message: 'No Token' })
        jwt.verify(token, accessTokenPublicKey, { algorithms: ["RS256"] }, async (err, info: TokenInfo) => {
            try {
                if (info?.guestId == undefined || info?.guestId == null || !info || err) {
                    return res.status(401).json({ success: false, message: "Invalid Token" })
                }
                const guestResult = await guestService.getGuestById([info?.guestId])
                if (!guestResult) return res.status(401).json({ success: false, message: "Unauthorized" })
                req.personInfo = {
                    guestName: guestResult[0].name,
                    guestId: info.guestId
                }
                if(info?.userId){
                    const userResult = await userService.getUserById([info.userId!])
                    if (!userResult) return res.status(401).json({ success: false, message: "Unauthorized" })
                    const temp = {...req.personInfo, userId:info.userId,  userName: userResult[0].name, email: userResult[0].email, picture: userResult[0].picture}
                    req.personInfo = temp;
                }
                return next()
            } catch (error) {
                console.log(error)
                return res.status(401).json({ success: false, message: "Unauthorized" })
            }
        })
        return
    }
}
export function checkThirdPartyPlatformToken(userService:UserService, platform:string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        if(req.personInfo?.userId){
            try{
                switch(platform){
                    case 'facebook':
                        const fbToken = await userService.getFacebookTokenByUserId(req.personInfo.userId);
                        if(!fbToken) return res.status(401).json({status:false, message:'No token found in DB, redirecting to login page'})
                        req.facebookToken = fbToken;
                        break;
                    case 'youtube':
                       const refreshToken = await userService.getYoutubeRefreshTokenByUserId(req.personInfo.userId);
                       if(!refreshToken) return res.status(401).json({status:false, message:'No refresh token found in DB, redirecting to login page'})
                       req.youtubeRefreshToken = refreshToken;
                        break;
                }
                next();
                return;
            }catch(e){
                console.error(e);
                res.status(500).json({status:false, message:e})
                return
            }
        }else{
            res.status(401).json({status:false, message: 'You have not logged in yet', platform:true});
            return
        }
    }
}

