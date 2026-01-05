// app.js (or server.js) - Make sure this is your setup
import express from "express";
import cors from "cors";
import passport from "passport";
import "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import quizRoutes from "./routes/quiz.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// ✅ IMPORTANT: Skills routes MUST come before other routes
app.use("/api/skills", skillRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/auth", authRoutes);

export default app;