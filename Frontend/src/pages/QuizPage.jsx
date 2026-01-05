import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../utils/auth";
import Quiz from "../components/Quiz";

export default function QuizPage() {
  const { skill } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Guard route
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    // TEMP: mock quiz (backend comes next)
    setTimeout(() => {
      setQuestions([
        {
          id: 1,
          question: `What is ${skill}?`,
          options: [
            "A programming language",
            "A database",
            "A browser",
            "An OS"
          ],
          correctAnswer: 0
        },
        {
          id: 2,
          question: `Which company created ${skill}?`,
          options: ["Google", "Microsoft", "Meta", "Depends"],
          correctAnswer: 3
        }
      ]);
      setLoading(false);
    }, 800);
  }, [skill]);

  if (loading) {
    return (
      <div className="text-center py-20 text-lg">
        Loading quiz...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-6">
        {skill.toUpperCase()} Skill Quiz
      </h1>

      <Quiz questions={questions} skill={skill} />
    </div>
  );
}
