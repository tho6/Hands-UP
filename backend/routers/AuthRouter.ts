 
import express, { Request, Response } from 'express'
import { UserService } from "../services/UserService";
import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'
import { GoogleUser, PersonInfo } from '../models/AuthInterface';
import { GuestService } from '../services/GuestService';
import { AuthService } from '../services/AuthService';

export class AuthRouter {
    constructor(private userService: UserService, private guestService: GuestService, private authService: AuthService) { }

    router() {
        const router = express.Router()
        router.post('/loginGoogle', this.loginGoogle)
        router.post('/loginGuest', this.loginGuest)
        router.post('/token', this.genAccessCodeByRefreshCode)
        return router
    }
    private generateAccessToken = (role: string, Id: number) => {
        if (role === 'user') {
            return jwt.sign({ userId: Id }, process.env.USER_ACCESS_TOKEN_SECRET as string, { expiresIn: '15s' })
        } else if (role === 'guest') {
            return jwt.sign({ guestId: Id }, process.env.GUEST_ACCESS_TOKEN_SECRET as string, { expiresIn: '15s' })
        }
        return null
    }
    private generateRefreshToken = (role: string, Id: number) => {
        if (role === 'user') {
            return jwt.sign({ userId: Id }, process.env.USER_REFRESH_TOKEN_SECRET as string, { expiresIn: '30d' })
        } else if (role === 'guest') {
            return jwt.sign({ guestId: Id }, process.env.GUEST_REFRESH_TOKEN_SECRET as string, { expiresIn: '30d' })
        }
        return null
    }
    private loginGoogle = async (req: Request, res: Response) => {
        try {
            if (!req.body.authCode) return res.status(401).json({ success: false, message: 'No authorization Code' })
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

            const userAccessToken = this.generateAccessToken('user', userId)
            const userRefreshToken = this.generateRefreshToken('user', userId)
            const storedToken = this.authService.getRefreshToken(userRefreshToken!)
            if (!storedToken){
                await this.authService.saveRefreshToken(userRefreshToken!)
            }
            
            return res.status(200).json({ success: true, message: { accessToken: userAccessToken , refreshToken: userRefreshToken} })

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
            const guestAccessToken = this.generateAccessToken('guest', guestId)
            return res.status(200).json({ success: true, message: { accessToken: guestAccessToken } })

        } catch (error) {
            console.log(error)
            return error.name == 'RangeError' ?
                res.status(400).json({ success: false, message: error.message }) :
                res.status(500).json({ success: false, message: 'internal error' })
        }
    }

    private genAccessCodeByRefreshCode = async (req: Request, res: Response) => {
        try {
            if (!req.body.token) return res.status(401).json({ success: false, message: 'No Token' })
            const token = req.body.token
            if (!token) return res.status(401).json({success:false, message: 'No Token'})
            const id = await this.authService.getRefreshToken(token)
            if (!id) return res.status(403).json({success:false, message:"Invalid Token"})
            const decoded = jwt.decode(token)
            if (decoded?.hasOwnProperty('guestId')){
                jwt.verify(token, process.env.GUEST_ACCESS_TOKEN_SECRET as string, (err: jwt.JsonWebTokenError | jwt.NotBeforeError | jwt.TokenExpiredError | null, info: PersonInfo | undefined)=>{
                    if(err) return res.status(403).json({success:false, message:"Invalid Token"})
                    const accessToken = this.generateAccessToken('guest',info?.guestId!)
                    return res.status(200).json({success:true, message: {accessToken: accessToken}})
                })
            } else if (decoded?.hasOwnProperty('userId')){
                jwt.verify(token, process.env.USER_ACCESS_TOKEN_SECRET as string, (err: jwt.JsonWebTokenError | jwt.NotBeforeError | jwt.TokenExpiredError | null, info: PersonInfo | undefined)=>{
                    if(err) return res.status(403).json({success:false, message:"Invalid Token"})
                    const accessToken = this.generateAccessToken('user',info?.userId!)
                    return res.status(200).json({success:true, message: {accessToken: accessToken}})
                })
            }
            return res.status(401).json({success:false, message: 'Failed'})
        } catch (error) {
            console.log(error)
            return error.name == 'RangeError' ?
                res.status(400).json({ success: false, message: error.message }) :
                res.status(500).json({ success: false, message: 'internal error' })
        }
    }

    //logout destroy RefreshToken
}


