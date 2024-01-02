import express from "express";
import FileUpload from "express-fileupload";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import db from "./config/database.js";
import router from "./routes/user.router.js";
import TaskRoute from "./routes/task.router.js";
dotenv.config();

const app = express();

try{
    await db.authenticate();
    console.log("Database connected..");
} catch (error){
    console.error(error);
}

app.use(cookieParser());
app.use(express.json());
app.use(FileUpload());
app.use(TaskRoute);
app.use(router);

app.listen(5000,()=>console.log('Server running on port 5000'));