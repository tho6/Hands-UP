import Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable('users', (table)=>{
        table.increments();
        table.string('name').nullable;
        table.string('email').notNullable().unique();
        table.string("password").notNullable();
        table.timestamps(false, true);
    })
}


export async function down(knex: Knex): Promise<any> {
    await knex.schema.dropTable('users')
}

