import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { TokenInfo } from './models/AuthInterface'
import { UserService } from './services/UserService'
import { GuestService } from './services/GuestService'

export const authenticateUserToken = (userService: UserService, guestService: GuestService) => {
    (req: Request, res: Response, next: NextFunction) => {
        const accessTokenPublicKey = JSON.parse(`"${process.env.ACCESS_TOKEN_PUBLIC_KEY}"`)
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (!token) return res.status(401).json({ success: false, message: 'No Token' })
        jwt.verify(token, accessTokenPublicKey, { algorithms: ["RS256"] }, async (err, info: TokenInfo) => {
            if (!info.userId ||
                !info.guestId ||
                !info ||
                err) {
                return res.status(401).json({ success: false, message: "Invalid Token" })
            }
            const userResult = await userService.getUserById([info.userId])
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
        })
        return
    }
}

export const authenticateGuestToken = (guestService: GuestService) => {
    (req: Request, res: Response, next: NextFunction) => {
        const accessTokenPublicKey = JSON.parse(`"${process.env.ACCESS_TOKEN_PUBLIC_KEY}"`)
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (!token) return res.status(401).json({ success: false, message: 'No Token' })
        jwt.verify(token, accessTokenPublicKey, { algorithms: ["RS256"] }, async (err, info: TokenInfo) => {
            if (!info.guestId || !info || err) {
                return res.status(401).json({ success: false, message: "Invalid Token" })
            }
            const guestResult = await guestService.getGuestById([info.guestId])
            if (!guestResult) return res.status(401).json({ success: false, message: "Unauthorized" })
            req.personInfo = {
                guestName: guestResult[0].name,
                guestId: info.guestId
            }
            next()
            return
        })
        return

    }
}
