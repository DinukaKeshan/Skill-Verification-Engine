import express from "express";
import { addSkill, getSkills } from "../controllers/skill.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Add skill
router.post("/", protect, addSkill);

// Get user skills
router.get("/", protect, getSkills);

export default router;
