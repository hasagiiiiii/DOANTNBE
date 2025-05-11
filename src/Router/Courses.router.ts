import { Request, Response, Router } from "express";
import { AuthRequest } from "../MiddleWare/auth.middleware";
import { InsertCourse, SelectCourseByID, SelectCourseByIDUser, SelectCourses, UpdateCourse } from "../Controller/Course.controller";
import { getQuizzes } from "../Controller/Quizzes.controller";

export const Courses = Router();

Courses.get('/course', async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const course = await SelectCourses()
        return res.status(200).json({ message: 'Thành công', data: course, result: 0 })
    } catch (e) {
        return res.status(401).json({ message: 'Thất bại', data: [], result: -1 })

    }
})
Courses.get('/coursebyIDUser', async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const course = await SelectCourseByIDUser(req.user.id)
        return res.status(200).json({ message: 'Thành công', data: course, result: 0 })
    } catch (e) {
        return res.status(401).json({ message: 'Thất bại', result: -1 })

    }
})
Courses.post('/getCourseByID', async (req: AuthRequest, res: Response): Promise<any> => {
    const { idCourse } = req.body
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const course = await SelectCourseByID(idCourse)
        return res.status(200).json({ message: 'Thành công', data: course, result: 0 })
    } catch (e) {
        return res.status(401).json({ message: 'Thất bại', result: -1 })

    }
})
Courses.post('/course', async (req: AuthRequest, res: Response): Promise<any> => {
    const { category, description, price, teacher_id, title } = req.body
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        let data = await InsertCourse({ description, price, teacher_id, title, category, thumbnail: req.file?.filename || '' })
        return res.status(200).json({ message: 'Thành công', data: data, result: 0 })
    } catch (e) {
        return res.status(401).json({ message: 'Thất bại', result: -1 })

    }
})

Courses.post('/updateCourse', async (req: AuthRequest, res: Response): Promise<any> => {
    const { category, description, price, id, title } = req.body
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        let data = await UpdateCourse({ description, price, id, title, category, thumbnail: req.file?.filename || '' })
        return res.status(200).json({ message: 'Thành công', data: data, result: 0 })

    } catch (e) {
        return res.status(401).json({ message: 'Thất bại', result: -1 })

    }
})
