import express from "express";
import cors from "cors";
import passport from "passport";
import "./config/passport.js"; // ✅ loads strategy
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);

export default app;
