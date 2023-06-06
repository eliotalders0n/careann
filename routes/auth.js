import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router();

// Login route
router.post("/login", login, (req, res) => {
  // If login is successful, set the user ID in the session
  req.session.userId = req.user._id;
  res.status(200).send({ message: "Login successful" });
});

export default router;
