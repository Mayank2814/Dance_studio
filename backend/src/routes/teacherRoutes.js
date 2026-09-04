import express from "express";
import { auth, isTeacher } from "../middleware/auth.js";
import {
  getMyProfile,
  getMyStudents,
  getMySchedule,
  markAttendance,
  getStudentPracticeLogs,
  addPracticeFeedback,
  getMySalaries,
  getUpcomingRecitals,
  getFAQsForTeacher
} from "../controllers/teacherController.js";

const router = express.Router();

router.use(auth, isTeacher);

router.get("/me", getMyProfile);
router.get("/students", getMyStudents);
router.get("/schedules", getMySchedule);
router.post("/attendance", markAttendance);
router.get("/practice-logs", getStudentPracticeLogs);
router.post("/practice-logs/feedback", addPracticeFeedback);
router.get("/salaries", getMySalaries);
router.get("/recitals", getUpcomingRecitals);
router.get("/faqs", getFAQsForTeacher);

export default router;


