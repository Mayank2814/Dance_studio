import { User } from "../models/User.js";
import { Teacher } from "../models/Teacher.js";
import { Student } from "../models/Student.js";
import { Schedule } from "../models/Schedule.js";
import { PracticeLog } from "../models/PracticeLog.js";
import { Fee } from "../models/Fee.js";
import { Salary } from "../models/Salary.js";
import { Recital } from "../models/Recital.js";
import { FAQ } from "../models/FAQ.js";
import { ROLES } from "../utils/roles.js";

// ==== USER MANAGEMENT ====

export const createTeacher = async (req, res, next) => {
  try {
    const { name, email, username, password, danceStyles, bio, salaryType, salaryAmount } =
      req.body;

    const user = await User.create({
      name,
      email,
      username,
      password,
      role: ROLES.TEACHER,
      forcePasswordChange: true
    });

    const teacher = await Teacher.create({
      user: user._id,
      danceStyles,
      bio,
      salaryType,
      salaryAmount
    });

    res.status(201).json({ user, teacher });
  } catch (err) {
    next(err);
  }
};

export const updateTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, username, isActive, danceStyles, bio, salaryType, salaryAmount } =
      req.body;

    const teacher = await Teacher.findById(id).populate("user");
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    if (name !== undefined) teacher.user.name = name;
    if (email !== undefined) teacher.user.email = email;
    if (username !== undefined) teacher.user.username = username;
    if (isActive !== undefined) teacher.user.isActive = isActive;
    if (danceStyles !== undefined) teacher.danceStyles = danceStyles;
    if (bio !== undefined) teacher.bio = bio;
    if (salaryType !== undefined) teacher.salaryType = salaryType;
    if (salaryAmount !== undefined) teacher.salaryAmount = salaryAmount;

    await teacher.user.save();
    await teacher.save();

    res.json({ teacher });
  } catch (err) {
    next(err);
  }
};

export const listTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find().populate("user");
    res.json(teachers);
  } catch (err) {
    next(err);
  }
};

export const createStudent = async (req, res, next) => {
  try {
    const {
      name,
      email,
      username,
      password,
      assignedTeacherId,
      instrument,
      courseLevel
    } = req.body;

    const user = await User.create({
      name,
      email,
      username,
      password,
      role: ROLES.STUDENT,
      forcePasswordChange: true
    });

    const student = await Student.create({
      user: user._id,
      assignedTeacher: assignedTeacherId || undefined,
      instrument,
      courseLevel
    });

    res.status(201).json({ user, student });
  } catch (err) {
    next(err);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      username,
      isActive,
      assignedTeacherId,
      instrument,
      courseLevel
    } = req.body;

    const student = await Student.findById(id).populate("user");
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (name !== undefined) student.user.name = name;
    if (email !== undefined) student.user.email = email;
    if (username !== undefined) student.user.username = username;
    if (isActive !== undefined) student.user.isActive = isActive;
    if (assignedTeacherId !== undefined) student.assignedTeacher = assignedTeacherId;
    if (instrument !== undefined) student.instrument = instrument;
    if (courseLevel !== undefined) student.courseLevel = courseLevel;

    await student.user.save();
    await student.save();

    res.json({ student });
  } catch (err) {
    next(err);
  }
};

export const listStudents = async (req, res, next) => {
  try {
    const students = await Student.find()
      .populate("user")
      .populate({
        path: "assignedTeacher",
        populate: { path: "user" }
      });
    res.json(students);
  } catch (err) {
    next(err);
  }
};

// ==== SCHEDULING ====

export const createSchedule = async (req, res, next) => {
  try {
    const { teacherId, studentIds, startTime, endTime, room } = req.body;

    // Basic conflict check: same teacher overlapping times
    const conflict = await Schedule.findOne({
      teacher: teacherId,
      startTime: { $lt: new Date(endTime) },
      endTime: { $gt: new Date(startTime) }
    });
    if (conflict) {
      return res.status(400).json({ message: "Scheduling conflict for teacher" });
    }

    const schedule = await Schedule.create({
      teacher: teacherId,
      students: studentIds,
      startTime,
      endTime,
      room
    });
    res.status(201).json(schedule);
  } catch (err) {
    next(err);
  }
};

export const updateSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { teacherId, studentIds, startTime, endTime, room, status } = req.body;

    const schedule = await Schedule.findById(id);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    if (teacherId) schedule.teacher = teacherId;
    if (studentIds) schedule.students = studentIds;
    if (startTime) schedule.startTime = startTime;
    if (endTime) schedule.endTime = endTime;
    if (room) schedule.room = room;
    if (status) schedule.status = status;

    await schedule.save();
    res.json(schedule);
  } catch (err) {
    next(err);
  }
};

export const listSchedules = async (req, res, next) => {
  try {
    const schedules = await Schedule.find()
      .populate({
        path: "teacher",
        populate: { path: "user" }
      })
      .populate({
        path: "students",
        populate: { path: "user" }
      });
    res.json(schedules);
  } catch (err) {
    next(err);
  }
};

// ==== PRACTICE LOGS (READ-ONLY FOR ADMIN) ====

export const listPracticeLogs = async (req, res, next) => {
  try {
    const logs = await PracticeLog.find()
      .populate("student");
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

// ==== FEES ====

export const upsertFee = async (req, res, next) => {
  try {
    const { studentId, year, instrument, courseLevel, yearlyFee, amountPaid } = req.body;
    let fee = await Fee.findOne({ student: studentId, year });
    if (!fee) {
      fee = await Fee.create({
        student: studentId,
        year,
        instrument,
        courseLevel,
        yearlyFee,
        amountPaid
      });
    } else {
      if (instrument !== undefined) fee.instrument = instrument;
      if (courseLevel !== undefined) fee.courseLevel = courseLevel;
      if (yearlyFee !== undefined) fee.yearlyFee = yearlyFee;
      if (amountPaid !== undefined) fee.amountPaid = amountPaid;
      await fee.save();
    }
    res.json(fee);
  } catch (err) {
    next(err);
  }
};

export const listFees = async (req, res, next) => {
  try {
    const fees = await Fee.find().populate({
      path: "student",
      populate: { path: "user" }
    });
    res.json(fees);
  } catch (err) {
    next(err);
  }
};

// ==== SALARIES ====

export const createOrUpdateSalary = async (req, res, next) => {
  try {
    const { teacherId, period, type, amount, status } = req.body;
    let salary = await Salary.findOne({ teacher: teacherId, period });
    if (!salary) {
      salary = await Salary.create({ teacher: teacherId, period, type, amount, status });
    } else {
      if (type !== undefined) salary.type = type;
      if (amount !== undefined) salary.amount = amount;
      if (status !== undefined) salary.status = status;
      await salary.save();
    }
    res.json(salary);
  } catch (err) {
    next(err);
  }
};

export const listSalaries = async (req, res, next) => {
  try {
    const salaries = await Salary.find().populate({
      path: "teacher",
      populate: { path: "user" }
    });
    res.json(salaries);
  } catch (err) {
    next(err);
  }
};

// ==== RECITALS ====

export const createRecital = async (req, res, next) => {
  try {
    const { title, date, description, students, mentoringTeachers, preparationStatus } =
      req.body;
    const recital = await Recital.create({
      title,
      date,
      description,
      students,
      mentoringTeachers,
      preparationStatus
    });
    res.status(201).json(recital);
  } catch (err) {
    next(err);
  }
};

export const updateRecital = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, date, description, students, mentoringTeachers, preparationStatus } =
      req.body;
    const recital = await Recital.findById(id);
    if (!recital) return res.status(404).json({ message: "Recital not found" });

    if (title !== undefined) recital.title = title;
    if (date !== undefined) recital.date = date;
    if (description !== undefined) recital.description = description;
    if (students !== undefined) recital.students = students;
    if (mentoringTeachers !== undefined) recital.mentoringTeachers = mentoringTeachers;
    if (preparationStatus !== undefined) recital.preparationStatus = preparationStatus;
    await recital.save();
    res.json(recital);
  } catch (err) {
    next(err);
  }
};

export const listRecitals = async (req, res, next) => {
  try {
    const recitals = await Recital.find()
      .populate("students")
      .populate("mentoringTeachers");
    res.json(recitals);
  } catch (err) {
    next(err);
  }
};

// ==== FAQ MANAGEMENT ====

export const createFAQ = async (req, res, next) => {
  try {
    const { question, answer, isActive } = req.body;
    const faq = await FAQ.create({ question, answer, isActive });
    res.status(201).json(faq);
  } catch (err) {
    next(err);
  }
};

export const updateFAQ = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { question, answer, isActive } = req.body;
    const faq = await FAQ.findById(id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    if (question !== undefined) faq.question = question;
    if (answer !== undefined) faq.answer = answer;
    if (isActive !== undefined) faq.isActive = isActive;
    await faq.save();
    res.json(faq);
  } catch (err) {
    next(err);
  }
};

export const deleteFAQ = async (req, res, next) => {
  try {
    const { id } = req.params;
    await FAQ.findByIdAndDelete(id);
    res.json({ message: "FAQ deleted" });
  } catch (err) {
    next(err);
  }
};

export const listFAQs = async (req, res, next) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    res.json(faqs);
  } catch (err) {
    next(err);
  }
};

// ==== CONTACT NUMBER MANAGEMENT ====

export const updateTeacherContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { contactNumber } = req.body;

    const teacher = await Teacher.findById(id).populate("user");
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    // Validate contact number format
    if (contactNumber && !/^\+?[\d\s\-\(\)]+$/.test(contactNumber)) {
      return res.status(400).json({ message: "Invalid contact number format" });
    }

    teacher.user.contactNumber = contactNumber || teacher.user.contactNumber;
    await teacher.user.save();

    res.json({ message: "Teacher contact number updated successfully", teacher });
  } catch (err) {
    next(err);
  }
};

export const updateStudentContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { contactNumber } = req.body;

    const student = await Student.findById(id).populate("user");
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Validate contact number format
    if (contactNumber && !/^\+?[\d\s\-\(\)]+$/.test(contactNumber)) {
      return res.status(400).json({ message: "Invalid contact number format" });
    }

    student.user.contactNumber = contactNumber || student.user.contactNumber;
    await student.user.save();

    res.json({ message: "Student contact number updated successfully", student });
  } catch (err) {
    next(err);
  }
};


