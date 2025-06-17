import { Request, Response, Router } from "express";
import { AuthRequest } from "../MiddleWare/auth.middleware";
import { InsertCourse, SelectCourseByID, SelectCourseByID2, SelectCourseByIDUser, SelectCourses, UpdateCourse } from "../Controller/Course.controller";
import { getQuizzes } from "../Controller/Quizzes.controller";
import { getCourseUserJoined, getUserJoin } from "../Controller/enrollment.controller";
import { ViewScore, ViewScoreStudent } from "../Controller/User_quiz_result.controller";
import { Result } from "../Model/IBase";

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

Courses.post('/getAccountInCourse', async (req: AuthRequest, res: Response): Promise<any> => {
    const { idCourse } = req.body
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const UserInRoom = await getUserJoin(idCourse)
        if (UserInRoom.length == 0) {
            return res.status(200).json({ message: 'Thành công', data: [], result: 0 })

        }
        if (UserInRoom && UserInRoom[0].teacher == req.user.id) {
            return res.status(200).json({ message: 'Thành công', data: UserInRoom, result: 0 })
        }


    } catch (e) {
        return res.status(401).json({ message: 'Thất bại', result: -1 })

    }
})


Courses.post('/ViewScore', async (req: AuthRequest, res: Response) => {
    try {
        const { course_id } = req.body
        const Scores = await ViewScore(course_id)
        if (Scores) {
            res.status(200).json({ result: Result.Succes, message: 'Thành Công', data: Scores })
        }
    } catch (e) {
        console.error(e)
        res.status(400).json({ result: Result.Faile, message: 'Thành Công', data: [] })
    }
})
Courses.post('/ViewScoreStudent', async (req: AuthRequest, res: Response) => {
    try {
        const Scores = await ViewScoreStudent(req.user?.id!)
        if (Scores) {
            res.status(200).json({ result: Result.Succes, message: 'Thành Công', data: Scores })
        }
    } catch (e) {
        console.error(e)
        res.status(400).json({ result: Result.Faile, message: 'Thành Công', data: [] })
    }
})
Courses.post('/getCoursebyStudent', async (req: AuthRequest, res: Response) => {
    try {
        let data: any[] = []
        const courses: { course_id: number }[] = await getCourseUserJoined(req.user?.id!)
        for (const item of courses) {
            const a = await SelectCourseByID(item.course_id)
            data.push(a[0])
        }
        console.log(data);
        res.status(200).json({ result: Result.Succes, message: 'Thành Công', data: data })
    } catch (e) {
        console.error(e)
        res.status(400).json({ result: Result.Faile, message: 'Thành Công', data: [] })
    }
})