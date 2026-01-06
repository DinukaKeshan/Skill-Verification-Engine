// pages/QuizSummary.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { claimBadge } from "../services/skillService";

export default function QuizSummary() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [claiming, setClaiming] = useState(false);

  if (!state || !state.result || !state.skill) {
    navigate("/");
    return null;
  }

  const { result, skill } = state;
  const { score, total } = result;
  const percentage = Math.round((score / total) * 100);
  const badgeEarned = percentage >= 80;

  let message = "";
  let messageColor = "";

  if (percentage === 100) {
    message = "Perfect Score! You're a true expert! 🌟";
    messageColor = "text-green-600";
  } else if (percentage >= 90) {
    message = "Outstanding! Near-perfect mastery! 🚀";
    messageColor = "text-green-600";
  } else if (percentage >= 80) {
    message = "Excellent! You've earned the verification badge! 🏆";
    messageColor = "text-green-500";
  } else if (percentage >= 60) {
    message = "Good effort! Keep practicing! 💪";
    messageColor = "text-yellow-600";
  } else {
    message = "Keep learning! You'll get there soon! 🌱";
    messageColor = "text-orange-600";
  }

  const handleClaimBadge = async () => {
    setClaiming(true);
    try {
      console.log("Claiming badge with:", { skill, score, total, percentage });
      const response = await claimBadge(skill, score, total, percentage);
      console.log("Badge claim response:", response);
      
      // Show success message
      alert(`🎉 Congratulations! Your ${skill.toUpperCase()} skill has been verified!`);
      
      // Navigate back to verify skill page
      navigate("/verify-skill");
    } catch (err) {
      console.error("Error claiming badge:", err);
      console.error("Error response:", err.response);
      alert(err.response?.data?.message || "Failed to claim badge. Please try again.");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-12 px-8 text-center">
            <h1 className="text-5xl font-bold mb-3">Quiz Completed! 🎉</h1>
            <p className="text-2xl opacity-90">{skill.toUpperCase()} Skill Assessment</p>
          </div>

          <div className="p-10 md:p-16 text-center">
            <div className="my-10">
              <div className="inline-flex flex-col items-center justify-center w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 border-12 border-indigo-300 shadow-inner">
                <p className="text-8xl font-extrabold text-indigo-800">{score}</p>
                <p className="text-3xl text-gray-600 mt-2">/ {total}</p>
              </div>
              <p className="text-5xl font-bold mt-8 text-gray-800">{percentage}%</p>
            </div>

            <p className={`text-3xl font-semibold mb-12 ${messageColor}`}>
              {message}
            </p>

            <div className="space-y-6">
              {badgeEarned ? (
                <button
                  onClick={handleClaimBadge}
                  disabled={claiming}
                  className="w-full max-w-lg mx-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-2xl py-6 px-12 rounded-2xl shadow-xl transform transition duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {claiming ? (
                    "✨ Claiming Badge... ✨"
                  ) : (
                    `✨ Claim Your ${skill.toUpperCase()} Verification Badge ✨`
                  )}
                </button>
              ) : (
                <div className="bg-gray-100 rounded-2xl p-8 max-w-lg mx-auto">
                  <p className="text-xl text-gray-700 mb-4">
                    Score <strong>80%</strong> or higher to earn the badge
                  </p>
                  <button
                    onClick={() => navigate(`/quiz/${skill}`)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl py-5 px-10 rounded-xl transition"
                  >
                    🔄 Try Again
                  </button>
                </div>
              )}

              <div className="pt-8">
                <button
                  onClick={() => navigate("/verify-skill")}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold text-lg underline"
                >
                  ← Back to Skills
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}