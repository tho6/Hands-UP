import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    const trx = await knex.transaction();
    try {
        await trx.raw(/*sql*/ `TRUNCATE replies RESTART IDENTITY CASCADE`);
        await trx.raw(/*sql*/ `TRUNCATE question_attachments RESTART IDENTITY CASCADE`);
        await trx.raw(/*sql*/ `TRUNCATE guests_questions_likes RESTART IDENTITY CASCADE`);
        await trx.raw(/*sql*/ `TRUNCATE questions RESTART IDENTITY CASCADE`);
        await trx.raw(/*sql*/ `TRUNCATE platforms RESTART IDENTITY CASCADE`);
        await trx.raw(/*sql*/ `TRUNCATE meetings RESTART IDENTITY CASCADE`);
        await trx.raw(/*sql*/ `TRUNCATE tokens RESTART IDENTITY CASCADE`);
        await trx.raw(/*sql*/ `TRUNCATE guests RESTART IDENTITY CASCADE`);
        await trx.raw(/*sql*/ `TRUNCATE users RESTART IDENTITY CASCADE`);

        /*Timestamps Output the same number */
        const createdAt = new Date("2020-05-23T12:00:00.000z")  // Date.parse createdDate --> = 1590235200000
        //@ts-ignore
        const updatedAt = new Date("2020-05-23T13:00:00.000z")  // Date.parse createdDate --> = 1590238800000
        const scheduledTime = new Date("2020-05-30T13:00:00.000z")  // Date.parse createdDate --> = 1590843600000

        /* Insert users */
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
            name: 'mary',
            email: "mary1@hey.com",
            google_id: 3,
            picture: 'pic3'
        }])
        /* Insert guests */
        await trx("guests").insert([{
            name: "guest1"
        },
        {
            name: "guest2"
        },
        {
            name: 'guest3'
        }])
        /* Insert tokens */
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
        /* Insert meetings */
        await trx("meetings").insert([{
            owner_id: 1,
            name: 'Meeting Room 1',
            code: '#MeetingRoom1',
            url: 'urlmeetingroom1',
            is_live: false,
            can_moderate: false,
            can_upload_file: false,
            question_limit: 3,
            date_time: scheduledTime,
            created_at: createdAt,
            updated_at: createdAt
        },
        {
            owner_id: 1,
            name: 'Meeting Room 2',
            code: '#MeetingRoom2',
            url: 'urlmeetingroom2',
            is_live: true,
            can_moderate: true,
            can_upload_file: true,
            question_limit: 10,
            date_time: scheduledTime,
            created_at: createdAt,
            updated_at: createdAt
        },
        ])
        /* Insert Platform */
        await trx("platforms").insert([{
            name: 'project3',
        },
        {
            name: 'facebook'
        },
        {
            name: 'youtube'
        }])
        /* Insert questions */
        await trx("questions").insert([{
            content: 'question 1',
            is_answered: false,
            is_approved: false,
            is_hide: false,
            meeting_id: 1,
            platform_id: 1,
            guest_id: 1,
            created_at: createdAt,
            updated_at: createdAt
        },
        {
            content: 'question 2',
            is_answered: true,
            is_approved: true,
            is_hide: true,
            meeting_id: 1,
            platform_id: 1,
            guest_id: 2,
            created_at: createdAt,
            updated_at: createdAt
        },
        ])
        /* Insert replies */
        await trx("replies").insert([{
            content: 'reply 1',
            question_id: 1,
            guest_id: 2,
            is_hide: false,
            created_at: createdAt,
            updated_at: createdAt
        }
        ])
        /* Insert files */
        await trx("question_attachments").insert([{
            question_id: 1,
            name: '123.png'
        }
        ])
        /* Insert likes */
        await trx("guests_questions_likes").insert([{
            question_id: 1,
            guest_id:1
        },
        {
            question_id: 1,
            guest_id:2
        },
        {
            question_id: 2,
            guest_id:3
        }
        ])
        await trx.commit();
    } catch (e) {
        console.error(e);
        console.log("transaction rollback")
        await trx.rollback();
    }
};