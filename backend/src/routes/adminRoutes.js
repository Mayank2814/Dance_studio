import express from "express";
import { auth, isAdmin } from "../middleware/auth.js";
import {
  createTeacher,
  updateTeacher,
  listTeachers,
  createStudent,
  updateStudent,
  listStudents,
  createSchedule,
  updateSchedule,
  listSchedules,
  listPracticeLogs,
  upsertFee,
  listFees,
  createOrUpdateSalary,
  listSalaries,
  createRecital,
  updateRecital,
  listRecitals,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  listFAQs,
  updateTeacherContact,
  updateStudentContact
} from "../controllers/adminController.js";

const router = express.Router();

router.use(auth, isAdmin);

// User management
router.post("/teachers", createTeacher);
router.get("/teachers", listTeachers);
router.put("/teachers/:id", updateTeacher);
router.put("/teachers/:id/contact", updateTeacherContact);

router.post("/students", createStudent);
router.get("/students", listStudents);
router.put("/students/:id", updateStudent);
router.put("/students/:id/contact", updateStudentContact);

// Scheduling
router.post("/schedules", createSchedule);
router.get("/schedules", listSchedules);
router.put("/schedules/:id", updateSchedule);

// Practice logs view
router.get("/practice-logs", listPracticeLogs);

// Fees
router.post("/fees", upsertFee);
router.get("/fees", listFees);

// Salaries
router.post("/salaries", createOrUpdateSalary);
router.get("/salaries", listSalaries);

// Recitals
router.post("/recitals", createRecital);
router.get("/recitals", listRecitals);
router.put("/recitals/:id", updateRecital);

// FAQs
router.post("/faqs", createFAQ);
router.get("/faqs", listFAQs);
router.put("/faqs/:id", updateFAQ);
router.delete("/faqs/:id", deleteFAQ);

export default router;


