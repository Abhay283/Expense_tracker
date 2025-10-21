import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true, enum: ["Food","Transport","Entertainment","Shopping","Other"] },
  description: { type: String, default: "" },
  date: { type: Date, default: Date.now },
  receipt: { type: String, default: "" } // optional: store image URL
}, { timestamps: true });

export default mongoose.model("expense", expenseSchema);
