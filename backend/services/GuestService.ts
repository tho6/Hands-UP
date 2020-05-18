import Knex from "knex";
import { GuestForm } from "./models/GuestInterface";
import { hashGuestName } from "../hash";



export class GuestService {
    constructor(private knex: Knex) { }

    //create guests
    createGuest = async () => {
        const maxIdResult = await this.knex.raw(/*SQL*/`SELECT max(id) FROM guests`)
        const maxId = maxIdResult.rows[0].max
        // console.log(maxId)
        const name = await hashGuestName('guest'+maxId)
        const result = await this.knex('guests').insert({
            name
        }).returning('id')
        // console.log(name)
        return result[0]
    }
    //get guests

    getAllGuests = async () => {
        const result = await this.knex.raw(
            /*SQL*/`SELECT id, name FROM guests `)
        return result.rows
    }

    getGuestById = async (ids: number[]) => {
        try {
            if (ids.length === 0) throw new Error("ID array is empty")
            if (ids.some(id => id < 1)) throw new Error("ID array contain value smaller than 1");
            
            const result = await this.knex.raw(
                /*sql*/ `SELECT id, name
                        FROM guests 
                        WHERE id = ANY(?)`, [ids])
            // console.log(result.rows)
            return result.rows

        } catch (error) {
            console.log('[Guest Service Error] ' + 'getGuestById')
            throw error
        }
    }
    
    //delete guest
    deleteGuestById = async (ids: number[]) => {
        try {
            if (ids.length === 0) throw new Error("ID array is empty")
            if (ids.some(id => id < 1)) throw new Error("ID array contain value smaller than 1");
            
            const deletedRows = await this.knex.raw(/*sql*/ `WITH deleted as (DELETE FROM guests 
                                                        WHERE id = ANY(?) RETURNING *) 
                                                        SELECT count(*) FROM deleted;`, [ids])
            // console.log(result.rows)
            return parseInt(deletedRows.rows[0].count)

        } catch (error) {
            console.log('[Guest Service Error] ' + 'deleteGuestById')
            throw error
        }
    }

    //update guest
    updateUserById = async (updateForms: GuestForm[]) => {
        if (updateForms.length === 0) throw new Error("Update array is empty")
        const trx = await this.knex.transaction();
        let updated = 0
        try {
            for (const updateForm of updateForms){
                const updatedRows = await this.knex.raw(/*SQL*/`WITH updated as (UPDATE users SET
                                name = ?
                                WHERE id = ? RETURNING *)
                                SELECT count(*) FROM updated`,
                                [updateForm.name, updateForm.id])
                updated += parseInt(updatedRows.rows[0].count)
            }
            await trx.commit();

            return updated
            
        } catch (error) {
            await trx.rollback()
            console.log('[Guest Service Error] ' + 'updateGuestById')
            throw error
        }
    }
}