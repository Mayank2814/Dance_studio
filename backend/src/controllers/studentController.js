import { Student } from "../models/Student.js";
import { Teacher } from "../models/Teacher.js";
import { Schedule } from "../models/Schedule.js";
import { PracticeLog } from "../models/PracticeLog.js";
import { Fee } from "../models/Fee.js";
import { Recital } from "../models/Recital.js";
import { FAQ } from "../models/FAQ.js";

export const getMyProfileStudent = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate("user")
      .populate({
        path: "assignedTeacher",
        populate: { path: "user" }
      });
    if (!student) return res.status(404).json({ message: "Student profile not found" });
    res.json(student);
  } catch (err) {
    next(err);
  }
};

export const getMyScheduleStudent = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    const schedules = await Schedule.find({ students: student._id }).populate({
      path: "teacher",
      populate: { path: "user" }
    });
    res.json(schedules);
  } catch (err) {
    next(err);
  }
};

export const submitPracticeLog = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    const { date, durationMinutes, notes } = req.body;
    const log = await PracticeLog.create({
      student: student._id,
      date,
      durationMinutes,
      notes
    });
    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
};

export const getMyPracticeLogs = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    const logs = await PracticeLog.find({ student: student._id });
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

export const getMyFees = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    const fees = await Fee.find({ student: student._id });
    res.json(
      fees.map((f) => ({
        id: f._id,
        year: f.year,
        instrument: f.instrument,
        courseLevel: f.courseLevel,
        yearlyFee: f.yearlyFee,
        amountPaid: f.amountPaid,
        balance: f.balance,
        status: f.status
      }))
    );
  } catch (err) {
    next(err);
  }
};

export const getMyRecitals = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    const recitals = await Recital.find({ students: student._id });
    res.json(recitals);
  } catch (err) {
    next(err);
  }
};

export const getFAQsForStudent = async (req, res, next) => {
  try {
    const faqs = await FAQ.find({ isActive: true });
    res.json(faqs);
  } catch (err) {
    next(err);
  }
};

export const getAvailableClasses = async (req, res, next) => {
  try {
    // For admins, show all available classes (they don't have a student profile)
    // For students, exclude classes they're already enrolled in
    const now = new Date();
    let query = {
      status: "scheduled",
      startTime: { $gte: now }
    };

    // If user is a student, exclude classes they're already enrolled in
    if (req.user.role === "student") {
      const student = await Student.findOne({ user: req.user.id });
      if (!student) return res.status(404).json({ message: "Student profile not found" });
      query.students = { $ne: student._id };
    }

    const availableSchedules = await Schedule.find(query)
      .populate({
        path: "teacher",
        populate: { path: "user" }
      })
      .populate({
        path: "students",
        populate: { path: "user" }
      })
      .sort({ startTime: 1 });

    res.json(availableSchedules);
  } catch (err) {
    next(err);
  }
};

export const enrollInClass = async (req, res, next) => {
  try {
    const { scheduleId } = req.body;
    const student = await Student.findOne({ user: req.user.id });
    if (!student) return res.status(404).json({ message: "Student profile not found" });

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    if (schedule.status !== "scheduled") {
      return res.status(400).json({ message: "Cannot enroll in a cancelled or completed class" });
    }

    if (schedule.students.includes(student._id)) {
      return res.status(400).json({ message: "You are already enrolled in this class" });
    }

    // Check if class is in the past
    if (new Date(schedule.startTime) < new Date()) {
      return res.status(400).json({ message: "Cannot enroll in a past class" });
    }

    schedule.students.push(student._id);
    await schedule.save();

    const populatedSchedule = await Schedule.findById(scheduleId)
      .populate({
        path: "teacher",
        populate: { path: "user" }
      })
      .populate({
        path: "students",
        populate: { path: "user" }
      });

    res.json({
      message: "Successfully enrolled in class",
      schedule: populatedSchedule
    });
  } catch (err) {
    next(err);
  }
};


