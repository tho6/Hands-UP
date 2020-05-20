import { AuthService } from "./AuthService"
import Knex from "knex";
import { seed } from '../seeds/create-refresh-token'

const knexConfig = require('../knexfile');
const knex = Knex(knexConfig[process.env.TESTING_ENV || "testing"]);

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
        const id = await authService.saveRefreshToken(token)
        expect(id).toEqual(4)
    })

    it('save refreshToken - empty token', async ()=>{
        const token = ''
        await expect(authService.saveRefreshToken(token)).rejects.toThrow('refreshToken is Empty')
    })

    it('delete refresh token - normal', async () => {
        const token = 'token1'
        const num = await authService.deleteRefreshToken(token)
        expect(num).toEqual(1)
    })

    it('delete refresh token - empty token', async () => {
        const token = ''
        await expect(authService.saveRefreshToken(token)).rejects.toThrow('refreshToken is Empty')
    })

    it('get refresh token - normal', async () => {
        const token = 'token2'
        const result = await authService.getRefreshToken(token)
        expect(result).toEqual(2)
    })

    it('get refresh token - empty token', async () => {
        const token = ''
        await expect(authService.saveRefreshToken(token)).rejects.toThrow('refreshToken is Empty')
    })

    it('get refresh token - not found', async () => {
        const token = 'token100'
        const result = await authService.getRefreshToken(token)
        expect(result).toBeFalsy()
    })

})