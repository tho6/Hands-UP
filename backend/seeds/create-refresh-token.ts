import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {

    const trx = await knex.transaction();
    try {
        await trx.raw(/*sql*/ `TRUNCATE refresh_tokens RESTART IDENTITY`);

        await trx("refresh_tokens").insert([{
            token: "token1"    
        },
        {
            token: "token2"  
        },
        {
            token:"token3"
        }])
        await trx.commit();
    } catch (error) {
        console.log('[seed] Error\n' + error)
        await trx.rollback();
    }
};
