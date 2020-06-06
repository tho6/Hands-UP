import Knex from "knex";
import { IMeeting, IRoomConfiguration } from "../models/Interface/IMeeting";

export class MeetingService {
    constructor(private knex: Knex) { }

    // async getMeeting() {
    //     let result = await this.knex.raw(/*SQL*/`SELECT * FROM meetings`)
    //     return result.rows as IMeeting[];
    // }

    async getMeetingByUserId(id: number) {
        try {
            const result = await this.knex.raw(/*SQL*/`SELECT * from meetings WHERE owner_id = (?)`, [id])
            return result.rows
        } catch (error) {
            console.log('[Meeting Service Error] ' + 'getMeetingIdsById')
            throw error
        }
    }

    async getMeetingByMeetingName(name: string) {
        try {
            return (
                await this.knex.raw(/*SQL*/`SELECT * FROM meetings WHERE name = ?`,
                    [name]
                )
            ).rows[0] as IMeeting;
        } catch (error) {
            throw error;
        }
    }

    async createMeeting(name: string, date_time: Date, code: string, url: string, owner_id: number, question_limit: number, can_moderate: boolean, can_upload_file: boolean) {
        try {
            let check = await this.knex.raw(/*SQL*/`SELECT * FROM meetings WHERE name = ?`, [name]);
            console.log(check.rowCount);
            if (check.rows.length > 0) {
                throw new Error("Duplicate meeting name");
            }
            let result = await this.knex.raw(/*SQL*/`INSERT INTO meetings (name, date_time, code, url, owner_id, question_limit, can_moderate, can_upload_file) VALUES (?,?,?,?,?,?,?,?) RETURNING id`,
                [
                    name,
                    date_time,
                    code,
                    url,
                    owner_id,
                    question_limit,
                    can_moderate,
                    can_upload_file
                ]
            );
            console.log(result);
            return result.rows[0].id;
        } catch (error) {
            throw error;
        }
    }

    async editMeeting(id: number, name: string, date_time: Date, code: string, url: string, owner_id: number) { // or use name??
        return this.knex.raw(/*SQL*/`UPDATE meetings SET name = ?,date_time = ?,code = ?,url = ?,owner_id = ? WHERE id = ?`, [name, date_time, code, url, owner_id, id]);
        // console.log(name);
    }

    async deleteMeeting(id: number) {
        return this.knex.raw(/*SQL*/`DELETE FROM meetings WHERE id = ?`, [id]);
    }

    async getMeetingById(id: number) {
        const sql = 'SELECT id, owner_id as "ownerId", name, code, url, is_live as "isLive", can_moderate as "canModerate", can_upload_file as "canUploadFile", question_limit as "questionLimit", date_time as "dateTime", created_at as "createdAt", updated_at as "updatedAt" FROM meetings WHERE id = ?'
        const result = await this.knex.raw(sql, [id]);
        if (result.rowCount !== 1) throw new Error('No meeting is found!');
    }

    // async getMeetingById(id: number){
    //     const sql = 'SELECT id, owner_id as "ownerId", name, code, url, is_live as "isLive", can_moderate as "canModerate", can_upload_file as "canUploadFiles", question_limit as "questionLimit", date_time as "dateTime", created_at as "createdAt", updated_at as "updatedAt" FROM meetings WHERE id = ?'
    //     const result = await this.knex.raw(sql,[id]);
    //     if(result.rowCount !== 1) throw new Error('No meeting is found!');
    //     return result.rows[0];
    // }

    async updateMeetingInRoom(id: number, roomConfiguration: IRoomConfiguration) {
        const { canModerate, canUploadFiles, questionLimit } = roomConfiguration;
        const sql = 'update meetings set (can_upload_file, can_moderate, question_limit) = (?, ?, ?) where id = ?;'
        const result = await this.knex.raw(sql, [canUploadFiles, canModerate, questionLimit, id]);
        if (result.rowCount !== 1) throw new Error('No meeting is found!/Fail to update room configuration!');
        return true;
    }
}