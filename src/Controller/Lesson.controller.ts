import { LessonItem, LessonItemInsert, LessonItemUpdate } from "../Model/Lesson.model"
import { runQuery } from "../server"

export const GetAllLesson = async (id_user: number): Promise<any> => {
    const query = `
        Select * from tokenauthent where id_user = $1
    `
    const res = await runQuery(query, [id_user])
    return res?.rows[0]
}

export const GetLessonById = async (id_course: number): Promise<LessonItem[]> => {
    const query = `
    Select * from lessons where course_id = $1 ORDER BY  order_index
    `
    const res = await runQuery(query, [id_course])
    return res?.rows as LessonItem[]
}
export const GetLessonByOrderIndex = async (id_course: number, orderIndex: number): Promise<LessonItem> => {
    const query = `
    Select * from lessons where course_id = $1 AND order_index = $2 ORDER BY  order_index
    `
    const res = await runQuery(query, [id_course, orderIndex])
    return res?.rows[0] as LessonItem
}

export const GetLessonByIdLesson = async (id_course: number): Promise<LessonItem> => {
    const query = `
    Select * from lessons where id = $1
    `
    const res = await runQuery(query, [id_course])
    return res?.rows[0] as LessonItem
}
export const InsertLessonByIdCourse = async (lesson: LessonItemInsert) => {
    const query = `Insert into lessons(title,course_id,video_url,"content",order_index,banner) values ($1,$2,$3,$4,$5,$6) RETURNING *
`
    const res = await runQuery(query, [lesson.title, lesson.course_id, lesson.video_url, lesson.content, lesson.order_index, lesson.banner])
    return res?.rows[0]
}

export const getLessonByID = async (id: number, idCourse: number) => {
    const query = `select lessons.id ,lessons.title,lessons."content",lessons.created_at, lessons.video_url , users."role",users.avatar, users.user_name from lessons JOIN courses on lessons.course_id = courses.id JOIN users on courses.teacher_id = users.id where lessons.id= $1 AND lessons.course_id = $2
`
    const res = await runQuery(query, [id, idCourse])
    return res?.rows[0]
}
export const updateOrIndex = async (orderIndex: number, id: number) => {
    const query = `
    UPDATE lessons
	SET order_index = $1
	WHERE id=$2 RETURNING *
        `
    const res = await runQuery(query, [orderIndex, id])
}
export const updateLessonByID = async (lesson: LessonItemUpdate) => {
    const query = ` UPDATE lessons
	SET  title=$1, video_url=$2, content=$3, banner = $4
	WHERE id=$5 RETURNING *`
    const res = await runQuery(query, [lesson.title, lesson.video_url, lesson.content, lesson.banner, lesson.id])
    return res?.rows[0]
}

export const DeleteLesson = async (id: number) => {
    const query = 'DELETE FROM lessons WHERE id= $1 RETURNING *'
    const res = await runQuery(query, [id])
    return res?.rows[0]
}