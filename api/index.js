import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "../backend/src/config/db.js";
import { ENV } from "../backend/src/config/env.js";
import { notFound, errorHandler } from "../backend/src/middleware/errorHandler.js";
import authRoutes from "../backend/src/routes/authRoutes.js";
import adminRoutes from "../backend/src/routes/adminRoutes.js";
import teacherRoutes from "../backend/src/routes/teacherRoutes.js";
import studentRoutes from "../backend/src/routes/studentRoutes.js";
import { User } from "../backend/src/models/User.js";
import { ROLES } from "../backend/src/utils/roles.js";

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", env: ENV.NODE_ENV });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);

app.use(notFound);
app.use(errorHandler);

// Connect DB and seed admin once per cold start
let isReady = false;
const init = async () => {
  if (isReady) return;
  await connectDB();

  let existingAdmin = await User.findOne({ role: ROLES.ADMIN });
  if (!existingAdmin) {
    await User.create({
      name: ENV.ADMIN_NAME,
      email: ENV.ADMIN_EMAIL,
      username: ENV.ADMIN_USERNAME,
      password: ENV.ADMIN_PASSWORD,
      role: ROLES.ADMIN,
      isActive: true,
      forcePasswordChange: true
    });
  } else {
    let needsSave = false;
    if (existingAdmin.name !== ENV.ADMIN_NAME) { existingAdmin.name = ENV.ADMIN_NAME; needsSave = true; }
    if (existingAdmin.email !== ENV.ADMIN_EMAIL) { existingAdmin.email = ENV.ADMIN_EMAIL; needsSave = true; }
    if (existingAdmin.username !== ENV.ADMIN_USERNAME) { existingAdmin.username = ENV.ADMIN_USERNAME; needsSave = true; }
    if (ENV.ADMIN_PASSWORD && ENV.ADMIN_PASSWORD.length >= 8) {
      existingAdmin.password = ENV.ADMIN_PASSWORD;
      existingAdmin.forcePasswordChange = true;
      existingAdmin.isActive = true;
      needsSave = true;
    }
    if (needsSave) await existingAdmin.save();
  }
  isReady = true;
};

export default async (req, res) => {
  await init();
  return app(req, res);
};
