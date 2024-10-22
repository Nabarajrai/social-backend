import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/auth/", authRouter);
app.use("/api/users", userRouter);

app.listen(8080, () => {
  console.log("Listening on 8080");
});
