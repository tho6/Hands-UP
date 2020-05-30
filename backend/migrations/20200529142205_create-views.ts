import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable('views', (table)=>{
        table.increments();
        table.integer('meeting_id').notNullable();
        table.foreign('meeting_id').references("meetings.id");
        table.integer('youtube').unsigned()
        table.integer('facebook').unsigned()
        table.integer('handsup').unsigned()
        table.timestamps(false, true)
    })
}


export async function down(knex: Knex): Promise<any> {
    await knex.schema.dropTable('views')
}

