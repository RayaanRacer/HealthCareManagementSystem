import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/configDB.js";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js"
import doctorRoutes from "./routes/doctorRoutes.js"
import appointmentRoute from "./routes/appointmentRoutes.js"
import notificationRoute from "./routes/notificationRoutes.js"
import conversationRoute from "./routes/conversationRoute.js"
import cors from "cors";

const app = express();
app.use(cors());
// dot env
dotenv.config();
const PORT = process.env.PORT;
const MongoDBURI = process.env.MONGO_URI;

// middlewares
app.use(express.json())
app.use(morgan('dev'))

// connect mongoDB
connectDb(MongoDBURI);

// routes
// app.post("/register",registerController)
app.use("/user/api/v1",userRoutes)
app.use("/doctor/api/v1", doctorRoutes)
app.use("/appointment/api/v1",appointmentRoute)
app.use("/notification/api/v1",notificationRoute)
app.use("/conversation/api/v1",conversationRoute)

app.listen(
    PORT,
    console.log(`Server running in mode on port http://localhost:${PORT}`)
);
