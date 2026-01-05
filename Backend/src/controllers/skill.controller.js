// controllers/skill.controller.js
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

  try {
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
  } catch (error) {
    console.error("addSkill error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get user skills
 * GET /api/skills
 */
export const getSkills = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("skills verifiedSkills");
    res.json({
      skills: user.skills || [],
      verifiedSkills: user.verifiedSkills || []
    });
  } catch (error) {
    console.error("getSkills error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Claim verification badge
 * POST /api/skills/claim-badge
 */
export const claimBadge = async (req, res) => {
  console.log("📥 Claim badge request received:", req.body);
  console.log("👤 User:", req.user?._id);
  
  const { skill, score, total, percentage } = req.body;

  if (!skill || percentage === undefined) {
    console.log("❌ Missing required fields");
    return res.status(400).json({ 
      message: "Missing required fields" 
    });
  }

  if (percentage < 80) {
    console.log("❌ Score below 80%");
    return res.status(400).json({ 
      message: "Score must be 80% or higher to claim badge" 
    });
  }

  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User found:", user.email);

    // Check if already verified - if so, update it
    const existingIndex = user.verifiedSkills.findIndex(
      vs => vs.skill.toLowerCase() === skill.toLowerCase()
    );

    // Determine badge level based on score
    let badge = "Bronze";
    if (percentage === 100) {
      badge = "Platinum";
    } else if (percentage >= 95) {
      badge = "Gold";
    } else if (percentage >= 85) {
      badge = "Silver";
    }

    console.log(`🏆 Awarding ${badge} badge`);

    const verifiedSkill = {
      skill,
      badge,
      verifiedAt: new Date(),
      score,
      total,
      percentage
    };

    if (existingIndex !== -1) {
      // Update existing verification
      user.verifiedSkills[existingIndex] = verifiedSkill;
      console.log("📝 Updated existing verification");
    } else {
      // Add new verification
      user.verifiedSkills.push(verifiedSkill);
      console.log("➕ Added new verification");
    }

    await user.save();
    console.log("✅ Badge claimed successfully!");

    res.json({
      message: "Badge claimed successfully!",
      verifiedSkill: {
        skill,
        badge,
        score,
        total,
        percentage
      }
    });
  } catch (error) {
    console.error("❌ claimBadge error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};