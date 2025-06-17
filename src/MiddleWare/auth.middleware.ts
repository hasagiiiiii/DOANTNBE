import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { updateToken } from "../Controller/Token.controller";

export interface UserToken {
    id: number;
    role: string;
};
export interface AuthRequest extends Request {
    user?: UserToken
}
export const verifyTokenMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const RefreshToken = req.cookies.refeshToken;
    jwt.verify(
        RefreshToken,
        "TrendyT",
        (err: jwt.VerifyErrors | null, decoded: any) => {
            if (err) {
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
                return res.status(200).json({ result: -2, data: [], message: "RefreshToken không hợp lệ" });
            }

            // Kiểm tra kiểu dữ liệu cho decoded và chuyển nó sang kiểu User nếu cần
            const u = decoded as UserToken;
            const newAccessToken = jwt.sign(
                { id: u.id, role: u.role },
                "TrendyT",
                { expiresIn: "1h" }
            );
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 3600000, // 1 giờ
            });

            req.user = { id: u.id, role: u.role };
            next();
        }
    );
};
