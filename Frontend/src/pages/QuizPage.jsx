// pages/QuizPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { startQuiz } from "../services/quizService";
import Quiz from "../components/Quiz";
import { isAuthenticated } from "../utils/auth";

const MAX_QUESTIONS = 5;

export default function QuizPage() {
  const { skill } = useParams();
  const navigate = useNavigate();

  const [quizId, setQuizId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [questionCount, setQuestionCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: `/quiz/${skill}` } });
      return;
    }

    const initQuiz = async () => {
      try {
        setLoading(true);
        const res = await startQuiz(skill);
        setQuizId(res.data.quizId);
        setQuestion(res.data.question);
        setQuestionCount(1);
      } catch (err) {
        setError("Failed to start quiz. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initQuiz();
  }, [skill, navigate]);

  const handleQuestionUpdate = (newQuestion) => {
    setQuestion(newQuestion);
    setQuestionCount((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl">Loading {skill.toUpperCase()} quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-6">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-5xl font-bold text-indigo-800 mb-4">
          {skill.toUpperCase()} Skill Quiz
        </h1>
        <p className="text-xl text-gray-600">
          Question {questionCount} of {MAX_QUESTIONS}
        </p>
        <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-4 mt-4">
          <div
            className="bg-indigo-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${(questionCount / MAX_QUESTIONS) * 100}%` }}
          />
        </div>
      </div>

      <Quiz
        quizId={quizId}
        question={question}
        setQuestion={handleQuestionUpdate}
        currentQuestionIndex={questionCount - 1}
        skill={skill}
      />
    </div>
  );
}