import Knex from "knex";

interface IMeeting {
    id: number;
    owner_id: number;
    name: string;
    code: string;
    url: string;
    is_live: boolean;
    created_at: Date,
    updated_at: Date
    date_time: Date;
    can_moderate: boolean;
    can_upload_file: boolean;
    question_limit: number;
}

export class MeetingService {
    constructor(private knex: Knex) { }

    async getMeeting(){
        let result = await this.knex.raw(/*SQL*/`SELECT * FROM meetings`)
        return result;
    }

    async getMeetingByMeetingName(name: string) {
        return (
            await this.knex.raw(/*SQL*/`SELECT * FROM meetings WHERE name = ?`,
                [name]
            )
        ).rows[0] as IMeeting;
    }

    async createMeeting(name: string, date_time: Date, code: string, url: string) {
        let result = await this.knex.raw(/*SQL*/`INSERT INTO meeting ("name", "date_time", "code", "url") VALUES (?,?,?,?) RETURNING id`,
            [
                name,
                date_time,
                code,
                url,
            ]
        );
        console.log(result);
        return result;
    }
}

// getAllMeeting = async ():Promise<IMeeting[]> => {
//     try {
//         const result = await this.knex.raw(
//             /*SQL*/`SELECT "id", "owner_id", "name", "code", "url", "is_live", "date_time", "can_moderate", "can_upload_file", "question_limit" FROM users`
//         )
//         return result.rows;
//     } catch (error) {
//         console.log("[MeetingService] getAllMeeting error")
//         throw error;
//     }
// }