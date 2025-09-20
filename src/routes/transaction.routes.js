const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction.model");
const authMiddleware = require("../middleware/auth.middleware")

router.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.email }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const { type, amount, category, note } = req.body;
  const transaction = new Transaction({
    type,
    amount,
    category,
    note,
    user: req.user.email, 
  });

  try {
    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    if (transaction.user !== req.user.email)
      return res.status(403).json({ message: "Forbidden" });

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
