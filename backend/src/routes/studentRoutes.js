import express from "express";
import { auth, isStudent, isAdmin } from "../middleware/auth.js";
import {
  getMyProfileStudent,
  getMyScheduleStudent,
  submitPracticeLog,
  getMyPracticeLogs,
  getMyFees,
  getMyRecitals,
  getFAQsForStudent,
  getAvailableClasses,
  enrollInClass
} from "../controllers/studentController.js";

const router = express.Router();

// Available classes and enroll can be accessed by both students and admins
router.get("/available-classes", auth, getAvailableClasses);
router.post("/enroll", auth, isStudent, enrollInClass);

// Rest of routes require student role
router.use(auth, isStudent);

router.get("/me", getMyProfileStudent);
router.get("/schedules", getMyScheduleStudent);
router.post("/practice-logs", submitPracticeLog);
router.get("/practice-logs", getMyPracticeLogs);
router.get("/fees", getMyFees);
router.get("/recitals", getMyRecitals);
router.get("/faqs", getFAQsForStudent);

export default router;


