import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {

    const trx = await knex.transaction();
    try {
        await trx.raw(/*sql*/ `TRUNCATE tokens RESTART IDENTITY`);

        await trx("tokens").insert([{
            refresh_token: "token1", 
            access_token: "atoken1"
        },
        {
            refresh_token: "token2",
            access_token: "atoken2"
        },
        {
            refresh_token:"token3",
            access_token: "atoken3"
        }])
        await trx.commit();
    } catch (error) {
        console.log('[seed] Error\n' + error)
        await trx.rollback();
    }
};
