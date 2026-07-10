import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN_CORE,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("Public"));

//Routes
 import useroutes from './routes/user.js';

 app.use('/user', useroutes)
export { app };
