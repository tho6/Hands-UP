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
        await trx.raw(/*sql*/ `TRUNCATE guests RESTART IDENTITY`);

        await trx("guests").insert([{
            name: "guest1"    
        },
        {
            name: "guest2"  
        },
        {
            name:'guest3'
        }])
        await trx.commit();
    } catch (error) {
        console.log('[seed] Error\n' + error)
        await trx.rollback();
    }
};
