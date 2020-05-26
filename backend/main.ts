import Knex from "knex";
import express, { Request, Response } from "express";
import path from "path";
// import expressSession from 'express-session'
import bodyParser from "body-parser";
import multer from "multer"; // auto change the photo filename and put photo file to upload folder
//@ts-ignore
import * as services from './services';
//@ts-ignore
import * as routers from './routers';
import cors from 'cors'
import { UserService } from "./services/UserService";
import { UserRouter } from "./routers/UserRouter";
import { GuestService } from "./services/GuestService";
import { GuestRouter } from "./routers/GuestRouter";
import { AuthRouter } from "./routers/AuthRouter";
import { PersonInfo } from "./models/AuthInterface";
import { AuthService } from "./services/AuthService";
<<<<<<< HEAD
import SocketIO from "socket.io";
import http from 'http';
import { LiveRouter } from "./routers/LiveRouter";
=======
import { LiveRouter } from "./routers/LiveRouter";
import SocketIO from "socket.io";
import http from 'http';
>>>>>>> 79f721e21516676d5236cf176fc871f1a8b1e27f

declare global {
  namespace Express {
    interface Request {
      personInfo?: PersonInfo
    }
  }
}

const app = express();
const server = http.createServer(app);
const io = SocketIO(server)

/* Enable cors */
app.use(cors({
    origin: [
      'http://localhost:3000',
      'https://localhost:3000'
    ]
  }))

/* Database configuration */
const knexConfig = require("./knexfile");
//@ts-ignore
const knex = Knex(knexConfig[process.env.NODE_ENV || "development"]);

/* Multer configuration */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${req.body.projectID}-${Date.now()}.${file.mimetype.split("/")[1]}`
    ); // category and dish refer to html form name tag
  },
});
//@ts-ignore
const upload = multer({ storage: storage });

/* DAO */
const questionDAO = new services.QuestionDAO(Knex(knexConfig["testing"]));
const replyDAO = new services.ReplyDAO(Knex(knexConfig["testing"]));

/* Services */
const userService = new UserService(knex);
const guestService = new GuestService(knex);
const authService = new AuthService(knex);
const questionService = new services.QuestionService(questionDAO, replyDAO);



/* Routers */
const userRouter = new UserRouter(userService);
const guestRouter = new GuestRouter(guestService);
const authRouter = new AuthRouter(userService, guestService,authService);
const questionRouter = new routers.QuestionRouter(questionService, upload,io);
const liveRouter = new LiveRouter();

/* Session */
// app.use(
//     expressSession({
//         secret: 'project 3',
//         resave: false,
//         saveUninitialized: false,
//     })
// );

/* Serve files */
app.use(express.static(path.join(__dirname, "uploads")));

/* Body parser */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Routes */
//@ts-ignore
const API_VERSION = "/api/v1";
app.use('/auth', authRouter.router())
app.use('/user', userRouter.router())
app.use('/guest', guestRouter.router())
app.use('/video', liveRouter.router())
app.get('/test/callback', (req:Request, res: Response)=>{
    return res.status(200).json({message: req.query})
})
app.use('/rooms', questionRouter.router());

/* Socket Io */
io.on('connection', socket => {
  socket.on('join_event', (meetingId: number) => {
    socket.join('event:' + meetingId)
  })
  socket.on('leave_event', (meetingId: number) => {
    socket.leave('event:' + meetingId)
  })
});

/* Listening port */
const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
server.listen(PORT, () => {
  console.log(`listening to ${PORT}`);
});