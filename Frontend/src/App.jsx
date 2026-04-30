import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import GoogleRedirect from "./pages/GoogleRedirect";
import { AuthProvider } from "./context/AuthContext";
import VerifySkill from "./pages/VerifySkill";
import QuizPage from "./pages/QuizPage";
import QuizSummary from "./pages/QuizSummary";
import QuizResultPage from "./pages/QuizResultPage";
import RoadmapPage from "./pages/RoadmapPage";
import SkillDashboardPage from "./pages/SkillDashboardPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"                        element={<Home />} />
          <Route path="/login"                   element={<Login />} />
          <Route path="/register"                element={<Register />} />
          <Route path="/oauth-success"           element={<GoogleRedirect />} />
          <Route path="/verify-skill"            element={<VerifySkill />} />
          <Route path="/quiz/:skill"             element={<QuizPage />} />
          <Route path="/quiz-summary"            element={<QuizSummary />} />
          {/* New pages */}
          <Route path="/quiz/result/:attemptId"  element={<QuizResultPage />} />
          <Route path="/roadmap/:skill"          element={<RoadmapPage />} />
          <Route path="/dashboard/skills"        element={<SkillDashboardPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}