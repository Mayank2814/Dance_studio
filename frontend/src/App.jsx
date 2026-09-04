import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { DashboardLayout } from "./components/Layout/DashboardLayout.jsx";
import AdminOverview from "./pages/admin/AdminOverview.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminSchedules from "./pages/admin/AdminSchedules.jsx";
import AdminFees from "./pages/admin/AdminFees.jsx";
import AdminSalaries from "./pages/admin/AdminSalaries.jsx";
import AdminRecitals from "./pages/admin/AdminRecitals.jsx";
import AdminFaqs from "./pages/admin/AdminFaqs.jsx";
import TeacherOverview from "./pages/teacher/TeacherOverview.jsx";
import TeacherStudents from "./pages/teacher/TeacherStudents.jsx";
import TeacherSchedules from "./pages/teacher/TeacherSchedules.jsx";
import TeacherPracticeLogs from "./pages/teacher/TeacherPracticeLogs.jsx";
import TeacherSalaries from "./pages/teacher/TeacherSalaries.jsx";
import TeacherRecitals from "./pages/teacher/TeacherRecitals.jsx";
import TeacherFaqs from "./pages/teacher/TeacherFaqs.jsx";
import StudentOverview from "./pages/student/StudentOverview.jsx";
import StudentEnroll from "./pages/student/StudentEnroll.jsx";
import StudentSchedules from "./pages/student/StudentSchedules.jsx";
import StudentPracticeLogs from "./pages/student/StudentPracticeLogs.jsx";
import StudentFees from "./pages/student/StudentFees.jsx";
import StudentRecitals from "./pages/student/StudentRecitals.jsx";
import StudentFaqs from "./pages/student/StudentFaqs.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route
          path="/admin"
          element={
            <DashboardLayout role="admin">
              <AdminOverview />
            </DashboardLayout>
          }
        />
        <Route
          path="/admin/users"
          element={
            <DashboardLayout role="admin">
              <AdminUsers />
            </DashboardLayout>
          }
        />
        <Route
          path="/admin/schedules"
          element={
            <DashboardLayout role="admin">
              <AdminSchedules />
            </DashboardLayout>
          }
        />
        <Route
          path="/admin/enroll"
          element={
            <DashboardLayout role="admin">
              <StudentEnroll />
            </DashboardLayout>
          }
        />
        <Route
          path="/admin/fees"
          element={
            <DashboardLayout role="admin">
              <AdminFees />
            </DashboardLayout>
          }
        />
        <Route
          path="/admin/salaries"
          element={
            <DashboardLayout role="admin">
              <AdminSalaries />
            </DashboardLayout>
          }
        />
        <Route
          path="/admin/recitals"
          element={
            <DashboardLayout role="admin">
              <AdminRecitals />
            </DashboardLayout>
          }
        />
        <Route
          path="/admin/faqs"
          element={
            <DashboardLayout role="admin">
              <AdminFaqs />
            </DashboardLayout>
          }
        />
      </Route>

      {/* Teacher */}
      <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
        <Route
          path="/teacher"
          element={
            <DashboardLayout role="teacher">
              <TeacherOverview />
            </DashboardLayout>
          }
        />
        <Route
          path="/teacher/students"
          element={
            <DashboardLayout role="teacher">
              <TeacherStudents />
            </DashboardLayout>
          }
        />
        <Route
          path="/teacher/schedules"
          element={
            <DashboardLayout role="teacher">
              <TeacherSchedules />
            </DashboardLayout>
          }
        />
        <Route
          path="/teacher/practice-logs"
          element={
            <DashboardLayout role="teacher">
              <TeacherPracticeLogs />
            </DashboardLayout>
          }
        />
        <Route
          path="/teacher/salaries"
          element={
            <DashboardLayout role="teacher">
              <TeacherSalaries />
            </DashboardLayout>
          }
        />
        <Route
          path="/teacher/recitals"
          element={
            <DashboardLayout role="teacher">
              <TeacherRecitals />
            </DashboardLayout>
          }
        />
        <Route
          path="/teacher/faqs"
          element={
            <DashboardLayout role="teacher">
              <TeacherFaqs />
            </DashboardLayout>
          }
        />
      </Route>

      {/* Student */}
      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route
          path="/student"
          element={
            <DashboardLayout role="student">
              <StudentOverview />
            </DashboardLayout>
          }
        />
        <Route
          path="/student/enroll"
          element={
            <DashboardLayout role="student">
              <StudentEnroll />
            </DashboardLayout>
          }
        />
        <Route
          path="/student/schedules"
          element={
            <DashboardLayout role="student">
              <StudentSchedules />
            </DashboardLayout>
          }
        />
        <Route
          path="/student/practice-logs"
          element={
            <DashboardLayout role="student">
              <StudentPracticeLogs />
            </DashboardLayout>
          }
        />
        <Route
          path="/student/fees"
          element={
            <DashboardLayout role="student">
              <StudentFees />
            </DashboardLayout>
          }
        />
        <Route
          path="/student/recitals"
          element={
            <DashboardLayout role="student">
              <StudentRecitals />
            </DashboardLayout>
          }
        />
        <Route
          path="/student/faqs"
          element={
            <DashboardLayout role="student">
              <StudentFaqs />
            </DashboardLayout>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;


