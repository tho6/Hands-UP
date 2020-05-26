import Knex from "knex";
import { IMeeting } from "../models/MeetingInterface";

export class MeetingService {
    constructor(private knex: Knex) { }
}

getAllMeeting = async ():Promise<IMeeting[]> => {
    try {
        const result = await this.knex.raw(
            /*SQL*/`SELECT "id", "owner_id", "name", "code", "url", "is_live", "date_time", "can_moderate", "can_upload_file", "question_limit" FROM users`
        )
        return result.rows;
    } catch (error) {
        console.log("[MeetingService] getAllMeeting error")
        throw error;
    }
}

