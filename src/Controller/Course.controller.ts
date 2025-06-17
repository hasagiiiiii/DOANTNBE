import { InsertCourses, UDCourse } from "../Model/Course";
import { runQuery } from "../server";
export const InsertCourse = async (courses: InsertCourses) => {
    const query = `
          INSERT INTO courses  (title , description ,teacher_id, price,thumbnail,category  )
          VALUES ($1, $2, $3, $4 , $5,$6) RETURNING *;
        `;
    const res = await runQuery(query, [
        courses.title,
        courses.description,
        courses.teacher_id,
        courses.price,
        courses.thumbnail,
        courses.category
    ]);
    return res?.rows[0];
}

export const UpdateCourse = async (courses: UDCourse) => {
    const query = `
   UPDATE courses SET title = $1,description =$2,price=$3,thumbnail=$4,category=$5 Where id = $6 RETURNING *;
  `;
    const res = await runQuery(query, [
        courses.title,
        courses.description,
        courses.price,
        courses.thumbnail,
        courses.category,
        courses.id

    ])
    return res?.rows[0]
}
export const SelectCourses = async () => {
    const query = `
    Select courses.id,courses.title,courses.description,courses.category,courses.created_at,courses.thumbnail,courses.price,users.user_name,users.avatar from courses JOIN users on courses.teacher_id = users.id  ORDER BY courses.id ASC
    `;
    const res = await runQuery(query, [])
    return res?.rows
}
export const SelectCourseByIDUser = async (idUser: number) => {
    const query = `
    SELECT * FROM courses WHERE teacher_id = $1 ORDER BY id ASC
    `;
    const res = await runQuery(query, [idUser]);
    return res?.rows;
}
export const SelectCourseByID = async (idCourse: number) => {
    const query = `
   Select courses.id,courses.title,courses.description,courses.category,courses.created_at,courses.thumbnail,courses.price,users.user_name,users.avatar from courses JOIN users on courses.teacher_id = users.id Where courses.id = $1  ORDER BY courses.id ASC
    `;
    const res = await runQuery(query, [idCourse]);
    return res!.rows;
}

export const SelectCourseByID2 = async (idCourse: number) => {
    const query = ` Select * from courses where id = $1
     `;
    const res = await runQuery(query, [idCourse]);
    return res?.rows[0];
}
export const DeleteCourse = async (idCourse: number) => {
    const query = `
    DELETE FROM courses WHERE id = $1 RETURNING *;
    `;
    const res = await runQuery(query, [idCourse]);
    return res?.rows[0];
}