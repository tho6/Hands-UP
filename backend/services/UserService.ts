import Knex from "knex";
import { UserForm } from "./models/UserInterface";

export class UserService {
    constructor(private knex: Knex) { }

    //create user
    createUser = async (name: string, email: string, googleId: string) => {
        const result = await this.knex('users').insert({
            name,
            email,
            google_id: googleId
        }).returning('id')
        // console.log(result[0])
        return result[0]
        
    }
    //get users

    getAllUsers = async () => {
        const result = await this.knex.raw(
            /*SQL*/`SELECT id, name, email, google_id as "googleId" FROM users `)
        
        return result.rows
    }

    getUserById = async (ids: number[]) => {
        try {
            if (ids.length === 0) throw new Error("ID array is empty")
            if (ids.some(id => id < 1)) throw new Error("ID array contain value smaller than 1");
            
            const result = await this.knex.raw(
                /*sql*/ `SELECT id, name, email, google_id as "googleId"
                        FROM users 
                        WHERE id = ANY(?)`, [ids])
            // console.log(result.rows)
            return result.rows

        } catch (error) {
            console.log('[User Service Error] ' + 'getUserById')
            throw error
        }
    }
    getUserByName = async (names: string[]) => {
        try {
            if (names.length === 0) throw new Error("Name array is empty")
            
            const result = await this.knex.raw(
                /*sql*/ `SELECT id, name, email, google_id as "googleId"
                        FROM users 
                        WHERE name = ANY(?)`, [names])
            // console.log(result.rows)
            return result.rows

        } catch (error) {
            console.log('[User Service Error] ' + 'getUserByName')
            throw error
        }
    }
    getUserByEmail = async (emails: string[]) => {
        try {
            if (emails.length === 0) throw new Error("Email array is empty")
            
            const result = await this.knex.raw(
                /*sql*/ `SELECT id, name, email, google_id as "googleId"
                        FROM users 
                        WHERE email = ANY(?)`, [emails])
            // console.log(result.rows)
            return result.rows

        } catch (error) {
            console.log('[User Service Error] ' + 'getUserByEmail')
            throw error
        }
    }

    getUserByGoogleId = async (ids: string[]) => {
        try {
            if (ids.length === 0) throw new Error("GoogleId array is empty")
            
            const result = await this.knex.raw(
                /*sql*/ `SELECT id, name, email, google_id as "googleId"
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
    deleteUserById = async (ids: number[]) => {
        try {
            if (ids.length === 0) throw new Error("ID array is empty")
            if (ids.some(id => id < 1)) throw new Error("ID array contain value smaller than 1");
            
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
    updateUserById = async (updateForms: UserForm[]) => {
        if (updateForms.length === 0) throw new Error("Update array is empty")
        const trx = await this.knex.transaction();
        let updated = 0
        try {
            for (const updateForm of updateForms){
                const updatedRows = await this.knex.raw(/*SQL*/`WITH updated as (UPDATE users SET
                                name = ?,
                                email = ?,
                                google_id = ?
                                WHERE id = ? RETURNING *)
                                SELECT count(*) FROM updated`,
                                [updateForm.name, updateForm.email, updateForm.googleId, updateForm.id])
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

}