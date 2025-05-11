import express, { Request, Response } from "express";
import { getUserByUsername, login, register } from "../Controller/Auth.controller";
import jwt from "jsonwebtoken";
import { UserLoginRes } from "../Model/User.model";
import { getToken, insertToken, updateToken } from "../Controller/Token.controller";
export const AuthRouter = express.Router();

AuthRouter.post('/register', async (req: Request, res: Response): Promise<any> => {
    const { user_name, password, full_name } = req.body
    try {
        const oldUser = await getUserByUsername(user_name);
        if (oldUser) {
            return res.status(400).json({ message: "User already exists" })
        }
        const user = await register({ user_name, password, full_name })
        console.log(user);
        res.status(200).json({ result: 0, message: 'thành công ' })
    } catch (error) {
        res.status(500).json({ message: 'that bai  ' })
    }
})

AuthRouter.post('/login', async (req: Request, res: Response): Promise<any> => {
    const { user_name, password } = req.body
    try {
        const user: UserLoginRes | null = await login(user_name, password)
        if (user == null) {
            return res.status(400).json({ message: "User not found" })
        }
        if (user != null) {
            const token = jwt.sign(
                {
                    id: user.id,
                    full_name: user.full_name,
                    role: user.role
                },
                process.env.Process_Secret_Key as string,
                {
                    expiresIn: "1h",
                }

            )
            const Refeshtoken = jwt.sign(
                { id: user.id, full_name: user.full_name, role: user.role },
                process.env.Process_Secret_Key as string,
                {
                    expiresIn: "24h",
                }
            );
            const getRefesh = await getToken(user.id)
            if (getRefesh) {
                try {
                    await updateToken(Refeshtoken, user.id)
                } catch (e) {
                    console.log(e);
                }
            } else {
                try {
                    await insertToken(Refeshtoken, user.id)
                } catch (e) {
                    console.log(e);
                }
            }
            res.cookie('accessToken', token, {
                httpOnly: true,
                expires: new Date(Date.now() + 60 * 60 * 1000), // 1h,
                path: '/',
                secure: false,
                sameSite: "strict",
            })
            res.cookie('refeshToken', Refeshtoken, {
                httpOnly: true,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1h,
                path: '/',
                secure: false,
                sameSite: "strict",
            })
            res.status(200).json({ result: 0, data: user, message: 'thành công ' })
        }
    } catch (error) {
        res.status(500).json({ message: 'that bai  ' })
    }
})

AuthRouter.post('/logout', (req: Request, res: Response) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    })
    res.clearCookie("refeshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });
    res.clearCookie("user")
    res.json({ message: "Logged out successfully" });
})