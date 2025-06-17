import express, { Response } from "express";
import { AuthRequest } from "../MiddleWare/auth.middleware";
import { DeleteUserInCourse, getUserJoin, getUserJoined, JoinCourse } from "../Controller/enrollment.controller";
import { getUserByUsername } from "../Controller/Auth.controller";
import { Result, Role } from "../Model/IBase";
export const EnrollmentRouter = express.Router();

EnrollmentRouter.post('/joinCourse', async (req: AuthRequest, res: Response): Promise<any> => {
    const { idCourse } = req.body
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const userJoinCourse: any[] = await getUserJoined(idCourse)
        let isJoin: boolean = false
        userJoinCourse.map(user => {
            if (user.user_id == req.user?.id) {
                isJoin = true
            }
        })
        console.log(isJoin);
        if (isJoin) {
            return res.status(200).json({ message: "Đã Join", result: 0, data: [] })


        } else {

            await JoinCourse(req.user.id, idCourse)
            return res.status(200).json({ message: "Thành công", result: 0, data: [] })

        }

    } catch (error) {
        return res.status(200).json({ message: "error", result: -2, data: [] })

    }
})

EnrollmentRouter.post('/addUsertoRoom', async (req: AuthRequest, res: Response): Promise<any> => {
    const { idCourse, user_name } = req.body
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        console.log('vao day');
        const user = await getUserByUsername(user_name)
        const userJoinCourse: any[] = await getUserJoined(idCourse)
        let isJoin: boolean = false
        console.log(user, userJoinCourse);
        userJoinCourse.map(item => {
            if (item.user_id == user?.id) {
                isJoin = true
            }
        })
        if (isJoin) {
            return res.status(200).json({ message: "Đã Join", result: -1, data: [] })


        } else {

            await JoinCourse(user.id, idCourse)
            let listUser = await getUserJoin(idCourse)
            return res.status(200).json({ message: "Thành công", result: 0, data: listUser })

        }

    } catch (error) {
        return res.status(200).json({ message: "error", result: 1, data: [] })

    }
})

EnrollmentRouter.post('/deleteUserJoin', async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (req.user.role == Role.Teacher) {
            const { user_id, course_id } = req.body
            const userDelete = await DeleteUserInCourse(user_id, course_id)
            return res.status(200).json({ message: "Thành công", result: Result.Succes, data: userDelete })
        } else {

        }
    } catch (e) {
        return res.status(200).json({ message: "error", result: Result.Faile, data: [] })

    }
})