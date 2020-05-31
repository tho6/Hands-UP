import Knex from "knex";
import { IMeeting } from "../models/Interface/IMeeting";

export class MeetingService {
    constructor(private knex: Knex) { }

    async getMeeting() {
        let result = await this.knex.raw(/*SQL*/`SELECT * FROM meetings`)
        return result.rows as IMeeting[];
    }

    async getMeetingByMeetingName(name: string) {
        return (
            await this.knex.raw(/*SQL*/`SELECT * FROM meetings WHERE name = ?`,
                [name]
            )
        ).rows[0] as IMeeting;
    }

    async createMeeting(name: string, date_time: Date, code: string, url: string, owner_id: number) {
        {
            let check = await this.knex.raw(/*SQL*/`SELECT * FROM meetings WHERE name = ?`, [name]);
            console.log(check.rowCount);
            if (check.rows.length > 0) {
                throw new Error("Duplicate meeting name");
            }
        }
        let result = await this.knex.raw(/*SQL*/`INSERT INTO meetings (name, date_time, code, url, owner_id) VALUES (?,?,?,?,?) RETURNING id`,
            [
                name,
                date_time,
                code,
                code,
                owner_id
            ]
        );
        console.log(result);
        return result.rows[0].id;
    }

    async editMeeting(id: number, name: string, date_time: Date, code: string, url: string, owner_id: number) { // or use name??
        return this.knex.raw(/*SQL*/`UPDATE meetings SET name = ?,date_time = ?,code = ?,url = ?,owner_id = ? WHERE id = ?`, [name, date_time, code, url, owner_id, id]);
        // console.log(name);
    }

    async deleteMeeting(id: number) {
        return this.knex.raw(/*SQL*/`DELETE FROM meetings WHERE id = ?`, [id]);
    }
}