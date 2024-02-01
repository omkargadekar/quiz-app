import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // configure static file to save images locally
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    Message: "Server is running ",
    currentTime: new Date(),
    status: "Active",
  });
});

//routes import
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import questionRouter from "./routes/question.routes.js";
import quizRouter from "./routes/quiz.routes.js";
import optionRouter from "./routes/option.routes.js";

//routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/question", questionRouter);
app.use("/api/v1/quiz", quizRouter);
app.use("/api/v1/option", optionRouter);

// http://localhost:8000/api/v1/users/register

export { app };
