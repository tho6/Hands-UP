import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
    // // Deletes ALL existing entries
    // return knex("table_name").del()
    //     .then(() => {
    //         // Inserts seed entries
    //         return knex("table_name").insert([
    //             { id: 1, colName: "rowValue1" },
    //             { id: 2, colName: "rowValue2" },
    //             { id: 3, colName: "rowValue3" }
    //         ]);
    //     });

    const trx = await knex.transaction();
    try {
        await trx.raw(/*sql*/ `TRUNCATE users RESTART IDENTITY CASCADE`);

        await trx("users").insert([{
            name: "ivan",
            email: "ivan@gmail.com",
            password: "test"
        },
        {
            name: "peter",
            email: "peter@hibye.com",
            password: "test"
        },
        {
            name:'guest',
            email: "guest1@guest.com",
            password: "test"
        }])
        trx.commit();
    } catch (error) {

        console.log('[seed] Error\n' + error)
        trx.rollback();
    }
};
