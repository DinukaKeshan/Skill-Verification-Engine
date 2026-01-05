import express from "express";
import passport from "passport";
import { register, login } from "../controllers/auth.controller.js";
import { generateToken } from "../utils/token.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = generateToken(req.user._id);
    // ✅ Pass user data in query params
    const userName = encodeURIComponent(req.user.name);
    const userEmail = encodeURIComponent(req.user.email);
    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${token}&name=${userName}&email=${userEmail}`
    );
  }
);

export default router;