import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable("meetings", (table) => {
        table.increments(); 
        table.integer('owner_id').notNullable();
        table.foreign('owner_id').references("users.id");
        table.string("name").notNullable();
        table.string("code").notNullable();
        table.string("url").notNullable();
        table.boolean("is_live");
        table.boolean('can_moderate');
        table.boolean('can_upload_file');
        table.integer('question_limit');
        table.timestamp('date_time',true);
        table.timestamps(false, true);

    });
    await knex.schema.createTable("platforms", (table) => {
        table.increments(); 
        table.string("name").notNullable();
    });
    await knex.schema.createTable("questions", (table) => {
        table.increments(); 
        table.text("content").notNullable();
        table.boolean("is_answered").notNullable();
        table.boolean("is_approved").notNullable();
        table.boolean("is_hide").notNullable();
        table.integer("meeting_id").notNullable();
        table.integer("platform_id").notNullable();
        table.integer('guest_id');
        table.foreign('guest_id').references('guests.id');
        table.foreign('platform_id').references('platforms.id');
        table.foreign('meeting_id').references('meetings.id');
        table.timestamps(false, true);
    });
    await knex.schema.createTable("guests_questions_likes", (table) => {
        table.increments(); 
        table.integer("guest_id").notNullable();
        table.integer('question_id').notNullable();
        table.foreign('guest_id').references('guests.id');
        table.foreign('question_id').references('questions.id').onDelete("cascade");
        table.unique(["guest_id", "question_id"]);

    });
    await knex.schema.createTable("question_attachments", (table) => {
        table.increments(); 
        table.integer("question_id").notNullable();
        table.text('name').notNullable();
        table.foreign('question_id').references('questions.id').onDelete("cascade");
    });
    await knex.schema.createTable("replies", (table) => {
        table.increments(); 
        table.text("content").notNullable();
        table.integer('question_id').notNullable();
        table.integer('guest_id').notNullable();
        table.boolean('is_hide').notNullable();
        table.foreign('question_id').references('questions.id').onDelete("cascade");
        table.foreign('guest_id').references('guests.id');
        table.timestamps(false, true);
    });
}


export async function down(knex: Knex): Promise<any> {
    await knex.schema.dropTableIfExists("replies");
    await knex.schema.dropTableIfExists("question_attachments");
    await knex.schema.dropTableIfExists("guests_questions_likes");
    await knex.schema.dropTableIfExists("questions");
    await knex.schema.dropTableIfExists("platforms");
    await knex.schema.dropTableIfExists("meetings");
}

