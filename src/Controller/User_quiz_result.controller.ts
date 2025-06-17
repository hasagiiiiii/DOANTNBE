import { runQuery } from "../server";

export const InsertResult = async (user_id: number, quiz_id: number, score: number) => {
    const query = `INSERT INTO user_quiz_results (user_id, quiz_id, score) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (user_id, quiz_id) DO UPDATE SET score = $3, completed_at = NOW()`;
    const res = await runQuery(query, [user_id, quiz_id, score]);

    return res?.rows[0];

};

export const GetCore = async (user_id: number, quiz_id: number) => {
    const query = 'Select * from user_quiz_results Where user_id = $1 AND quiz_id = $2'
    const res = await runQuery(query, [user_id, quiz_id])
    return res?.rows[0];
}
export const ViewScore = async (course_id: number) => {
    const query = `
    SELECT users.user_name, users.full_name,users.avatar,user_quiz_results.score,quizzes.title
	FROM user_quiz_results 
	JOIN users on user_quiz_results.user_id = users.id
	JOIN quizzes on user_quiz_results.quiz_id = quizzes.id
	WHERE quizzes.course_id = $1
	;`
    const res = await runQuery(query, [course_id])
    return res?.rows;
}

export const ViewScoreStudent = async (user_id: number) => {
    const query = `
    SELECT users.user_name, users.full_name,users.avatar,user_quiz_results.score,quizzes.title,courses.title,courses.id
	FROM user_quiz_results 
	JOIN users on user_quiz_results.user_id = users.id
	JOIN quizzes on user_quiz_results.quiz_id = quizzes.id
	JOIN courses on courses.id = quizzes.course_id
	WHere users.id =$1
	;`
    const res = await runQuery(query, [user_id])
    return res?.rows;
}