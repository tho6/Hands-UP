import Knex from "knex";


export class LiveService{
    constructor(private knex: Knex){}

    //*** save fb token
    //*** get fb token
    //*** del fb token
    saveViews = async (meetingId:number, ytViews:number,fbViews:number, huViews:number)=>{
        try {
            console.log(meetingId, ytViews,fbViews, huViews)
            const res = await this.knex.raw(/*SQL*/ `INSERT INTO views 
                                    (meeting_id, youtube, facebook, handsup)
                                    VALUES (?,?,?,?)
                                    RETURNING id`, [meetingId, ytViews,fbViews, huViews])
            const result = res.rows[0].id
            if (!result) throw new Error('Failed to Save Views')
            return result
        } catch (error) {
            console.log(error);
            console.log('[Live Service Error] ' + 'saveViews');
            // throw error
        }
        
    }
}