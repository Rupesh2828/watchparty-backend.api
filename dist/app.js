import express from 'express';
import cors from "cors";
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
//this is for express accepting json files in limited size.
app.use(express.json({ limit: "20kb" }));
app.use(express.json());
//this is for accepting the url which converts into encoded format in the limited size
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
// Middleware
// Routes import
import userRouter from './routes/user.route';
//Routes Declaration
app.use("/api/users", userRouter);
export default app;
