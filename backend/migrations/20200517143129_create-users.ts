import Knex from "knex";


export async function up(knex: Knex): Promise<any> {

    await knex.schema.createTable('users', (table)=>{
        table.increments();
        table.string('name').notNullable;
        table.string('email').notNullable();
        table.string('google_id').notNullable().unique();
        table.timestamps(false, true);
    })
}


export async function down(knex: Knex): Promise<any> {
    await knex.schema.dropTable('users')
}

