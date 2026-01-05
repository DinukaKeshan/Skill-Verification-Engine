import { useState } from "react";

export default function Quiz({ questions, skill }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (index) => {
    setAnswers({
      ...answers,
      [current]: index
    });
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const submitQuiz = () => {
    setSubmitted(true);
  };

  const score = questions.reduce((acc, q, i) => {
    return acc + (answers[i] === q.correctAnswer ? 1 : 0);
  }, 0);

  if (submitted) {
    return (
      <div className="bg-green-50 p-8 rounded text-center">
        <h2 className="text-2xl font-bold mb-4">
          Quiz Completed 🎉
        </h2>
        <p className="text-lg">
          Score: {score} / {questions.length}
        </p>

        {/* Next step later */}
        <p className="mt-4 text-gray-600">
          Badge verification coming soon 🚀
        </p>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="bg-white p-8 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        Question {current + 1} of {questions.length}
      </h2>

      <p className="mb-6">{q.question}</p>

      <div className="space-y-3">
        {q.options.map((opt, i) => (
          <label
            key={i}
            className={`block p-3 border rounded cursor-pointer ${
              answers[current] === i
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            <input
              type="radio"
              name="option"
              checked={answers[current] === i}
              onChange={() => handleSelect(i)}
              className="hidden"
            />
            {opt}
          </label>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={prev}
          disabled={current === 0}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        {current === questions.length - 1 ? (
          <button
            onClick={submitQuiz}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={next}
            className="bg-black text-white px-6 py-2 rounded"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
