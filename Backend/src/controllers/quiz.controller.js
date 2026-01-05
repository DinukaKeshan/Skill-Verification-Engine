// controllers/quiz.controller.js
import Quiz from "../models/quiz.model.js";
import { generateQuestion } from "../services/ollama.service.js";

const MAX_QUESTIONS = 5;

export const startQuiz = async (req, res) => {
  const { skill } = req.body;

  try {
    const quiz = await Quiz.create({
      user: req.user._id,
      skill,
      questions: [],
    });

    const question = await generateQuestion(skill);
    quiz.questions.push(question);
    await quiz.save();

    res.json({
      quizId: quiz._id,
      question,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const nextQuestion = async (req, res) => {
  const { quizId, answer } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Save the user's answer to the last (current) question
    if (quiz.questions.length > 0) {
      const lastIndex = quiz.questions.length - 1;
      quiz.questions[lastIndex].userAnswer = answer;
    }

    // If we've reached 5 questions, signal completion
    if (quiz.questions.length >= MAX_QUESTIONS) {
      await quiz.save(); // ✅ Save the last answer before completing
      return res.json({ isComplete: true });
    }

    // Generate and add the next question
    const newQuestion = await generateQuestion(quiz.skill);
    quiz.questions.push(newQuestion);
    await quiz.save();

    res.json({ question: newQuestion });
  } catch (error) {
    console.error("nextQuestion error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const submitQuiz = async (req, res) => {
  const { quizId, lastAnswer } = req.body; // ✅ Accept lastAnswer

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // ✅ Save the last answer if provided
    if (lastAnswer !== undefined && quiz.questions.length > 0) {
      const lastIndex = quiz.questions.length - 1;
      quiz.questions[lastIndex].userAnswer = lastAnswer;
    }

    // ✅ Calculate score using correctIndex (matching what Ollama returns)
    let score = 0;
    quiz.questions.forEach((q) => {
      console.log('Question:', q.question);
      console.log('User Answer:', q.userAnswer, 'Correct Index:', q.correctIndex);
      
      if (q.userAnswer !== undefined && q.userAnswer === q.correctIndex) {
        score++;
      }
    });

    quiz.score = score;
    quiz.completed = true;
    await quiz.save();

    res.json({
      score,
      total: quiz.questions.length,
    });
  } catch (error) {
    console.error("submitQuiz error:", error);
    res.status(500).json({ message: "Server error" });
  }
};