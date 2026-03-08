import Quiz from "../models/quiz.model.js";
import { generateRagQuestion } from "../services/rag/rag.service.js";

const MAX_QUESTIONS = 5;

/**
 * START QUIZ
 * Fixed: Added check to prevent duplicate quiz creation
 */
export const startQuiz = async (req, res) => {
  const { skill } = req.body;

  try {
    // ✅ FIX: Check if user already has an incomplete quiz for this skill
    const existingQuiz = await Quiz.findOne({
      user: req.user._id,
      skill,
      completed: false,
    }).sort({ createdAt: -1 }); // Get the most recent one

    // If an incomplete quiz exists and was created in the last 5 minutes, return it
    if (existingQuiz) {
      const timeDiff = Date.now() - existingQuiz.createdAt.getTime();
      const fiveMinutes = 5 * 60 * 1000;

      if (timeDiff < fiveMinutes && existingQuiz.questions.length > 0) {
        // Return the existing quiz
        const lastQuestion = existingQuiz.questions[existingQuiz.questions.length - 1];
        return res.json({
          quizId: existingQuiz._id,
          question: {
            question: lastQuestion.question,
            options: lastQuestion.options,
            correctIndex: lastQuestion.correctIndex,
          },
        });
      }
    }

    // Create new quiz
    const quiz = await Quiz.create({
      user: req.user._id,
      skill,
      questions: [],
      completed: false,
    });

    // Generate the first question asynchronously
    const firstQuestion = await generateRagQuestion(skill);
    quiz.questions.push({
      question: firstQuestion.question,
      options: firstQuestion.options,
      correctIndex: firstQuestion.correctIndex,
      userAnswer: null,
    });
    await quiz.save();

    res.json({
      quizId: quiz._id,
      question: firstQuestion,
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

    // Save answer for current question
    const currentIndex = quiz.questions.length - 1;
    if (currentIndex >= 0) {
      quiz.questions[currentIndex].userAnswer = answer;
    }

    // If quiz is complete (i.e., the user answered all the questions)
    if (quiz.questions.length >= MAX_QUESTIONS) {
      quiz.completed = true;
      await quiz.save();
      return res.json({ isComplete: true, message: "Quiz is complete. You can submit now." });
    }

    // Generate next question
    const nextQ = await generateRagQuestion(quiz.skill);
    quiz.questions.push({
      question: nextQ.question,
      options: nextQ.options,
      correctIndex: nextQ.correctIndex,
      userAnswer: null,
    });
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

    // Check if the quiz is completed
    if (!quiz.completed) {
      return res.status(400).json({ message: "Quiz is not yet completed." });
    }

    // Calculate score only after the quiz is completed
    let score = 0;
    quiz.questions.forEach((q) => {
      if (q.userAnswer !== null && q.correctIndex !== undefined && q.userAnswer === q.correctIndex) {
        score++;
      }
    });

    quiz.score = score;
    await quiz.save();

    // Generate the report (question + user answer + correct answer)
    const report = quiz.questions.map((q) => ({
      question: q.question,
      options: q.options,
      userAnswer: q.userAnswer !== null ? q.options[q.userAnswer] : 'No answer',
      correctAnswer: q.options[q.correctIndex],
    }));

    res.json({
      score,
      total: quiz.questions.length,
      report,
    });

  } catch (error) {
    console.error("submitQuiz error:", error);
    res.status(500).json({ message: "Server error" });
  }
};