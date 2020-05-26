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
            google_id: 1,
            picture: 'pic1'        
        },
        {
            name: "peter",
            email: "peter@hibye.com",
            google_id: 2,
            picture: 'pic2'        
        },
        {
            name:'mary',
            email: "mary1@hey.com",
            google_id: 3,
            picture: 'pic3'
        }])
        await trx.commit();
    } catch (error) {

        console.log('[seed] Error\n' + error)
        await trx.rollback();
    }
};
