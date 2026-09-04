import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Student } from "../models/Student.js";
import { ENV } from "../config/env.js";
import { ROLES } from "../utils/roles.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    ENV.JWT_SECRET,
    { expiresIn: ENV.JWT_EXPIRES_IN }
  );
};

export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body; // email or username
    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifier and password are required" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier }]
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        contactNumber: user.contactNumber,
        forcePasswordChange: user.forcePasswordChange
      }
    });
  } catch (err) {
    next(err);
  }
};

export const register = async (req, res, next) => {
  try {
    const { name, email, username, password, contactNumber } = req.body;

    if (!name || !email || !username || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, username and password are required" });
    }

    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }]
    });
    if (existing) {
      return res.status(400).json({ message: "Email or username already in use" });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      username,
      password,
      role: ROLES.STUDENT,
      contactNumber,
      isActive: true,
      forcePasswordChange: false
    });

    // Create a basic student profile so student routes work
    await Student.create({ user: user._id });

    const token = generateToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        contactNumber: user.contactNumber,
        forcePasswordChange: user.forcePasswordChange
      }
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email or username already in use" });
    }
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      contactNumber: user.contactNumber,
      forcePasswordChange: user.forcePasswordChange
    });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (currentPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
    }

    user.password = newPassword;
    user.forcePasswordChange = false;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { contactNumber } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate contact number format (basic validation)
    if (contactNumber && !/^\+?[\d\s\-\(\)]+$/.test(contactNumber)) {
      return res.status(400).json({ message: "Invalid contact number format" });
    }

    user.contactNumber = contactNumber || user.contactNumber;
    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        contactNumber: user.contactNumber,
        forcePasswordChange: user.forcePasswordChange
      }
    });
  } catch (err) {
    next(err);
  }
};


