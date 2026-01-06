// routes/skill.routes.js
import express from "express";
import { addSkill, getSkills, claimBadge } from "../controllers/skill.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ IMPORTANT: Put specific routes BEFORE general ones
router.post("/claim-badge", protect, claimBadge);

// Add skill
router.post("/", protect, addSkill);

// Get user skills
router.get("/", protect, getSkills);

export default router;