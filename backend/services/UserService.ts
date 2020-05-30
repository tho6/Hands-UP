import Knex from "knex";
import { UserForm } from "../models/UserInterface";


export class UserService {
    constructor(private knex: Knex) { }

    //create user
    createUser = async (name: string, email: string, googleId: string, picture:string):Promise<number> => {
        try {
            const result = await this.knex('users').insert({
                name,
                email,
                picture,
                google_id: googleId
            }).returning('id')
            // console.log(result[0])
            return result[0]
            
        } catch (error) {
            console.log('[User Service Error] ' + 'createUser')
            console.log(error)
            throw(new Error('Database Error'))
        }
        
    }
    //get users

    getAllUsers = async ():Promise<UserForm[]> => {
        try {
            const result = await this.knex.raw(
                /*SQL*/`SELECT id, name, email, google_id as "googleId", picture FROM users `)
            
            return result.rows
            
        } catch (error) {
            console.log('[User Service Error] ' + 'createUser')
            console.log(error)
            throw(new Error('Database Error'))
        }
    }

    getUserById = async (ids: number[]):Promise<UserForm[]> => {
        try {
            if (ids.length === 0) throw new RangeError("ID array is empty")
            if (ids.some(id => id < 1)) throw new RangeError("ID array contain value smaller than 1");
            
            const result = await this.knex.raw(
                /*sql*/ `SELECT id, name, email, google_id as "googleId", picture
                        FROM users 
                        WHERE id = ANY(?)`, [ids])
            // console.log(result.rows)
            return result.rows

        } catch (error) {
            console.log('[User Service Error] ' + 'getUserById')
            throw error
        }
    }
    getUserByName = async (names: string[]):Promise<UserForm[]> => {
        try {
            if (names.length === 0) throw new RangeError("Name array is empty")
            
            const result = await this.knex.raw(
                /*sql*/ `SELECT id, name, email, google_id as "googleId", picture
                        FROM users 
                        WHERE name = ANY(?)`, [names])
            // console.log(result.rows)
            return result.rows

        } catch (error) {
            console.log('[User Service Error] ' + 'getUserByName')
            throw error
        }
    }
    getUserByEmail = async (emails: string[]):Promise<UserForm[]> => {
        try {
            if (emails.length === 0) throw new RangeError("Email array is empty")
            
            const result = await this.knex.raw(
                /*sql*/ `SELECT id, name, email, google_id as "googleId", picture
                        FROM users 
                        WHERE email = ANY(?)`, [emails])
            // console.log(result.rows)
            return result.rows

        } catch (error) {
            console.log('[User Service Error] ' + 'getUserByEmail')
            throw error
        }
    }

    getUserByGoogleId = async (ids: string[]):Promise<UserForm[]> => {
        console.log(ids)
        try {
            if (ids.length === 0) throw new RangeError("GoogleId array is empty")
            
            const result = await this.knex.raw(
                /*sql*/ `SELECT id, name, email, google_id as "googleId", picture
                        FROM users 
                        WHERE google_id = ANY(?)`, [ids])
            // console.log(result.rows)
            return result.rows

        } catch (error) {
            console.log('[User Service Error] ' + 'getUserByGoogleId')
            throw error
        }
    }
    //delete user
    deleteUserById = async (ids: number[]):Promise<number> => {
        try {
            if (ids.length === 0) throw new RangeError("ID array is empty")
            if (ids.some(id => id < 1)) throw new RangeError("ID array contain value smaller than 1");
            
            const deletedRows = await this.knex.raw(/*sql*/ `WITH deleted as (DELETE FROM users 
                                                        WHERE id = ANY(?) RETURNING *) 
                                                        SELECT count(*) FROM deleted;`, [ids])
            // console.log(result.rows)
            return parseInt(deletedRows.rows[0].count)

        } catch (error) {
            console.log('[User Service Error] ' + 'deleteUserById')
            throw error
        }
    }

    // deleteUserByEmail = async (emails: string[]) => {
    //     try {
    //         if (emails.length === 0) throw new Error("Email array is empty")
            
    //         const deletedRows = await this.knex.raw(/*sql*/ `WITH deleted as (DELETE FROM users 
    //                             WHERE email = ANY(?) RETURNING *) 
    //                             SELECT count(*) FROM deleted;`, [emails])
    //         // console.log(result.rows)
    //         return parseInt(deletedRows.rows[0].count)

    //     } catch (error) {
    //         console.log('[User Service Error] ' + 'deleteUserByEmail')
    //         throw error
    //     }
    // }

    //update user
    updateUserById = async (updateForms: UserForm[]):Promise<number> => {
        if (updateForms.length === 0) throw new RangeError("Update array is empty")
        const trx = await this.knex.transaction();
        let updated = 0
        try {
            for (const updateForm of updateForms){
                let updatedRows
                if(updateForm.googleId){
                    updatedRows = await this.knex.raw(/*SQL*/`WITH updated as (UPDATE users SET
                                    name = ?,
                                    email = ?,
                                    google_id = ?,
                                    picture = ?
                                    WHERE id = ? RETURNING *)
                                    SELECT count(*) FROM updated`,
                                    [updateForm.name, updateForm.email, updateForm.googleId, updateForm.picture, updateForm.id])
                }else{
                    updatedRows = await this.knex.raw(/*SQL*/`WITH updated as (UPDATE users SET
                        name = ?,
                        email = ?,
                        picture = ?
                        WHERE id = ? RETURNING *)
                        SELECT count(*) FROM updated`,
                        [updateForm.name, updateForm.email,updateForm.picture, updateForm.id])
                }
                updated += parseInt(updatedRows.rows[0].count)
            }
            await trx.commit();

            return updated
            
        } catch (error) {
            await trx.rollback()
            console.log('[User Service Error] ' + 'updateUserById')
            throw error
        }
    }
    
    getYoutubeRefreshTokenByUserId = async(id:number):Promise<string|null>=>{
        const sql = `SELECT youtube_refresh_token as "youtubeRefreshToken" from users where id = ?`
        const result =  await this.knex.raw(sql, [id]);
        if(result.rowCount !== 1) throw new Error('Cannot find user, invalid user id!');
        return result.rows[0].youtubeRefreshToken;
    }
    saveYoutubeRefreshTokenByUserId = async(userId:number, refreshToken:string):Promise<boolean>=>{
        const sql = `UPDATE users SET youtube_refresh_token = ? where id = ?`
        const result =  await this.knex.raw(sql, [refreshToken, userId]);
        if(result.rowCount !== 1) throw new Error('Fail to save youtube refresh token!');
        return true;
    }

}