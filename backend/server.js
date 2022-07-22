import express  from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js"
import cors from "cors";

const port = process.env.PORT || 5000;
const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
connectDB();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/api/users',userRouter);


app.use(errorHandler);
app.listen(port, () => console.log(`Server is running at port 5000`))