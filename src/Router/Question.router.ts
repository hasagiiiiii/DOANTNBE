import express, { Request, Response } from "express";
import { AuthRequest } from "../MiddleWare/auth.middleware";
import { DELETEQuestion, GetQuestion, InsertQuestion, UpdateQuestion } from "../Controller/Question.controller";
import { DELETEANSWER, getAnserByID, insertAnswer, updateAnswer } from "../Controller/Answer.controller";
import { Result } from "../Model/IBase";
export const QuestionRouter = express.Router();

QuestionRouter.post('/questionByID', async (req: AuthRequest, res: Response): Promise<any> => {
    const { quiz_id, text, type, answer } = req.body.datares;
    try {
        const questionResult = await InsertQuestion({ quiz_id: quiz_id, question_text: text, question_type: type })
        const question_id = questionResult.id;

        for (const item of answer) {
            await insertAnswer({ question_id: question_id, answer_text: item.text, is_correct: item.is_correct })
        }

        res.status(201).json({
            message: "Question added successfully",
            data: [],
            result: 0
            // question_id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

QuestionRouter.post('/update', async (req: AuthRequest, res: Response) => {
    const { idQuestion, text, answer } = req.body.datares;
    console.log(idQuestion, text, answer);
    try {
        const questionUpdate = await UpdateQuestion(idQuestion, text)
        for (const item of answer) {
            await updateAnswer({ id: item.id, answer_text: item.answer_text, is_correct: item.is_correct })
        }
        // const question
        res.status(200).json({ error: "Thanh cong", result: Result.Succes, data: [] });

    } catch (e) {
        res.status(500).json({ error: "Internal server error", result: Result.Faile, data: [] });
    }

})

QuestionRouter.post('/delete', async (req: AuthRequest, res: Response) => {
    const { idQuestion, text, answer } = req.body;
    console.log(idQuestion, text, answer);
    try {
        const questionUpdate = await DELETEQuestion(idQuestion)
        for (const item of answer) {
            await DELETEANSWER(item.id)
        }
        // const question
        res.status(200).json({ error: "Thanh cong", result: Result.Succes, data: [] });

    } catch (e) {
        res.status(500).json({ error: "Internal server error", result: Result.Faile, data: [] });
    }

})
QuestionRouter.post('/getQuestion', async (req: AuthRequest, res: Response) => {
    const { id_quizze } = req.body

    try {
        const questions = await GetQuestion(id_quizze)
        for (let question of questions) {
            const answer = await getAnserByID(question.id)
            question.answer = answer
        }
        res.status(200).json({ message: 'Thành công', result: 0, data: questions })
    } catch (error) {
        res.status(500).json({ message: 'Thành công', result: 1, data: [] })
    }
})