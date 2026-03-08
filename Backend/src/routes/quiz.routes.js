import express from "express";
import {
  startQuiz,
  nextQuestion,
  submitQuiz
} from "../controllers/quiz.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/start", protect, startQuiz);
router.post("/next", protect, nextQuestion);
router.post("/submit", protect, submitQuiz);

export default router;
