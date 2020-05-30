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
            email: "ivancheung3838@gmail.com",
            google_id: '110870491670380383057',
            picture: 'https://lh4.googleusercontent.com/-FSfCxmiwmew/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuck-5vtxd-XEFTx-XWNDo-htdW0Pzw/s96-c/photo.jpg'
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
        {
            owner_id: 1,
            name: 'Meeting Room 3',
            code: '#MeetingRoom3',
            url: 'urlmeetingroom3',
            is_live: true,
            can_moderate: false,
            can_upload_file: true,
            question_limit: 10,
            date_time: scheduledTime,
            created_at: createdAt,
            updated_at: createdAt
        },
        {
            owner_id: 1,
            name: 'Meeting Room 4',
            code: '#MeetingRoom4',
            url: 'urlmeetingroom4',
            is_live: true,
            can_moderate: true,
            can_upload_file: false,
            question_limit: 10,
            date_time: scheduledTime,
            created_at: createdAt,
            updated_at: createdAt
        }
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
            is_approved: true,
            is_hide: false,
            meeting_id: 1,
            platform_id: 1,
            guest_id: 1,
            created_at: createdAt,
            updated_at: createdAt
        },
        {
            content: 'question 2',
            is_answered: false,
            is_approved: true,
            is_hide: false,
            meeting_id: 1,
            platform_id: 2,
            guest_id: 2,
            created_at: createdAt,
            updated_at: createdAt
        },
        {
            content: 'question 3',
            is_answered: true,
            is_approved: true,
            is_hide: false,
            meeting_id: 1,
            platform_id: 3,
            guest_id: 2,
            created_at: createdAt,
            updated_at: createdAt
        },
        {
            content: 'question 4',
            is_answered: false,
            is_approved: true,
            is_hide: false,
            meeting_id: 1,
            platform_id: 1,
            guest_id: 2,
            created_at: createdAt,
            updated_at: createdAt
        },
        {
            content: 'question 5',
            is_answered: false,
            is_approved: true,
            is_hide: false,
            meeting_id: 2,
            platform_id: 1,
            guest_id: 2,
            created_at: createdAt,
            updated_at: createdAt
        },
        {
            content: 'question 6',
            is_answered: false,
            is_approved: true,
            is_hide: false,
            meeting_id: 2,
            platform_id: 1,
            guest_id: 3,
            created_at: createdAt,
            updated_at: createdAt
        }
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
        await trx("views").insert([{
            meeting_id: 1,
            youtube: 1,
            facebook: 3,
            handsup: 5,
            created_at: new Date(2020, 5, 20, 10, 0, 0)
        },{
            meeting_id: 1,
            youtube: 5,
            facebook: 5,
            handsup: 9,
            created_at: new Date(2020, 5, 20, 10, 0, 30)
        },{
            meeting_id: 1,
            youtube: 6,
            facebook: 3,
            handsup: 5,
            created_at: new Date(2020, 5, 20, 10, 1, 0)
        },{
            meeting_id: 1,
            youtube: 9,
            facebook: 3,
            handsup: 5,
            created_at: new Date(2020, 5, 20, 10, 1, 30)
        },{
            meeting_id: 1,
            youtube: 10,
            facebook: 12,
            handsup: 11,
            created_at: new Date(2020, 5, 20, 10, 2, 0)
        },{
            meeting_id: 1,
            youtube: 21,
            facebook: 23,
            handsup: 25,
            created_at: new Date(2020, 5, 20, 10, 2, 30)
        },{
            meeting_id: 1,
            youtube: 1,
            facebook: 3,
            handsup: 5,
            created_at: new Date(2020, 5, 20, 10, 3, 0)
        },{
            meeting_id: 1,
            youtube: 1,
            facebook: 3,
            handsup: 5,
            created_at: new Date(2020, 5, 20, 10, 3, 30)
        },{
            meeting_id: 1,
            youtube: 1,
            facebook: 3,
            handsup: 5,
            created_at: new Date(2020, 5, 20, 10, 4, 0)
        },{
            meeting_id: 1,
            youtube: 1,
            facebook: 3,
            handsup: 5,
            created_at: new Date(2020, 5, 20, 10, 4, 30)
        },{
            meeting_id: 1,
            youtube: 1,
            facebook: 3,
            handsup: 5,
            created_at: new Date(2020, 5, 20, 10, 5, 0)
        },{
            meeting_id: 1,
            youtube: 1,
            facebook: 3,
            handsup: 5,
            created_at: new Date(2020, 5, 20, 10, 5, 30)
        },{
            meeting_id: 1,
            youtube: 1,
            facebook: 3,
            handsup: 5,
            created_at: new Date(2020, 5, 20, 10, 6, 0)
        },{
            meeting_id: 1,
            youtube: 1,
            facebook: 3,
            handsup: 5,
            created_at: new Date(2020, 5, 20, 10, 6, 30)
        },{
            meeting_id: 1,
            youtube: 1,
            facebook: 3,
            handsup: 5,
            created_at: new Date(2020, 5, 20, 10, 7, 0)
        },{
            meeting_id: 1,
            youtube: 1,
            facebook: 3,
            handsup: 5,
            created_at: new Date(2020, 5, 20, 10, 7, 30)
        },{
            meeting_id: 1,
            youtube: 1,
            facebook: 3,
            handsup: 5,
            created_at: new Date(2020, 5, 20, 10, 8, 0)
        },{
            meeting_id: 1,
            youtube: 1,
            facebook: 3,
            handsup: 5,
            created_at: new Date(2020, 5, 20, 10, 8, 30)
        },{
            meeting_id: 1,
            youtube: 1,
            facebook: 3,
            handsup: 5,
            created_at: new Date(2020, 5, 20, 10, 9, 0)
        },{
            meeting_id: 1,
            youtube: 1,
            facebook: 3,
            handsup: 5,
            created_at: new Date(2020, 5, 20, 10, 9, 30)
        },{
            meeting_id: 1,
            youtube: 1,
            facebook: 3,
            handsup: 5,
            created_at: new Date(2020, 5, 20, 10, 10, 0)
        },{
            meeting_id: 1,
            youtube: 14,
            facebook: 30,
            handsup: 5,
            created_at: new Date(2020, 5, 20, 10, 11, 0)
        },{
            meeting_id: 2,
            youtube: 124,
            facebook: 320,
            handsup: 52,
            created_at: new Date(2020, 5, 20, 10, 11, 30)
        },{
            meeting_id: 2,
            youtube: 214,
            facebook: 435,
            handsup: 599,
            created_at: new Date(2020, 5, 20, 10, 11, 0)
        },{
            meeting_id: 1,
            youtube: 16,
            facebook: 3,
            handsup: 5,
            created_at: new Date(2020, 5, 20, 10, 10, 30)
        }])
        await trx.commit();
    } catch (e) {
        console.error(e);
        console.log("transaction rollback")
        await trx.rollback();
    }
};