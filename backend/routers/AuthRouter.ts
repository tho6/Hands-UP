
import express, { Request, Response } from 'express'
import { UserService } from "../services/UserService";
import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'
import { GoogleUser, TokenInfo } from '../models/AuthInterface';
import { GuestService } from '../services/GuestService';
import { AuthService } from '../services/AuthService';

export class AuthRouter {
    private accessTokenPublicKey: string
    private accessTokenPrivateKey: string
    private refreshTokenPublicKey: string
    private refreshTokenPrivateKey: string
    constructor(private userService: UserService, private guestService: GuestService, private authService: AuthService) {
        // this.accessTokenPublicKey = JSON.parse(`"${process.env.ACCESS_TOKEN_PUBLIC_KEY}"`)
        // this.accessTokenPrivateKey = JSON.parse(`"${process.env.ACCESS_TOKEN_PRIVATE_KEY}"`)
        // this.refreshTokenPublicKey = JSON.parse(`"${process.env.REFRESH_TOKEN_PUBLIC_KEY}"`)
        // this.refreshTokenPrivateKey = JSON.parse(`"${process.env.REFRESH_TOKEN_PRIVATE_KEY}"`)
        this.accessTokenPublicKey = process.env.ACCESS_TOKEN_PUBLIC_KEY!.replace(/\\n/g,"\n")
        this.accessTokenPrivateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY!.replace(/\\n/g,"\n")
        this.refreshTokenPublicKey = process.env.REFRESH_TOKEN_PUBLIC_KEY!.replace(/\\n/g,"\n")
        this.refreshTokenPrivateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY!.replace(/\\n/g,"\n")

    }

    router() {
        const router = express.Router()
        router.post('/loginGoogle', this.loginGoogle)
        router.post('/loginGuest', this.loginGuest)
        router.post('/token', this.genAccessCodeByRefreshCode)
        router.delete('/logout', this.logoutUser)
        router.post('/current', this.currentPerson)
        return router
    }
    private generateAccessToken = (payload: TokenInfo) => {
        return jwt.sign(payload, this.accessTokenPrivateKey, { expiresIn: '3h', algorithm: 'RS256' })
    }
    private generateRefreshToken = (payload: TokenInfo) => {
        return jwt.sign(payload, this.refreshTokenPrivateKey, { expiresIn: '1y', algorithm: 'RS256' })
    }

    private loginGoogle = async (req: Request, res: Response) => {
        try {
            if (!req.body.authCode) return res.status(401).json({ success: false, message: 'No authorization Code' })
            const authHeader = req.headers['authorization']
            const accessToken = authHeader && authHeader.split(' ')[1]
            if (!accessToken) return res.status(401).json({ success: false, message: 'No Access Token' })
            jwt.verify(accessToken, this.accessTokenPublicKey, { algorithms: ['RS256'] }, async (err, info: TokenInfo) => {
                // if(!userId) return res.status(500).json({success:false, message:"Internal Server Error"})
                if (!info || err) return res.status(401).json({ success: false, message: "Invalid Token" })
                try {
                    const authCode = req.body.authCode
                    // console.log(authCode);
                    //take profile is ok since it includes sub (unique id) NO NEED OpenId
                    const fetchRes = await fetch('https://oauth2.googleapis.com/token', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            code: authCode,
                            client_id: process.env.GOOGLE_CLIENT_ID,
                            client_secret: process.env.GOOGLE_CLIENT_SECRET,
                            redirect_uri: process.env.GOOGLE_REDIRECT_URL,
                            grant_type: 'authorization_code'
                        })
                    }
                    )

                    const result = await fetchRes.json()
                    // console.log(result);
                    if (!result.id_token) return res.status(401).json({ success: false, message: 'Access code is not found' })

                    const decodedResult: GoogleUser | string | null | { [key: string]: any; } = jwt.decode(result.id_token)
                    if (!decodedResult) return res.status(401).json({ success: false, message: 'Access code is not found' })
                    const user = (await this.userService.getUserByGoogleId([decodedResult.sub]))[0]

                    let userId: number | null = user?.id
                    if (!user) {
                        console.log('create user')
                        userId = await this.userService.createUser(decodedResult['name'], decodedResult['email'], decodedResult['sub'], decodedResult['picture'])
                    }
                    const userAccessToken = this.generateAccessToken({ guestId: info.guestId, userId: userId })
                    const userRefreshToken = this.generateRefreshToken({ guestId: info.guestId, userId: userId })
                    const storedRefreshToken = await this.authService.saveRefreshTokenAccessToken(userRefreshToken, userAccessToken)
                    if (!storedRefreshToken) return res.status(500).json({ success: false, message: "Internal Server Error" })
                    return res.status(200).json({ success: true, message: { accessToken: userAccessToken, refreshToken: userRefreshToken } })
                } catch (error) {
                    console.log(error)
                    return error.name == 'RangeError' ?
                        res.status(400).json({ success: false, message: error.message }) :
                        res.status(500).json({ success: false, message: 'internal error' })
                }
            })
            return;

        } catch (error) {
            console.log(error)
            return error.name == 'RangeError' ?
                res.status(400).json({ success: false, message: error.message }) :
                res.status(500).json({ success: false, message: 'internal error' })
        }
    }

    private loginGuest = async (req: Request, res: Response) => {
        try {
            const guestId = await this.guestService.createGuest()
            const guestAccessToken = this.generateAccessToken({ guestId: guestId })
            const guestRefreshToken = this.generateRefreshToken({ guestId: guestId })
            const storedRefreshToken = await this.authService.saveRefreshTokenAccessToken(guestRefreshToken, guestAccessToken)
            if (!storedRefreshToken) return res.status(500).json({ success: false, message: "Internal Server Error" })
            return res.status(200).json({ success: true, message: { accessToken: guestAccessToken, refreshToken: guestRefreshToken } })

        } catch (error) {
            console.log(error)
            return error.name == 'RangeError' ?
                res.status(400).json({ success: false, message: error.message }) :
                res.status(500).json({ success: false, message: 'internal error' })
        }
    }

    private genAccessCodeByRefreshCode = async (req: Request, res: Response) => {
        try {
            if (!req.body.refreshToken) return res.status(401).json({ success: false, message: 'No Refresh Token' })
            const refreshToken = req.body.refreshToken
            // const accessToken = await this.authService.getAccessTokenByRefreshToken(refreshToken)
            // if (!accessToken) return res.status(401).json({ success: false, message: "Invalid Refresh Token" })
            // jwt.verify(accessToken, this.accessTokenPublicKey, { algorithms: ["RS256"] }, async (err, info: TokenInfo) => {
            //     const expiryTimeLeft = (info?.exp! * 1000 - new Date().getTime()) < (5 * 1000)
            //     if (err?.name == 'TokenExpiredError' || expiryTimeLeft) {
            //         jwt.verify(refreshToken, this.refreshTokenPublicKey, { algorithms: ["RS256"] }, async (err, info: TokenInfo) => {
            //             //TokenExpiredError
            //             if (err) return res.status(401).json({ success: false, message: "Invalid Token" })
            //             try {
            //                 const accessToken = this.generateAccessToken(info.userId ? { userId: info.userId, guestId: info.guestId } : { guestId: info.guestId })
            //                 const updatedRows = await this.authService.updateAccessToken(refreshToken, accessToken)
            //                 if (updatedRows <= 0) return res.status(500).json({ success: false, message: "Failed to Generate New Access Token" })
            //                 return res.status(200).json({ success: true, message: { accessToken: accessToken } })
            //             } catch (error) {
            //                 console.log(error)
            //                 return error.name == 'RangeError' ?
            //                     res.status(400).json({ success: false, message: error.message }) :
            //                     res.status(500).json({ success: false, message: 'internal error' })
            //             }
            //         })
            //         return;

            //     } else {
            //         await this.authService.deleteRefreshToken(refreshToken)
            //         return res.status(401).json({ success: false, message: "Potential Threat" })
            //     }

            // })
            jwt.verify(refreshToken, this.refreshTokenPublicKey, { algorithms: ["RS256"] },async (err, info: TokenInfo) => {
                //             //TokenExpiredError
                if (err) return res.status(401).json({success:false, message:"Invalid Refresh Token"})
                try {
                    const accessToken = this.generateAccessToken(info.userId ? { userId: info.userId, guestId: info.guestId } : { guestId: info.guestId })
                    const updatedRows = await this.authService.updateAccessToken(refreshToken, accessToken)
                    if (updatedRows <= 0) return res.status(500).json({ success: false, message: "Failed to Generate New Access Token" })
                    return res.status(200).json({ success: true, message: { accessToken: accessToken } })
                } catch (error) {
                    console.log(error)
                    return error.name == 'RangeError' ?
                        res.status(400).json({ success: false, message: error.message }) :
                        res.status(500).json({ success: false, message: 'internal error' })
                }
            })
            return;
        } catch (error) {
            console.log(error)
            return error.name == 'RangeError' ?
                res.status(400).json({ success: false, message: error.message }) :
                res.status(500).json({ success: false, message: 'internal error' })
        }
    }

    //logout destroy RefreshToken
    private logoutUser = async (req: Request, res: Response) => {
        try {
            if (!req.body.refreshToken) return res.status(401).json({ success: false, message: 'No Refresh Token' })
            const refreshToken = req.body.refreshToken
            const deletedRows = await this.authService.deleteRefreshToken(refreshToken)
            if (deletedRows > 0) {
                return res.status(200).json({ success: true, message: "Logout Successful" })
            } else {
                return res.status(403).json({ success: false, message: "Logout Failed" })
            }

        } catch (error) {
            console.log(error)
            return error.name == 'RangeError' ?
                res.status(400).json({ success: false, message: error.message }) :
                res.status(500).json({ success: false, message: 'internal error' })
        }
    }

    private currentPerson = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers['authorization']
            const accessToken = authHeader && authHeader.split(' ')[1]
            if (!accessToken) return res.status(401).json({ success: false, message: 'No Access Token' })
            jwt.verify(accessToken, this.accessTokenPublicKey, { algorithms: ['RS256'] }, async (err, info: TokenInfo) => {
                if (err) return res.status(403).json({ success: false, message: 'Permission Denied' })
                try {
                    if (info.hasOwnProperty('userId')) {
                        const result = (await this.userService.getUserById([info.userId!]))[0]
                        // console.log(info.guestId);
                        const guestResult = (await this.guestService.getGuestById([info.guestId!]))[0].name
                        // console.log(guestResult);
                        const { googleId, ...personInfo } = result
                        return res.status(200).json({ success: true, message: { personInfo: {...personInfo,name:guestResult, guestId: info.guestId}}})

                    } else {
                        const personInfo = (await this.guestService.getGuestById([info.guestId!]))[0]
                        return res.status(200).json({ success: true, message: { personInfo: personInfo } })
                    }
                } catch (error) {
                    console.log(error)
                    return error.name == 'RangeError' ?
                        res.status(400).json({ success: false, message: error.message }) :
                        res.status(500).json({ success: false, message: 'internal error' })
                }
            })
            return;
        } catch (error) {
            console.log(error)
            return res.status(403).json({ success: false, message: 'Permission Denied' })
        }
    }
}



