import express, { Request, RequestHandler, Response } from "express";
import cors from "cors";
import http from 'http';
import { AuthRouter } from "./Router/Auth.router";
import cookieParser from "cookie-parser";
import * as env from "dotenv"
import multer, { FileFilterCallback } from "multer";
import { verifyTokenMiddleware } from "./MiddleWare/auth.middleware";
import path from "path";
import { Server, Socket } from "socket.io";
import fs from "fs";
import { Courses } from "./Router/Courses.router";
import { Category } from "./Router/Category.router";
import { LessonRouter } from "./Router/Lesson.router";
import { UserRouter } from "./Router/User.router";
import { Quizzes } from "./Router/Quizzes.router";
import { QuestionRouter } from "./Router/Question.router";
import { EnrollmentRouter } from "./Router/Enrollments.router";
import { Answer } from "./Router/Answer.router";
import { CoursesGuest } from "./GuestController/Course..guest.controler";
const app = express()
const server = http.createServer(app)
const port = 3001
const corsOptions = {
    origin: ["http://localhost:3000", 'http://trendyt'], // frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // cookie, HTTP Authentication
    optionsSuccessStatus: 204,
};
// const corsOptions = {
//     origin: ["http://192.168.2.10", 'http://trendyt'], // địa chỉ thật frontend đang gọi API
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
//     optionsSuccessStatus: 204,
// };
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Phải khớp với client
        methods: ["GET", "POST"], // Chỉ định các phương thức được phép
        credentials: true,
    },
});
env.config()
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


// Tạo thư mục lưu trữ nếu chưa có
const UPLOADS_DIR = "uploads";
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

// ✅ Cấu hình fileFilter chỉ cho phép ảnh và video
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
        cb(null, true);
    } else {
        cb(new Error("Chỉ được upload ảnh hoặc video!"));
    }
};

// ✅ Cấu hình Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

export const upload = multer({ storage, fileFilter });
app.use("/api", AuthRouter, Category)
app.use('/quizzes', verifyTokenMiddleware, Quizzes)
app.use('/question', verifyTokenMiddleware, QuestionRouter)
app.use('/courses', upload.single("thumbnail"), verifyTokenMiddleware, Courses)
app.use('/enrollment', verifyTokenMiddleware, EnrollmentRouter)
app.use('/answer', verifyTokenMiddleware, Answer)
app.use('/guest', CoursesGuest)
// app.use('/course', upload.single("video_url"), verifyTokenMiddleware, LessonRouter)
app.use('/lesson', upload.fields([
    { name: "video_url", maxCount: 1 },
    { name: "banner", maxCount: 1 }
]), verifyTokenMiddleware, LessonRouter);
app.get('/test', (req: any, res: any) => {
    res.status(200).json({ message: 'Test' })
})
app.use('/user', upload.single("avartar"), verifyTokenMiddleware, UserRouter)
// ✅ Sử dụng upload.single() trong `app.post()`, không dùng `app.use()`
app.post("/upload", upload.single("file"), (req: Request, res: Response): any => {
    if (!req.file) {
        return res.status(400).json({ error: "File không hợp lệ!" });
    }
    res.json({ url: `http://localhost:${port}/uploads/${req.file.filename}` });
});
app.use("/uploads", cors(corsOptions), express.static(UPLOADS_DIR));



io.on("connection", (socket) => { // connect
    // socket.on("createRoom", (idUser) => {

    //     socket.emit("createRoomResponse", Room);
    //     socket.join(Room)

    // });

    socket.on("joinCourse", (idUser, courseId) => {
        socket.join(courseId);
        socket.to(courseId).emit('userconnected', idUser);
    })
    socket.on("toggleCamera", (idUser, courseId, isActiveCamera) => {
        socket.broadcast.to(courseId).emit("toggleCameraInRoom", idUser, isActiveCamera)
    })

    socket.on("toggleMic", (idUser, courseId, isActiveMic) => {
        socket.broadcast.to(courseId).emit("toggleMicInRoom", idUser, isActiveMic)
    })
    socket.on("shareScreen", (idUser, courseId) => {
        socket.broadcast.to(courseId).emit("shareScreen", idUser)
    })
    // socket.on("shareScreen",(idUser,roomId,screenStream)=>{
    //     socket.broadcast.to(roomId).emit("shareScreenInRoom",idUser,screenStream)
    //     console.log("ShareScreen",screenStream)
    // })  
    // socket.on("stopShareScreen",(idUser,roomId)=>{
    //     socket.broadcast.to(roomId).emit("stopShareScreenInRoom",idUser)
    // })
    socket.on("disconnect", () => {
    });
});

app.get('/', (req, res) => {
    res.send('Hello from trendyt!');
});
server.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});


