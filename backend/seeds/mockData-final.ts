import * as Knex from "knex";
import faker from 'faker';

const numberOfMeeting = 20;
const numberOfGuests = 70;
const numberOfQuestions = 500;
const numberOfReplies = 250;
const numberOfViewsRecord = 5000;  //assume 1 event last for 1 hour --> 3 * 60 * 500 but not allowed
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
        // await trx.raw(/*sql*/ `TRUNCATE tokens RESTART IDENTITY CASCADE`);
        await trx.raw(/*sql*/ `TRUNCATE guests RESTART IDENTITY CASCADE`);
        await trx.raw(/*sql*/ `TRUNCATE users RESTART IDENTITY CASCADE`);
        await trx.raw(/*sql*/ `TRUNCATE views RESTART IDENTITY CASCADE`);


        /*Timestamps Output the same number */
        //const createdAt = new Date("2020-05-23T12:00:00.000z")  // Date.parse createdDate --> = 1590235200000
        //@ts-ignore
        const updatedAt = new Date("2020-05-23T13:00:00.000z")  // Date.parse createdDate --> = 1590238800000
        // const scheduledTime = new Date("2020-05-30T13:00:00.000z")  // Date.parse createdDate --> = 1590843600000

        /* Insert users */
        await trx("users").insert([{
            name: "ivan",
            email: "ivancheung3838@gmail.com",
            google_id: '110870491670380383057',
            picture: 'https://lh4.googleusercontent.com/-FSfCxmiwmew/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuck-5vtxd-XEFTx-XWNDo-htdW0Pzw/s96-c/photo.jpg'
        },
        {
            name: "tavin",
            email: "chingching6@gmail.com",
            google_id: "113245393588712888848",
            picture: 'https://lh3.googleusercontent.com/a-/AOh14GjlPiDGPYTjYq-tesPi5OaOL05x_MpudrAM7M6RVA=s96-c'
        },
        {
            name: 'ronson',
            email: "rslam1311@gmail.com",
            google_id: "101324217801814946845",
            picture: 'https://lh3.googleusercontent.com/a-/AOh14GjlPiDGPYTjYq-tesPi5OaOL05x_MpudrAM7M6RVA=s96-c'
        }])
        /* Insert guests */
        const guestData = [];
        for(let i =0; i<numberOfGuests; i++){
            guestData.push(createGuests());
        }
        await trx("guests").insert(guestData);
        /* Insert tokens */
       
        /* Insert meetings */
        const meetingData = [];
        for(let i =0; i<numberOfMeeting; i++){
            meetingData.push(createFakeMeeting());
        }
        await trx("meetings").insert(meetingData);
        /* Insert Platform */
        await trx("platforms").insert([{
            name: 'handsup',
        },
        {
            name: 'facebook'
        },
        {
            name: 'youtube'
        }])
        /* Insert questions */
        const questionData = [];
        for(let i =0; i<numberOfQuestions; i++){
            questionData.push(createQuestions());
        }
        await trx("questions").insert(questionData);
        /* Insert replies */
        const replyData = [];
        for(let i =0; i<numberOfReplies; i++){
            replyData.push(createReplies());
        }
        await trx("replies").insert(replyData)
        /* Insert files */
        await trx("question_attachments").insert([{
            question_id: 1,
            name: '123.png'
        }
        ])
        /* Insert likes */
        await trx("guests_questions_likes").insert([{
            question_id: 1,
            guest_id: 1
        },
        {
            question_id: 1,
            guest_id: 2
        },
        {
            question_id: 2,
            guest_id: 3
        }
        ])
        /* Insert views */
        const viewsData = [];
        for(let i =0; i<numberOfViewsRecord; i++){
            viewsData.push(createViews());
        }
        await trx("views").insert(viewsData)
        await trx.commit();
    } catch (e) {
        console.error(e);
        console.log("transaction rollback")
        await trx.rollback();
    }
};
function createFakeMeeting(){
    return{
        owner_id: Math.floor(Math.random() * 3)+1,
        name: faker.name.title(),
        code: faker.random.word(),
        url: faker.internet.url(),
        is_live: randomTrueFalse(),
        can_moderate: randomTrueFalse(),
        can_upload_file: randomTrueFalse(),
        question_limit: Math.floor(Math.random() * 10)+1,
        date_time: new Date(Math.floor(Math.random() * 2)===0?faker.date.recent():faker.date.past())
    }
}
function createQuestions(){
    return{
        content: faker.lorem.sentences(),
        is_answered: randomTrueFalse(),
        is_approved: randomTrueFalse(),
        is_hide: randomTrueFalse(),
        meeting_id: randomNumberWithinARange(numberOfMeeting),
        platform_id: randomNumberWithinARange(3),
        guest_id: randomNumberWithinARange(numberOfGuests),
    }
}
function createGuests(){
    return{
        name: faker.name.firstName(),
    }
}
function createReplies(){
    return{
            content: faker.lorem.sentence(),
            question_id: randomNumberWithinARange(numberOfQuestions),
            guest_id: randomNumberWithinARange(numberOfGuests),
            is_hide: randomTrueFalse(),
    }
}
function createViews(){
    return{
        meeting_id: randomNumberWithinARange(numberOfMeeting),
        youtube: randomNumberWithinARange(100),
        facebook: randomNumberWithinARange(100),
        handsup: randomNumberWithinARange(100),
        created_at: new Date(faker.date.between(new Date(2020, 5, 20, 10, 0, 0),new Date(2020, 5, 20, 11, 0, 0)))
    }
}
function randomTrueFalse(){
   return Math.floor(Math.random() * 2)===0?false:true
}
function randomNumberWithinARange(int:number){
   return Math.floor(Math.random() * int) +1
}