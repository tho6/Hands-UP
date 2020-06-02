import { AuthService } from "./AuthService"
import Knex from "knex";
import { seed } from '../seeds/create-refresh-token'

const knexConfig = require('../knexfile');
const knex = Knex(knexConfig[process.env.TESTING_ENV||'cicd']);
// const knex = Knex(knexConfig[process.env.TESTING_ENV || "testing"]);

describe('auth service testing', ()=>{
    let authService: AuthService
    beforeEach(async ()=>{
        await seed(knex)
        authService = new AuthService(knex)
    })
    afterAll(async()=>{
        await knex.destroy()
    })

    it('save refreshToken - normal', async ()=>{
        const token = 'test'
        const aToken = 'test2'
        const id = await authService.saveRefreshTokenAccessToken(token, aToken)
        expect(id).toEqual(4)
    })

    it('save refreshToken - empty token', async ()=>{
        const token = ''
        const aToken = 'test2'
        await expect(authService.saveRefreshTokenAccessToken(token, aToken)).rejects.toThrow('refreshToken is Empty')
    })

    it('delete refresh token - normal', async () => {
        const token = 'token1'
        const num = await authService.deleteRefreshToken(token)
        expect(num).toEqual(1)
    })

    it('delete refresh token - empty token', async () => {
        const token = ''
        const aToken = 'test2'
        await expect(authService.saveRefreshTokenAccessToken(token, aToken)).rejects.toThrow('refreshToken is Empty')
    })

    it('get refresh token - normal', async () => {
        const token = 'token2'
        const result = await authService.getRefreshToken(token)
        expect(result).toEqual(2)
    })

    it('get refresh token - empty token', async () => {
        const token = ''
        const aToken = 'test2'
        await expect(authService.saveRefreshTokenAccessToken(token, aToken)).rejects.toThrow('refreshToken is Empty')
    })

    it('get refresh token - not found', async () => {
        const token = 'token100'
        const result = await authService.getRefreshToken(token)
        expect(result).toBeFalsy()
    })

    it('get access Token', async () => {
        const token = 'token1'
        const result = await authService.getAccessTokenByRefreshToken(token)
        const expectResult = 'atoken1'
        expect(result).toEqual(expectResult)

    })

    it('update access Token - no refresh Token', async () => {
        const token = 'token1'
        await expect(authService.updateAccessToken(token, '')).rejects.toThrow('accessToken/refreshToken is Empty')
    })

    it('update access Token', async () => {
        const token = 'test1'
        const refreshToken = 'token1'
        const result = await authService.updateAccessToken(refreshToken, token)
        const getAccessToken = await authService.getAccessTokenByRefreshToken(refreshToken)
        expect(result).toEqual(1)
        expect(getAccessToken).toEqual(token)
    })

})