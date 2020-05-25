  /* getQuestionReplies */
SELECT
  replies.id,
  replies.guest_id as "guestId",
  guests.name as "guestName",
  content,
  question_id as "questionId",
  replies.created_at as "createdAt",
  replies.updated_at as "updatedAt",
  is_hide as "isHide"
FROM replies
INNER JOIN guests ON replies.guest_id = guests.id
WHERE
  question_id = 1;
/* update reply */
UPDATE replies SET (content, updated_at) = ('update reply', NOW()) where id = 1;
/* create reply */
INSERT INTO replies (content, question_id, guest_id, is_hide) VALUES ('new update', 1, 3, false);
/* delete reply */
DELETE FROM replies WHERE id =2;


