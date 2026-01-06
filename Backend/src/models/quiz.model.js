// models/quiz.model.js
import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    skill: {
      type: String,
      required: true
    },
    questions: [
      {
        question: String,
        options: [String],
        correctIndex: Number, // ✅ Changed from correctAnswer to correctIndex
        userAnswer: Number
      }
    ],
    score: Number,
    completed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);