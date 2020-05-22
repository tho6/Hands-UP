
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
        this.accessTokenPublicKey = JSON.parse(`"${process.env.ACCESS_TOKEN_PUBLIC_KEY}"`)
        this.accessTokenPrivateKey = JSON.parse(`"${process.env.ACCESS_TOKEN_PRIVATE_KEY}"`)
        this.refreshTokenPublicKey = JSON.parse(`"${process.env.REFRESH_TOKEN_PUBLIC_KEY}"`)
        this.refreshTokenPrivateKey = JSON.parse(`"${process.env.REFRESH_TOKEN_PRIVATE_KEY}"`)
     }
     
    router() {
        const router = express.Router()
        router.post('/loginGoogle', this.loginGoogle)
        router.post('/loginGuest', this.loginGuest)
        router.post('/token', this.genAccessCodeByRefreshCode)
        router.delete('/logout', this.logoutUser)
        return router
    }
    private generateAccessToken = (payload: TokenInfo) => {
        return jwt.sign(payload, this.accessTokenPrivateKey, { expiresIn: '15s', algorithm: 'RS256' })
    }
    private generateRefreshToken = (payload: TokenInfo) => {
        return jwt.sign(payload, this.refreshTokenPrivateKey, { expiresIn: '30d', algorithm: 'RS256' })
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
                const authCode = req.body.authCode

                console.log(authCode)
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
                if (!result.id_token) return res.status(401).json({ success: false, message: 'Access code is not found' })

                const decodedResult: GoogleUser | string | null | { [key: string]: any; } = jwt.decode(result.id_token)
                if (!decodedResult) return res.status(401).json({ success: false, message: 'Access code is not found' })
                //***check email tecky???? */
                const user = (await this.userService.getUserByGoogleId([decodedResult.sub]))[0]

                // console.log(user[0])
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
            const accessToken = await this.authService.getAccessTokenByRefreshToken(refreshToken)
            if (!accessToken) return res.status(401).json({ success: false, message: "Invalid Refresh Token" })
            jwt.verify(accessToken, this.accessTokenPublicKey, { algorithms: ["RS256"] }, async (err, info) => {
                if (err?.name == 'TokenExpiredError') {
                    jwt.verify(refreshToken, this.refreshTokenPublicKey, { algorithms: ["RS256"] }, async (err, info: TokenInfo) => {
                        //TokenExpiredError
                        if (err) return res.status(401).json({ success: false, message: "Invalid Token" })
                        const accessToken = this.generateAccessToken(info.userId ? { userId: info.userId, guestId: info.guestId } : { guestId: info.guestId })
                        const updatedRows = await this.authService.updateAccessToken(refreshToken, accessToken)
                        if (updatedRows <= 0) return res.status(500).json({ success: false, message: "Failed to Generate New Access Token" })
                        return res.status(200).json({ success: true, message: { accessToken: accessToken } })
                    })
                    return;
                } else {
                    await this.authService.deleteRefreshToken(refreshToken)
                    return res.status(401).json({ success: false, message: "Potential Threat" })
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
            if (deletedRows > 0){
                return res.status(200).json({ success: true, message: "Logout Successful" })
            }else{
                return res.status(403).json({ success: false, message: "Logout Failed" })
            }
            
        } catch (error) {
            console.log(error)
            return error.name == 'RangeError' ?
                res.status(400).json({ success: false, message: error.message }) :
                res.status(500).json({ success: false, message: 'internal error' })
        }
    }
}



