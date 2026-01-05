import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { startQuiz } from "../services/quizService";
import Quiz from "../components/Quiz";
import { isAuthenticated } from "../utils/auth";

export default function QuizPage() {
  const { skill } = useParams();
  const navigate = useNavigate();

  const [quizId, setQuizId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const initQuiz = async () => {
      try {
        const res = await startQuiz(skill);
        setQuizId(res.data.quizId);
        setQuestion(res.data.question);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    initQuiz();
  }, [skill]);

  if (loading) {
    return <div className="text-center py-20">Loading quiz...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-6">
        {skill.toUpperCase()} Skill Quiz
      </h1>

      <Quiz
        quizId={quizId}
        question={question}
        setQuestion={setQuestion}
      />
    </div>
  );
}
