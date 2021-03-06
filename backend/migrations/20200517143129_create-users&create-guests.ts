import Knex from "knex";


export async function up(knex: Knex): Promise<any> {

    await knex.schema.createTable('users', (table)=>{
        table.increments();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('google_id').notNullable().unique();
        table.string('youtube_refresh_token');
        table.string('facebook_token');
        table.timestamps(false, true);
    })
    await knex.schema.createTable('guests', (table)=>{
        table.increments();
        table.text('name').notNullable();
        table.timestamps(false, true);
    })
}


export async function down(knex: Knex): Promise<any> {
    await knex.schema.dropTable('users')
    await knex.schema.dropTable('guests')
}

