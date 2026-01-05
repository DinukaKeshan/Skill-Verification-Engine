import User from "../models/user.model.js";

/**
 * Add skill to user profile
 * POST /api/skills
 */
export const addSkill = async (req, res) => {
  const { skill } = req.body;

  if (!skill) {
    return res.status(400).json({ message: "Skill is required" });
  }

  const user = await User.findById(req.user._id);

  // Prevent duplicates (case-insensitive)
  const exists = user.skills.some(
    s => s.toLowerCase() === skill.toLowerCase()
  );

  if (exists) {
    return res.status(400).json({ message: "Skill already added" });
  }

  user.skills.push(skill);
  await user.save();

  res.status(201).json({
    message: "Skill added successfully",
    skills: user.skills
  });
};

/**
 * Get user skills
 * GET /api/skills
 */
export const getSkills = async (req, res) => {
  const user = await User.findById(req.user._id).select("skills");
  res.json(user.skills);
};
