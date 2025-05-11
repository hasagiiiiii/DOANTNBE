export interface User {
    id: number;
    user_name: string;
    full_name: string;
    password: string;
    sex: number;
    avatar: string;
    role: string;
    create_at: Date;
}
export interface UserRegister {
    user_name: string;
    full_name: string;
    password: string;
}
export interface UserLoginRes {
    id: number,
    user_name: string;
    full_name: string;
    role: string;
}
export interface UpdateUserModel {
    id: number;
    user_name: string;
    full_name: string;
    password: string;
    avatar: string;
    role: string;
    create_at?: Date;
}