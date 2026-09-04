import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import { User } from "./models/User.js";
import { ROLES } from "./utils/roles.js";

const app = express();

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", env: ENV.NODE_ENV });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);

// 404 and error handlers
app.use(notFound);
app.use(errorHandler);

const start = async () => {
  await connectDB();

  // Ensure a super admin exists and is in sync with ENV defaults
  let existingAdmin = await User.findOne({ role: ROLES.ADMIN });
  if (!existingAdmin) {
    console.log("No admin user found. Creating default admin...");
    existingAdmin = await User.create({
      name: ENV.ADMIN_NAME,
      email: ENV.ADMIN_EMAIL,
      username: ENV.ADMIN_USERNAME,
      password: ENV.ADMIN_PASSWORD,
      role: ROLES.ADMIN,
      isActive: true,
      forcePasswordChange: true
    });
    console.log(`Admin created. Username: ${ENV.ADMIN_USERNAME}, Email: ${ENV.ADMIN_EMAIL}`);
  } else {
    // Keep core admin fields in sync with ENV so login hints stay correct
    let needsSave = false;
    if (existingAdmin.name !== ENV.ADMIN_NAME) {
      existingAdmin.name = ENV.ADMIN_NAME;
      needsSave = true;
    }
    if (existingAdmin.email !== ENV.ADMIN_EMAIL) {
      existingAdmin.email = ENV.ADMIN_EMAIL;
      needsSave = true;
    }
    if (existingAdmin.username !== ENV.ADMIN_USERNAME) {
      existingAdmin.username = ENV.ADMIN_USERNAME;
      needsSave = true;
    }
    // Sync password to ENV if explicitly set (will be hashed by pre-save hook)
    if (ENV.ADMIN_PASSWORD && ENV.ADMIN_PASSWORD.length >= 8) {
      existingAdmin.password = ENV.ADMIN_PASSWORD;
      existingAdmin.forcePasswordChange = true;
      existingAdmin.isActive = true;
      needsSave = true;
    }
    if (needsSave) {
      await existingAdmin.save();
      console.log(
        `Admin account synced with ENV. Username: ${ENV.ADMIN_USERNAME}, Email: ${ENV.ADMIN_EMAIL}`
      );
    }
  }

  app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});


