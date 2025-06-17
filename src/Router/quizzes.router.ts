import express, { Response, Router } from "express";
import { AuthRequest } from "../MiddleWare/auth.middleware";
import { getQuizzes, getQuizzesAll, InsertQuizzes, UpdateQuizzes } from "../Controller/Quizzes.controller";
export const Quizzes = Router();

Quizzes.get('/quizzesById', async (req: AuthRequest, res: Response): Promise<any> => {
    const { idCouse, idQuizzes } = req.body
    try {
        const data = await getQuizzes(idCouse, idQuizzes)
        return res.status(200).json({ message: 'Thành công', result: 0, data: data })
    } catch (error) {
        return res.status(400).json({ message: 'Thất bại', result: 0, data: [] })

    }
})
Quizzes.post('/quizzes', async (req: AuthRequest, res: Response): Promise<any> => {
    const { idCourse } = req.body
    try {
        const data = await getQuizzesAll(idCourse)
        return res.status(200).json({ message: 'Thành công', result: 0, data: data })
    } catch (error) {
        return res.status(400).json({ message: 'Thất bại', result: 0, data: [] })

    }
})
Quizzes.post('/quizzesIn', async (req: AuthRequest, res: Response) => {
    const { data } = req.body
    try {
        const value = await InsertQuizzes({ idCourse: data?.idCourse, title: data.title, description: data.description })
        res.status(200).json({ message: 'Thành công', result: 0, data: value })
    } catch (error) {
        res.status(400).json({ message: 'Thất bại', result: 0, data: [] })

    }
})

Quizzes.post('/updateQuize', async (req: AuthRequest, res: Response) => {
    const { data } = req.body
    try {
        const value = await UpdateQuizzes(data.title, data.description, data?.id)
        res.status(200).json({ message: 'Thành công', result: 0, data: value })
    } catch (error) {
        res.status(400).json({ message: 'Thất bại', result: 0, data: [] })

    }
})