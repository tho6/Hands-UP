import Knex from "knex"

export class AuthService {
    constructor(private knex: Knex) { }
    saveRefreshTokenAccessToken = async (refreshToken: string, accessToken: string) => {
        try {
            if (!refreshToken || !accessToken) throw new RangeError('refreshToken is Empty')
            const result = await this.knex('tokens').insert(
                {
                    refresh_token: refreshToken,
                    access_token: accessToken
                }
            ).returning('id')
            return result[0]
        } catch (error) {
            console.log('[Auth Service Error] ' + 'saveRefreshToken')
            if (error.name == 'RangeError'){
                throw error
            } else {
                throw (new Error('Database Error'))
            }
        }
    }

    deleteRefreshToken = async (refreshToken: string) => {
        try {
            if (!refreshToken) throw new RangeError('refreshToken is Empty')
            const deletedRows = await this.knex.raw(/*sql*/ `WITH deleted as (DELETE FROM tokens 
                WHERE refresh_token = (?) RETURNING *) 
                SELECT count(*) FROM deleted;`, [refreshToken])
            return parseInt(deletedRows.rows[0].count)
        } catch (error) {
            console.log('[Auth Service Error] ' + 'deleteRefreshToken')
            console.log(error)
            if (error.name == 'RangeError'){
                throw error
            } else {
                throw (new Error('Database Error'))
            }
        }
    }

    getRefreshToken = async (refreshToken: string) => {
        try {
            if (!refreshToken) throw new RangeError('refreshToken is Empty')
            const result = await this.knex.raw(
                /*sql*/ `SELECT id
                        FROM tokens 
                        WHERE refresh_token = (?)`, [refreshToken])
            if (result.rows.length > 0) {
                return result.rows[0].id
            } else {
                return false
            }
        } catch (error) {
            console.log('[Auth Service Error] ' + 'getRefreshToken')
            console.log(error)
            if (error.name == 'RangeError'){
                throw error
            } else {
                throw (new Error('Database Error'))
            }
        }
    }

    getAccessTokenByRefreshToken = async (refreshToken: string) => {
        try {
            if (!refreshToken) throw new RangeError('refreshToken is Empty')
            const result = await this.knex.raw(
                /*sql*/ `SELECT access_token
                        FROM tokens 
                        WHERE refresh_token = (?)`, [refreshToken])
            if (result.rows.length > 0) {
                return result.rows[0].access_token
            } else {
                return false
            }
        } catch (error) {
            console.log('[Auth Service Error] ' + 'getRefreshToken')
            console.log(error)
            if (error.name == 'RangeError'){
                throw error
            } else {
                throw (new Error('Database Error'))
            }
        }
    }

    updateAccessToken = async (refreshToken: string, accessToken: string) => {
        try {
            if (!accessToken || !refreshToken) throw new RangeError('accessToken/refreshToken is Empty')
            const result = await this.knex.raw(
                /*sql*/ `WITH updated as (UPDATE tokens
                        SET access_token = ? 
                        WHERE refresh_token = (?) RETURNING *)
                        SELECT count(*) from updated`, [accessToken, refreshToken])
            return parseInt(result.rows[0].count)

        } catch (error) {
            console.log('[Auth Service Error] ' + 'updateAccessToken')
            console.log(error)
            if (error.name == 'RangeError'){
                throw error
            } else {
                throw (new Error('Database Error'))
            }
        }
    }

}