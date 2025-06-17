import { Request, Response, Router } from "express";
import { AuthRequest } from "../MiddleWare/auth.middleware";
import { CheckAnswer, InsertUserAnswer } from "../Controller/UserAnswer.controller";
import { CountQuestion } from "../Controller/Question.controller";
import { GetCore, InsertResult } from "../Controller/User_quiz_result.controller";
import { runQuery } from "../server";
import { Result } from "../Model/IBase";

export const Answer = Router();

Answer.post("/submit-quiz", async (req: AuthRequest, res: Response) => {
    try {
        const { quiz_id, answers } = req.body.answers;
        const user_id = req.user?.id!
        // Lưu câu trả lời của người dùng vào bảng user_answers
        await runQuery(
            "DELETE FROM user_answers WHERE user_id = $1 AND quiz_id = $2",
            [user_id, quiz_id]
        );
        for (const answer of answers) {
            await InsertUserAnswer({ user_id: user_id, answer_id: answer.answer_id, question_id: answer.question_id, quiz_id: quiz_id })
        }

        // Tính số câu đúng
        const result = await CheckAnswer(user_id, quiz_id)
        const correctAnswers = result.correct_answers;

        // Đếm tổng số câu hỏi
        const totalQuestionsRes = await CountQuestion(quiz_id)
        const totalQuestions = totalQuestionsRes.rows[0].total_questions;

        // Tính điểm (Số câu đúng / Tổng số câu * 100)
        const score = (correctAnswers / totalQuestions) * 100;

        // Lưu kết quả
        await InsertResult(user_id, quiz_id, score)

        res.json({ message: 'Thành công', result: 0, data: score });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi server" });
    }
});

Answer.post('/getCore', async (req: AuthRequest, res: Response) => {
    try {
        const { idQuizz } = req.body
        if (req.user?.id) {
            const data = await GetCore(req.user.id, idQuizz)
            res.status(200).json({ message: "Thanhf coong", result: Result.Succes, data: data })
        }
    } catch (e) {
        res.status(401).json({ message: "Lỗi server", result: Result.Faile, data: [] })
    }
})