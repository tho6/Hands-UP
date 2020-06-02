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
import { LiveRouter } from "./routers/LiveRouter";
import { MeetingService } from "./services/MeetingService";
import { MeetingRouter } from "./routers/MeetingRouter";
import SocketIO from "socket.io";
import http from 'http';
import { authenticateGuestToken, authenticateUserToken } from "./guard";
import { ReportRouter } from "./routers/ReportRouter";
import { ReportService } from "./services/ReportService";
// import redis from 'redis';
// const client = redis.createClient();


declare global {
  namespace Express {
    interface Request {
      personInfo?: PersonInfo,
      youtubeRefreshToken:string;
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
      `${req.params.id}-${Date.now()}.${file.mimetype.split("/")[1]}`
    ); // category and dish refer to html form name tag
  },
});
//@ts-ignore
const upload = multer({ storage: storage });

/* DAO */
const questionDAO = new services.QuestionDAO(knex);
const replyDAO = new services.ReplyDAO(knex);

/* Services */
const userService = new UserService(knex);
const guestService = new GuestService(knex);
const authService = new AuthService(knex);
const questionService = new services.QuestionService(questionDAO, replyDAO);
const meetingService = new MeetingService(knex);
const reportService = new ReportService(knex)

/* Routers */
const userRouter = new UserRouter(userService);
const guestRouter = new GuestRouter(guestService);
const authRouter = new AuthRouter(userService, guestService, authService);
const questionRouter = new routers.QuestionRouter(questionService, upload, io);
const liveRouter = new LiveRouter(questionService, io, userService);
const meetingRouter = new MeetingRouter(meetingService);
const reportRouter = new ReportRouter(reportService);

//guard
const isGuest = authenticateGuestToken(guestService)
//@ts-ignore
const isUser = authenticateUserToken(userService, guestService)
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
app.use('/live', liveRouter.router())
app.use('/report', isUser, reportRouter.router())
app.use('/rooms', isGuest, questionRouter.router());
// app.use(`${API_VERSION}/meetings`, meetingRouter.router())
app.use('/meetings', meetingRouter.router())

/* Socket Io */
let counter: { [id: string]: { count: number, counting: boolean } } = {}
io.on('connection', socket => {
  socket.on('join_event', (meetingId: number) => {
    console.log('join room:' + meetingId);
    const idx = 'event:' + meetingId;
    socket.join(idx)
    if (counter[idx]) {
      counter[idx].count += 1;
      if (!counter[idx].counting) {
        counter[idx].counting = true;
        setTimeout(() => {
          counter[idx].counting = false;
          io.in(idx).emit('update-count', counter[idx].count);
        }, 3000)
      }
    } else {
      counter[idx] = { count: 1, counting: true };
      setTimeout(() => {
        counter[idx].counting = false;
        io.in(idx).emit('update-count', counter[idx].count);
      }, 3000)
    }
  });
  socket.on('leave_event', (meetingId: number) => {
    console.log('leave room:' + meetingId);
    const idx = 'event:' + meetingId;
    socket.leave(idx);
    if (!counter[idx]) return;
    counter[idx].count -= 1;
    if (!counter[idx].counting) {
      counter[idx].counting = true;
      setTimeout(() => {
        counter[idx].counting = false;
        io.in(idx).emit('update-count', counter[idx].count);
      }, 3000)
    }
  });
  socket.on('join-host', (userId:number)=>{
    console.log('join host'+userId);
    socket.join('host:' + userId)
  })
  socket.on('leave-host', (userId:number)=>{
    console.log('leave host'+userId);
    socket.leave('host:' + userId)
  })
});

/* Listening port */
const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
server.listen(PORT, () => {
  console.log(`listening to ${PORT}`);
});