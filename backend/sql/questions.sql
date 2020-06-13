/* getQuestionsByRoomId */
SELECT
  questions.id as "questionId",
  guest_id as "guestId",
  guests.name as "guestName",
  content,
  meeting_id as "meetingId",
  is_hide as "isHide",
  is_answered as "isAnswered",
  is_approved as "isApproved",
  questions.created_at as "createdAt",
  questions.updated_at as "updatedAt",
  platform_id as "platformId",
  platforms.name as "platformName"
FROM questions
INNER JOIN guests ON questions.guest_id = guests.id
INNER JOIN platforms ON questions.platform_id = platforms.id
WHERE
  questions.id = ?;
  /* getQuestionLikes */
SELECT
  guest_id as "guestId"
FROM guests_questions_likes
where
  question_id = 1;
  /* getQuestionFiles */
SELECT
  id as "fileId",
  name as "fileName",
  question_id as "questionId"
FROM question_attachments
where
  question_id = 1;
  /* Update quesiton *//* trx */
UPDATE questions SET (content, updated_at, is_approved) = ('string', NOW()) WHERE id = 1;
INSERT INTO question_attachments (question_id, name) VALUES (1, 'test.png');
DELETE FROM question_attachments WHERE id = 2;
  /* Create quesiton *//* trx */
INSERT INTO questions (content, is_answered, is_approved, is_hide, meeting_id, platform_id, guest_id) VALUES ('new',false, false, false, 1,1,1);
INSERT INTO question_attachments (question_id, name) VALUES (1, 'test.png');
/* Delete question */
DELETE FROM questions WHERE id = 1;
/* Add vote */
INSERT INTO guests_questions_likes (guest_id, question_id) VALUES (1,1);
/* Remove vote */
DELETE FROM guests_questions_likes WHERE guest_id =1 AND question_id = 1;
/* answer question */
UPDATE questions SET is_answered = true WHERE id = 2;
/* hide question */
UPDATE questions SET (is_hide, is_approved) = (true, false) WHERE id = 2;
/* approved question */
UPDATE questions SET (is_hide, is_approved) = (false, true) WHERE id = 2;
/* get room host*/
SELECT owner_id "ownerId" FROM meetings WHERE id = 1;
/* get question owner*/
SELECT guest_id "guestId" FROM questions WHERE id = 1;
/* Get questions of the latest 10 meetins */
SELECT name as "meetingName", is_answered as "isAnswered", is_approved as "isApproved", is_hide as "isHide", meeting_id as "meetingId", platform_id as "platformId" FROM  questions INNER JOIN meetings ON questions.meeting_id = meetings.id WHERE meeting_id IN (SELECT id from meetings ORDER BY id DESC LIMIT  2 );
/* Get All questions */
SELECT is_answered as "isAnswered", is_approved as "isApproved", is_hide as "isHide", meeting_id as "meetingId", platform_id as "platformId" FROM  questions;
/* Get questions count of the latest 10 meetins */
SELECT name as "meetingName",meeting_id as "meetingId", COUNT(meeting_id) FROM  questions INNER JOIN meetings ON questions.meeting_id = meetings.id WHERE meeting_id IN (SELECT id from meetings ORDER BY id DESC LIMIT  2 ) GROUP BY meeting_id, meetings.name;

-- SELECT name as "meetingName", questions.meeting_id as "meetingId", COUNT(questions.meeting_id), max(youtube) as "youtubePeakViews", max(facebook) as "facebookPeakViews", max(handsup) as "handsupPeakViews" FROM  questions INNER JOIN meetings ON questions.meeting_id = meetings.id INNER JOIN views ON meetings.id = views.meeting_id WHERE questions.meeting_id IN (SELECT id from meetings WHERE owner_id = 3 ORDER BY id DESC LIMIT 15) GROUP BY questions.meeting_id, meetings.name; 


SELECT name as "meetingName", questions.meeting_id as "meetingId", COUNT(questions.meeting_id), COALESCE(max(youtube),0) as "youtubePeakViews", COALESCE(max(facebook),0) as "facebookPeakViews", COALESCE(max(handsup),0) as "handsupPeakViews" FROM  questions RIGHT JOIN meetings ON questions.meeting_id = meetings.id LEFT JOIN views ON meetings.id = views.meeting_id   WHERE meetings.id IN (SELECT id from meetings WHERE owner_id = 3 ORDER BY id DESC LIMIT 15) GROUP BY (questions.meeting_id, meetings.name); 