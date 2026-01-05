import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import GoogleRedirect from "./pages/GoogleRedirect";
import { AuthProvider } from "./context/AuthContext";
import VerifySkill from "./pages/VerifySkill";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth-success" element={<GoogleRedirect />} />
          <Route path="/verify-skill" element={<VerifySkill />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}