import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.schema.table("questions", (t)=>{
        t.dropForeign(['meeting_id'])
        t.foreign('meeting_id').references('meetings.id').onDelete("cascade");
    })
    await knex.schema.table("views", (t)=>{
        t.dropForeign(['meeting_id'])
        t.foreign('meeting_id').references('meetings.id').onDelete("cascade");
    })
}


export async function down(knex: Knex): Promise<any> {
    await knex.schema.table("questions", (t)=>{
        t.dropForeign(["meeting_id"])
        t.foreign("meeting_id").references("meetings.id")
    })
    await knex.schema.table("views", (t)=>{
        t.dropForeign(["meeting_id"])
        t.foreign("meeting_id").references("meetings.id")
    })
}

