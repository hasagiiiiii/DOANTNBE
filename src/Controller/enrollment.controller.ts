import { runQuery } from "../server"

export const JoinCourse = async (id_user: number, course_id: number): Promise<any> => {
    const query = `
       Insert into enrollments(course_id,user_id) values ($1,$2)
    `
    const res = await runQuery(query, [course_id, id_user])
    return res?.rows[0]
}
export const UpdateCourse = async (id_user: number, course_id: number): Promise<any> => {
    const query = `
       Insert into enrollments(course_id,user_id) values ($1,$2)
    `
    const res = await runQuery(query, [id_user])
    return res?.rows[0]
}

export const getUserJoin = async (course_id: number): Promise<any> => {
    const query = `
       Select users.user_name,users.id, users.avatar , courses.teacher_id as teacher from enrollments 
       Join courses on enrollments.course_id = courses.id 
       Join users on enrollments.user_id = users.id where enrollments.course_id = $1
    `
    const res = await runQuery(query, [course_id])
    return res?.rows
}

export const getUserJoined = async (course_id: number): Promise<any> => {
    const query = `
       select * from enrollments where course_id = $1
    `
    const res = await runQuery(query, [course_id])
    return res?.rows
}

export const getCourseUserJoined = async (user_id: number): Promise<any> => {
    const query = `
       SELECT  course_id FROM enrollments where user_id = $1 ;
    `
    const res = await runQuery(query, [user_id])
    return res?.rows
}

export const DeleteUserInCourse = async (user_id: number, course_id: number): Promise<any> => {
    const query = `
       DELETE FROM enrollments
	WHERE user_id = $1 AND course_id = $2 RETURNING *; ;
    `
    const res = await runQuery(query, [user_id, course_id])
    return res?.rows[0]
}