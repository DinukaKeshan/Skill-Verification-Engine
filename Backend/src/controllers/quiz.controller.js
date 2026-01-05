import Quiz from "../models/quiz.model.js";
import { generateQuestion } from "../services/ollama.service.js";

/**
 * Start quiz
 */
export const startQuiz = async (req, res) => {
  const { skill } = req.body;

  const quiz = await Quiz.create({
    user: req.user._id,
    skill,
    questions: []
  });

  const question = await generateQuestion(skill);

  quiz.questions.push(question);
  await quiz.save();

  res.json({
    quizId: quiz._id,
    question
  });
};

/**
 * Next question
 */
export const nextQuestion = async (req, res) => {
  const { quizId, answer } = req.body;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  // Save user answer
  quiz.questions[quiz.questions.length - 1].userAnswer = answer;

  // Generate next question
  const question = await generateQuestion(quiz.skill);
  quiz.questions.push(question);

  await quiz.save();

  res.json({ question });
};

/**
 * Submit quiz
 */
export const submitQuiz = async (req, res) => {
  const { quizId } = req.body;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  let score = 0;

  quiz.questions.forEach((q) => {
    if (q.userAnswer === q.correctAnswer) score++;
  });

  quiz.score = score;
  quiz.completed = true;
  await quiz.save();

  res.json({
    score,
    total: quiz.questions.length
  });
};
