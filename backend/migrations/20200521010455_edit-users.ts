import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.schema.table('users', (table)=>{
        table.text('picture').nullable();
    })

}


export async function down(knex: Knex): Promise<any> {
    await knex.schema.table('users', (table)=>{
        table.dropColumn('picture')
    })

}

