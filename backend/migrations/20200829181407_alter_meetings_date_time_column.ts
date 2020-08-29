import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.schema.alterTable("meetings", (table) => {
        table.timestamp('date_time',{ useTz: true }).alter();
    });
}


export async function down(knex: Knex): Promise<any> {
    await knex.schema.alterTable("meetings", (table) => {
        table.timestamp('date_time',true).alter();
    });
}



