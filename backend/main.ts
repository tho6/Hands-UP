import Knex from "knex";
import express from "express";
import path from "path";
import expressSession from 'express-session'
import bodyParser from "body-parser";
import multer from "multer"; // auto change the photo filename and put photo file to upload folder
//@ts-ignore
import * as services from './services';
//@ts-ignore
import * as routers from './routes';
import cors from 'cors'

const app = express();

/* Enable cors */
app.use(cors({
    origin: [
      'http://localhost:3000',
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


/* Services */


/* Routers */


/* Session */
app.use(
    expressSession({
        secret: 'project 3',
        resave: false,
        saveUninitialized: false,
    })
);

/* Serve files */
app.use(express.static(path.join(__dirname, "uploads")));

/* Body parser */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Routes */
//@ts-ignore
const API_VERSION = "/api/v1";


/* Listening port */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`listening to ${PORT}`);
});