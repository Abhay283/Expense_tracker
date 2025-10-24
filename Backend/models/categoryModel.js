import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional: for custom categories per user
  isDefault: { type: Boolean, default: false }, // default categories
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);
