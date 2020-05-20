import Knex from "knex"

export class AuthService {
    constructor(private knex: Knex) { }
    saveRefreshToken = async (refreshToken: string) => {
        try {
            if (!refreshToken) throw new RangeError('refreshToken is Empty')
            const result = await this.knex('refresh_tokens').insert(
                {
                    token: refreshToken
                }
            ).returning('id')
            return result[0]
        } catch (error) {
            console.log('[Auth Service Error] ' + 'saveRefreshToken')
            console.log(error)
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
            const deletedRows = await this.knex.raw(/*sql*/ `WITH deleted as (DELETE FROM refresh_tokens 
                WHERE token = (?) RETURNING *) 
                SELECT count(*) FROM deleted;`, [refreshToken])
            // console.log(result.rows)
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
                        FROM refresh_tokens 
                        WHERE token = (?)`, [refreshToken])
            // console.log(result.rows)
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

}