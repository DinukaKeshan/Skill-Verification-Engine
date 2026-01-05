// components/Quiz.jsx
import { useState } from "react";
import { nextQuestion, submitQuiz } from "../services/quizService";
import { useNavigate } from "react-router-dom";

const MAX_QUESTIONS = 5;

export default function Quiz({
  quizId,
  question,
  setQuestion,
  currentQuestionIndex,
  skill,
}) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (index) => {
    if (revealed) return;
    setSelected(index);
    setRevealed(true);
  };

  const handleNext = async () => {
    if (selected === null) return;

    try {
      const res = await nextQuestion(quizId, selected);

      if (res.data.isComplete) {
        // ✅ Submit with the last answer
        const submitRes = await submitQuiz(quizId, selected);
        navigate("/quiz-summary", {
          state: { result: submitRes.data, skill },
        });
        return;
      }

      // Load next question
      setQuestion(res.data.question);
      setSelected(null);
      setRevealed(false);
    } catch (err) {
      console.error("Error getting next question:", err);
    }
  };

  const handleSubmit = async () => {
    try {
      // ✅ Include the selected answer
      const res = await submitQuiz(quizId, selected);
      navigate("/quiz-summary", {
        state: { result: res.data, skill },
      });
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }
  };

  const isLastQuestion = currentQuestionIndex + 1 === MAX_QUESTIONS;

  return (
    <div className="bg-white p-10 rounded-2xl shadow-xl max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-center">{question.question}</h2>

      <div className="space-y-4 mb-10">
        {question.options.map((opt, i) => {
          let style = "border-2 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50";

          if (revealed) {
            if (i === question.correctIndex) {
              style = "bg-green-500 text-white border-green-600";
            } else if (i === selected) {
              style = "bg-red-500 text-white border-red-600";
            } else {
              style = "opacity-60";
            }
          } else if (selected === i) {
            style = "bg-indigo-600 text-white border-indigo-700";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={revealed}
              className={`w-full text-left p-5 rounded-xl transition-all text-lg font-medium ${style} disabled:cursor-not-allowed`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handleNext}
          disabled={!revealed}
          className={`px-10 py-4 rounded-xl font-bold text-white transition ${
            revealed
              ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isLastQuestion ? "Finish Quiz" : "Next Question"}
        </button>

        {isLastQuestion && (
          <button
            onClick={handleSubmit}
            disabled={!revealed}
            className={`px-10 py-4 rounded-xl font-bold text-white transition ${
              revealed
                ? "bg-green-600 hover:bg-green-700 shadow-lg"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
}