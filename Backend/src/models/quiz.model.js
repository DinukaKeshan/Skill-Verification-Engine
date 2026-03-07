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
        correctIndex: Number, // ✅ Correct answer index
        userAnswer: {
          type: Number,
          min: [0, 'User answer must be between 0 and 3'],
          max: [3, 'User answer must be between 0 and 3']
        }
      }
    ],
    score: { type: Number, default: 0 }, // Default score to 0
    completed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);