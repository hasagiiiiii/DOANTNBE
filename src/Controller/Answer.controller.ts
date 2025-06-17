import { runQuery } from "../server"
export interface Answer {
    question_id: number
    answer_text: string
    is_correct: boolean
}
export interface AnswerUpdate {
    id: number
    answer_text: string
    is_correct: boolean
}

export const insertAnswer = async (payload: Answer) => {
    const query = "INSERT INTO answers (question_id, answer_text, is_correct) VALUES ($1, $2, $3)"
    const res = await runQuery(query, [
        payload.question_id,
        payload.answer_text,
        payload.is_correct
    ])
    return res?.rows
}

export const updateAnswer = async (payload: AnswerUpdate) => {
    const query = "UPDATE answers SET answer_text=$1,is_correct = $2 WHERE id = $3"
    const res = await runQuery(query, [
        payload.answer_text,
        payload.is_correct,
        payload.id
    ])
    return res?.rows
}
export const getAnserByID = async (questionId: number) => {
    const query = `
        select id, answer_text from answers WHERE question_id = $1
        `
    const res = await runQuery(query, [
        questionId
    ])
    return res?.rows
}

export const DELETEANSWER = async (questionId: number) => {
    const query = `
        DELETE FROM answers
	WHERE id = $1
        `
    const res = await runQuery(query, [
        questionId
    ])
    return res?.rows
}