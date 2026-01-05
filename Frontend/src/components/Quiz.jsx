import { useState } from "react";
import { nextQuestion, submitQuiz } from "../services/quizService";

export default function Quiz({ quizId, question, setQuestion }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const handleSelect = (index) => {
    if (revealed) return; // lock selection
    setSelected(index);
    setRevealed(true);
  };

  const handleNext = async () => {
    const res = await nextQuestion(quizId, selected);
    setSelected(null);
    setRevealed(false);
    setQuestion(res.data.question);
  };

  const handleSubmit = async () => {
    const res = await submitQuiz(quizId);
    setResult(res.data);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 p-8 rounded text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Completed 🎉</h2>
        <p className="text-lg">
          Score: {result.score} / {result.total}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        {question.question}
      </h2>

      <div className="space-y-3">
        {question.options.map((opt, i) => {
          let style = "border";

          if (revealed) {
            if (i === question.correctIndex) {
              style = "bg-green-500 text-white border-green-600";
            } else if (i === selected) {
              style = "bg-red-500 text-white border-red-600";
            }
          } else if (selected === i) {
            style = "bg-black text-white";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left p-3 rounded ${style}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between mt-8">
        <button
          disabled={!revealed}
          onClick={handleNext}
          className="bg-black text-white px-6 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>

        <button
          disabled={!revealed}
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
