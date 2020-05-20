import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable('refresh_tokens', (table)=>{
        table.increments();
        table.text('token').notNullable().unique()
        table.timestamps(false, true);
    })
}


export async function down(knex: Knex): Promise<any> {
    await knex.schema.dropTable('refresh_tokens')
}

