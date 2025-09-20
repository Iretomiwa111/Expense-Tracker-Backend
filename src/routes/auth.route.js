const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const users = [];

// Signup
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) return res.status(400).json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = { email, password: hashed };
  users.push(user);

  const token = jwt.sign({ email }, "SECRET_KEY", { expiresIn: "1h" });
  res.json({ token, user: { email } });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: "Invalid email" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ email }, "SECRET_KEY", { expiresIn: "1h" });
  res.json({ token, user: { email } });
});

// Get current user
router.get("/me", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Unauthorized" });

  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, "SECRET_KEY");
    res.json({ email: payload.email });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
