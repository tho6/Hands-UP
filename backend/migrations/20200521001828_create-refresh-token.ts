import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable('tokens', (table)=>{
        table.increments();
        table.text('refresh_token').notNullable().unique()
        table.text('access_token').notNullable().unique()
        table.timestamps(false, true);
    })
}


export async function down(knex: Knex): Promise<any> {
    await knex.schema.dropTable('tokens')
}

