const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    note: { type: String },
    date: { type: Date, default: Date.now },
    user: { type: String, required: true }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
