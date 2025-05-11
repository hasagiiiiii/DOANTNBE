import express, { Request, Response } from "express";
import { AuthRequest } from "../MiddleWare/auth.middleware";
import { CountAccount, getUserByID, getUserbyTeacher, getUserByUsername, SelectAcount, updateUser } from "../Controller/Auth.controller";
import { Result, Role } from "../Model/IBase";
import bcrypt from 'bcrypt'
export const UserRouter = express.Router();
UserRouter.get('/profile', async (req: AuthRequest, res: Response) => {
    const user = req.user
    try {
        const data = await getUserByID(user?.id!)

        res.json({ message: "Succes", data: data, result: Result.Succes });
    } catch (err) {
        res.json({ message: "Faile", data: [], result: Result.Faile });

        console.log(err);
    }
})

UserRouter.get('/getTeacher', async (req: AuthRequest, res: Response) => {
    const user = req.user
    if (user?.role !== 'admin') {
        res.status(500).json({ message: 'Authuorze' })
    }
    const teachers = await getUserbyTeacher()
    res.status(200).json({ message: 'Thành cônng' })
})


UserRouter.post('/getStudent', async (req: AuthRequest, res: Response) => {
    const user = req.user
    console.log(req.user)
    try {
        if (user?.role == 'admin') {
            const page = parseInt(req.body.page) || 1;
            const limit = parseInt(req.body.limit) || 10;
            const offset = (page - 1) * limit;
            const CountStudent = await CountAccount(Role.Student)
            const totalPages = Math.ceil(CountStudent / limit);
            const Listudent = await SelectAcount(limit, offset, Role.Student)
            res.status(200).json({ message: 'Thành Công', result: Result.Succes, data: { total: totalPages, students: Listudent, } })
        } else {
            res.status(401).json({ message: 'Thành Công', result: Result.Auth, data: [] })
        }
    } catch (e) {
        res.status(500).json({ message: 'Thành Công', result: Result.Faile, data: e })
    }
})

UserRouter.post('/getTeacher', async (req: AuthRequest, res: Response) => {
    const user = req.user
    console.log(req.user)
    try {
        if (user?.role == 'admin') {
            const page = parseInt(req.body.page) || 1;
            const limit = parseInt(req.body.limit) || 10;
            const offset = (page - 1) * limit;
            const CountStudent = await CountAccount(Role.Teacher)
            const totalPages = Math.ceil(CountStudent / limit);
            const Listudent = await SelectAcount(limit, offset, Role.Teacher)
            res.status(200).json({ message: 'Thành Công', result: Result.Succes, data: { total: totalPages, teachers: Listudent, } })
        } else {
            res.status(401).json({ message: 'Thành Công', result: Result.Auth, data: [] })
        }
    } catch (e) {
        res.status(500).json({ message: 'Thành Công', result: Result.Faile, data: e })
    }

})
UserRouter.post('/updateUser', async (req: AuthRequest, res: Response) => {
    const user = req.user
    console.log(req.user)
    const { id, user_name, full_name, password, role } = req.body
    if (user?.role == 'admin') {
        const user = await getUserByID(req.user!.id)
        try {
            const hashpassword = await bcrypt.hash(password, 10);
            const userUpdate = await updateUser({ id: id, user_name: user_name, full_name: full_name, role: role, avatar: req.file ? req.file.filename : user.avatar, password: hashpassword ? hashpassword : user.password })
            res.status(200).json({ message: 'Thành Công', result: Result.Succes, data: userUpdate })

        } catch (error) {
            res.status(401).json({ message: 'Thành Công', result: Result.Auth, data: [] })

        }
    } else {
        res.status(401).json({ message: 'Thành Công', result: Result.Auth, data: [] })
    }
})