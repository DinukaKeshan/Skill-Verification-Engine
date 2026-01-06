// services/quizService.js
import axios from "axios";
import { getToken } from "../utils/auth";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((req) => {
  const token = getToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const startQuiz = (skill) =>
  API.post("/quiz/start", { skill });

export const nextQuestion = (quizId, answer) =>
  API.post("/quiz/next", { quizId, answer });

// ✅ Updated to accept lastAnswer parameter
export const submitQuiz = (quizId, lastAnswer) =>
  API.post("/quiz/submit", { quizId, lastAnswer });