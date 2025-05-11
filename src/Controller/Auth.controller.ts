import { Role } from "../Model/IBase";
import { UpdateUserModel, User, UserLoginRes, UserRegister } from "../Model/User.model";

import { runQuery } from "../server";
import bcrypt from 'bcrypt'

export const register = async (user: UserRegister): Promise<User> => {
    const { user_name, password, full_name } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (user_name, password,full_name, role)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const res = await runQuery(query, [
        user_name,
        hashedPassword,
        full_name,
        'student'
    ]);
    return res?.rows[0];
};

export const login = async (username: string, password: string): Promise<UserLoginRes | null> => {
    const query = `Select id,user_name,password,full_name,role FROM users WHERE user_name = $1`;
    try {
        const res = await runQuery(query, [username]);
        console.log(res?.rows[0])
        if (res?.rows.length === 0) {
            return null
        }
        const user = res?.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return null;
        }

        return {
            id: user.id,
            user_name: user.user_name,
            full_name: user.full_name,
            role: user.role
        } as UserLoginRes; // Trả về thông tin user

    } catch (error) {
        console.log(error)
        return null
    }
}

export const getUserByUsername = async (user_name: string) => {
    const query = `
    SELECT * FROM users WHERE user_name = $1;
  `;
    const res = await runQuery(query, [user_name]);

    return res?.rows[0];

};
export const getUserByID = async (id: number) => {
    const query = `
    SELECT * FROM users WHERE id = $1;
  `;
    const res = await runQuery(query, [id]);

    return res?.rows[0];

};

export const getUserbyTeacher = async () => {
    const query = `
    SELECT * FROM users WHERE role = 'teacher';
  `;
    const res = await runQuery(query, [])
    return res?.rows
}

export const CountAccount = async (role: string) => {
    const query = `SELECT COUNT(*) as total FROM users where role = $1`
    const res = await runQuery(query, [role])
    return res?.rowCount!
}
export const SelectAcount = async (limit: number, offset: number, role: string = Role.Student) => {
    console.log(limit, offset)
    const query = `SELECT id, full_name, user_name, role, avatar, created_at FROM users  where role = $3 ORDER BY id ASC LIMIT $1 OFFSET $2`
    const res = await runQuery(query, [limit, offset, role])
    return res?.rows
}


export const updateUser = async (user: UpdateUserModel) => {
    console.log('course', user);
    const query = `
   UPDATE users SET user_name = $1,full_name = $2,avatar = $3,password = $4,role = $5 Where id = $6 RETURNING *;
  `;
    const res = await runQuery(query, [
        user.user_name,
        user.full_name,
        user.avatar,
        user.password,
        user.role,
        user.id
    ])
    return res?.rows[0]
}