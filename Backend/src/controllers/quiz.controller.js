import Quiz from "../models/quiz.model.js";
import { generateRagQuestion } from "../services/rag/rag.service.js";

const MAX_QUESTIONS = 5;

/**
 * START QUIZ
 */
export const startQuiz = async (req, res) => {
  const { skill } = req.body;

  try {
    const quiz = await Quiz.create({
      user: req.user._id,
      skill,
      questions: [],
      completed: false
    });

    const firstQuestion = await generateRagQuestion(skill);
    quiz.questions.push(firstQuestion);
    await quiz.save();

    res.json({
      quizId: quiz._id,
      question: firstQuestion
    });
  } catch (error) {
    console.error("startQuiz error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * NEXT QUESTION
 */
export const nextQuestion = async (req, res) => {
  const { quizId, answer } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (quiz.completed) {
      return res.status(400).json({ message: "Quiz already completed" });
    }

    // ✅ Save answer for current question
    const currentIndex = quiz.questions.length - 1;
    if (currentIndex >= 0) {
      quiz.questions[currentIndex].userAnswer = answer;
    }

    // ✅ If quiz is complete after saving answer
    if (quiz.questions.length >= MAX_QUESTIONS) {
      quiz.completed = true;
      await quiz.save();
      return res.json({ isComplete: true });
    }

    // ✅ Generate next question
    const nextQ = await generateRagQuestion(quiz.skill);
    quiz.questions.push(nextQ);
    await quiz.save();

    res.json({ question: nextQ });
  } catch (error) {
    console.error("nextQuestion error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * SUBMIT QUIZ
 */
export const submitQuiz = async (req, res) => {
  const { quizId } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (quiz.completed && quiz.score !== undefined) {
      return res.json({
        score: quiz.score,
        total: quiz.questions.length
      });
    }

    // ✅ Score calculation
    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (
        q.userAnswer !== undefined &&
        q.correctIndex !== undefined &&
        q.userAnswer === q.correctIndex
      ) {
        score++;
      }
    });

    quiz.score = score;
    quiz.completed = true;
    await quiz.save();

    res.json({
      score,
      total: quiz.questions.length
    });
  } catch (error) {
    console.error("submitQuiz error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
