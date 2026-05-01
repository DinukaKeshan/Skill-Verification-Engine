import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import GoogleRedirect from "./pages/GoogleRedirect";
import { AuthProvider, useAuth } from "./context/AuthContext";
import VerifySkill from "./pages/VerifySkill";
import QuizPage from "./pages/QuizPage";
import QuizSummary from "./pages/QuizSummary";
import QuizResultPage from "./pages/QuizResultPage";
import RoadmapPage from "./pages/RoadmapPage";
import SkillDashboardPage from "./pages/SkillDashboardPage";

// Fix 4: inner component so it can consume AuthContext (which requires being inside AuthProvider)
function AppRoutes() {
  const { initializing } = useAuth();

  // Block all route rendering until localStorage hydration is complete.
  // Without this, RoadmapPage sees user=null on first render and shows a
  // permanent loading skeleton even though the user IS logged in.
  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"                        element={<Home />} />
        <Route path="/login"                   element={<Login />} />
        <Route path="/register"                element={<Register />} />
        <Route path="/oauth-success"           element={<GoogleRedirect />} />
        <Route path="/verify-skill"            element={<VerifySkill />} />
        <Route path="/quiz-summary"            element={<QuizSummary />} />
        {/* quiz/result must be before quiz/:skill to avoid route shadowing */}
        <Route path="/quiz/result/:attemptId"  element={<QuizResultPage />} />
        <Route path="/quiz/:skill"             element={<QuizPage />} />
        <Route path="/roadmap/:skill"          element={<RoadmapPage />} />
        <Route path="/dashboard/skills"        element={<SkillDashboardPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}