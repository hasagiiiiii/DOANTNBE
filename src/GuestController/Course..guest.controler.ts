import { Request, Response, Router } from "express";
import { AuthRequest } from "../MiddleWare/auth.middleware";
import { SelectCourses } from "../Controller/Course.controller";

export const CoursesGuest = Router();


CoursesGuest.get('/course', async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const course = await SelectCourses()
        return res.status(200).json({ message: 'Thành công', data: course, result: 0 })
    } catch (e) {
        return res.status(401).json({ message: 'Thất bại', data: [], result: -1 })

    }
})