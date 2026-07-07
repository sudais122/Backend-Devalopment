import conncectDB from "./db/db.js";
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
});

conncectDB();