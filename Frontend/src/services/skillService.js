// services/skillService.js
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

// Existing exports
export const addSkill = (skill) =>
  API.post("/skills", { skill });

export const getSkills = () =>
  API.get("/skills");

// ✅ NEW: Claim verification badge
export const claimBadge = (skill, score, total, percentage) =>
  API.post("/skills/claim-badge", { skill, score, total, percentage });