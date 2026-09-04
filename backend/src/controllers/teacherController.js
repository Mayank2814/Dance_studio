import { Teacher } from "../models/Teacher.js";
import { Student } from "../models/Student.js";
import { Schedule } from "../models/Schedule.js";
import { PracticeLog } from "../models/PracticeLog.js";
import { Salary } from "../models/Salary.js";
import { Recital } from "../models/Recital.js";
import { FAQ } from "../models/FAQ.js";

export const getMyProfile = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.id }).populate("user");
    if (!teacher) return res.status(404).json({ message: "Teacher profile not found" });
    res.json(teacher);
  } catch (err) {
    next(err);
  }
};

export const getMyStudents = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.id });
    if (!teacher) return res.status(404).json({ message: "Teacher profile not found" });
    const students = await Student.find({ assignedTeacher: teacher._id }).populate("user");
    res.json(students);
  } catch (err) {
    next(err);
  }
};

export const getMySchedule = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.id });
    if (!teacher) return res.status(404).json({ message: "Teacher profile not found" });
    const schedules = await Schedule.find({ teacher: teacher._id }).populate({
      path: "students",
      populate: { path: "user" }
    });
    res.json(schedules);
  } catch (err) {
    next(err);
  }
};

export const markAttendance = async (req, res, next) => {
  try {
    const { scheduleId, status } = req.body; // status: completed/cancelled
    const teacher = await Teacher.findOne({ user: req.user.id });
    const schedule = await Schedule.findOne({ _id: scheduleId, teacher: teacher._id });
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });
    schedule.status = status || "completed";
    await schedule.save();
    res.json(schedule);
  } catch (err) {
    next(err);
  }
};

export const getStudentPracticeLogs = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.id });
    const students = await Student.find({ assignedTeacher: teacher._id });
    const studentIds = students.map((s) => s._id);
    const logs = await PracticeLog.find({ student: { $in: studentIds } }).populate({
      path: "student",
      populate: { path: "user" }
    });
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

export const addPracticeFeedback = async (req, res, next) => {
  try {
    const { logId, feedback } = req.body;
    const log = await PracticeLog.findById(logId).populate({
      path: "student",
      populate: { path: "user" }
    });
    if (!log) return res.status(404).json({ message: "Practice log not found" });
    log.teacherFeedback = feedback;
    log.feedbackGivenAt = new Date();
    await log.save();
    res.json(log);
  } catch (err) {
    next(err);
  }
};

export const getMySalaries = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.id });
    const salaries = await Salary.find({ teacher: teacher._id });
    res.json(salaries);
  } catch (err) {
    next(err);
  }
};

export const getUpcomingRecitals = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.id });
    const recitals = await Recital.find({
      mentoringTeachers: teacher._id,
      date: { $gte: new Date() }
    });
    res.json(recitals);
  } catch (err) {
    next(err);
  }
};

export const getFAQsForTeacher = async (req, res, next) => {
  try {
    const faqs = await FAQ.find({ isActive: true });
    res.json(faqs);
  } catch (err) {
    next(err);
  }
};


