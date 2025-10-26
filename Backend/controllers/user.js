import jwt from "jsonwebtoken";
import User from "./models/user.js";

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ msg: "Add email & password" });

  const foundUser = await User.findOne({ email });
  if (!foundUser) return res.status(400).json({ msg: "Invalid credentials" });

  const isMatch = await foundUser.comparePassword(password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ id: foundUser._id, name: foundUser.name }, process.env.JWT_SECRET, { expiresIn: "30d" });
  res.status(200).json({ msg: "User logged in", token });
};

// REGISTER
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const foundUser = await User.findOne({ email });
  if (foundUser) return res.status(400).json({ msg: "Email already in use" });

  if (!username || !email || !password) return res.status(400).json({ msg: "All fields required" });

  const newUser = new User({ name: username, email, password });
  await newUser.save();
  res.status(201).json({ msg: "User registered successfully", newUser });
};

// DASHBOARD (Protected)
export const dashboard = async (req, res) => {
  const luckyNumber = Math.floor(Math.random() * 100);
  res.status(200).json({
    msg: `Hello, ${req.user.name}`,
    secret: `Your lucky number is ${luckyNumber}`,
  });
};

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).json({ users });
};
