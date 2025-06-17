import express, { Response } from "express";
import { AuthRequest } from "../MiddleWare/auth.middleware";
import { DeleteLesson, getLessonByID, GetLessonById, GetLessonByIdLesson, GetLessonByOrderIndex, InsertLessonByIdCourse, updateLessonByID, updateOrIndex } from "../Controller/Lesson.controller";
import { Result } from "../Model/IBase";
export const LessonRouter = express.Router();

LessonRouter.post('/lesson', async (req: AuthRequest, res: Response): Promise<any> => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }; // Ép kiểu cho req.files

    const videoFile = files?.video_url?.[0];  // Lấy file video_url (nếu có)
    const bannerFile = files?.banner?.[0];    // Lấy file banner (nếu có)
    const { title, course_id, content, order_index } = req.body
    try {

        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const lesson = await GetLessonById(course_id)

        if (order_index) {
            const getLessonByOrder = await GetLessonByOrderIndex(course_id, order_index)
            if (getLessonByOrder) {
                let Index = order_index
                lesson.map(async item => {
                    if (item.order_index >= order_index) {
                        await updateOrIndex(++Index, item.id)
                    }
                })
                const data = await InsertLessonByIdCourse({ title: title, content: content, course_id: course_id, order_index: order_index, video_url: videoFile?.filename || '', banner: bannerFile.filename })
                const PlayList = await GetLessonById(course_id)
                return res.status(200).json({ message: 'Thành công update Orindex', data: PlayList, result: 0 })
            }
        }
        if (lesson.length && lesson[lesson.length - 1].order_index) {
            const data = await InsertLessonByIdCourse({ title: title, content: content, course_id: course_id, order_index: lesson[lesson.length - 1].order_index + 1, video_url: videoFile?.filename || '', banner: bannerFile.filename })
            const PlayList = await GetLessonById(course_id)
            return res.status(200).json({ message: 'Thành công', data: PlayList, result: 0 })

        } else {
            const data = await InsertLessonByIdCourse({ title: title, content: content, course_id: course_id, order_index: 1, video_url: videoFile?.filename || '', banner: bannerFile.filename })
            const PlayList = await GetLessonById(course_id)

            return res.status(200).json({ message: 'Thành công', data: PlayList, result: 0 })
        }
    } catch (e) {
        return res.status(401).json({ message: 'Thất bại', result: -1 })

    }
})

LessonRouter.post('/getPlayListbyID', async (req: AuthRequest, res: Response): Promise<any> => {
    const { idCourse } = req.body
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const data = await GetLessonById(idCourse)
        return res.status(200).json({
            message: 'Thành công', data: data,
            result: 0
        })
    } catch (e) {
        return res.status(401).json({ message: 'Thất bại', result: -1 })

    }
})

LessonRouter.post('/getLesson', async (req: AuthRequest, res: Response): Promise<any> => {
    const { idLesson, idCourse } = req.body
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const data = await getLessonByID(idLesson, idCourse)
        return res.status(200).json({
            message: 'Thành công', data: data,
            result: 0
        })
    } catch (e) {
        return res.status(401).json({ message: 'Thất bại', result: -1 })

    }
})
LessonRouter.post('/updateLesson', async (req: AuthRequest, res: Response): Promise<any> => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }; // Ép kiểu cho req.files

    const videoFile = files?.video_url?.[0];  // Lấy file video_url (nếu có)
    const bannerFile = files?.banner?.[0];    // Lấy file banner (nếu có)
    const { id, title, course_id, content } = req.body
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const lesson = await GetLessonByIdLesson(id)
        const data = await updateLessonByID({ id: id, title: title, content: content, video_url: videoFile ? videoFile.filename : lesson.video_url, banner: bannerFile ? bannerFile.filename : lesson.banner })
        return res.status(200).json({
            message: 'Thành công', data: data,
            result: Result.Succes
        })
    } catch (e) {
        return res.status(401).json({ message: 'Thất bại', result: -1 })

    }
})

LessonRouter.post('/deleteLesson', async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const lessonByID = await GetLessonByIdLesson(req.body.id)
        let Index = lessonByID.order_index
        const lesson = await GetLessonById(lessonByID.course_id)
        lesson.map(async item => {
            if (item.order_index > lessonByID.order_index) {
                await updateOrIndex(Index++, item.id)
            }
        })
        const lessonDelete = await DeleteLesson(req.body.id)
        if (!lessonDelete) {
            return res.status(201).json({ message: 'Thất bại' });
        }
        if (lessonDelete) {
            return res.status(200).json({
                message: 'Thành công', data: lessonDelete,
                result: Result.Succes
            })
        }
    } catch (e) {
        return res.status(401).json({ message: 'Thất bại', result: -1 })

    }
})
