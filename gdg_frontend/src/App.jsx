import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoutes";
import StudentLayout from "./Layouts/StudentLayout";
import AdminLayout from "./Layouts/AdminLayout";
import ReportIssue from "./pages/ReportIssue";
import NotReady from "./pages/NotReady";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* -------- PUBLIC ROUTES -------- */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* -------- STUDENT ROUTES -------- */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="report" element={<ReportIssue />} />
          <Route path="profile" element={<NotReady />} />
          <Route path="*" element={<NotReady />} />
        </Route>

        {/* -------- ADMIN ROUTES -------- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="*" element={<NotReady />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
