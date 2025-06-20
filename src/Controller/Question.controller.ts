import { runQuery } from "../server"
export interface QuestionItem {
    quiz_id: string,
    question_text: string
    question_type: string
}
export const InsertQuestion = async (payload: QuestionItem) => {
    const query = "INSERT INTO questions (quiz_id, question_text, question_type) VALUES ($1, $2, $3) RETURNING id"
    const res = await runQuery(query, [payload.quiz_id, payload.question_text, payload.question_type])
    return res?.rows[0]
}

export const GetQuestion = async (id_quizze: number) => {
    const query = `
      SELECT id,question_text FROM questions WHERE quiz_id = $1
    `
    const res = await runQuery(query, [id_quizze])
    return res?.rows!
}

export const CountQuestion = async (id_quizze: number) => {
    const query = `SELECT COUNT(*) AS total_questions FROM questions WHERE quiz_id = $1`
    const res = await runQuery(query, [id_quizze])
    return res!
}