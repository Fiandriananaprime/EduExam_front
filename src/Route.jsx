import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminExams from "./pages/admin/AdminExams";
import AdminQuestions from "./pages/admin/AdminQuestions";
import AdminExamResults from "./pages/admin/AdminExamResults";

import StudentExams from "./pages/student/StudentExams";
import StudentExam from "./pages/student/StudentExam";
import StudentExamResult from "./pages/student/StudentExamResult";
import StudentResults from "./pages/student/StudentResults";

import ProtectedRoute from "./security/ProtectedRoute";
import Layout from "./components/Layout";

import Test from "./components/ui/SideBar"
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children:[
      {
        element:<Layout />,
        children: [
          {
            path: "/admin",
            element: <AdminDashboard />,
          },
          {
            path: "/admin/students",
            element: <AdminStudents />,
          },
          {
            path: "/admin/courses",
            element: <AdminCourses />,
          },
          {
            path: "/admin/exams",
            element: <AdminExams />,
          },
          {
            path: "/admin/exams/:id/questions",
            element: <AdminQuestions />,
          },
          {
            path: "/admin/exams/:id/results",
            element: <AdminExamResults />,
          },
        ],
      }
    ]
  },

  {
    element: <ProtectedRoute allowedRoles={["student"]} />,
    children: [
      {
        element:<Layout />,
        children: [
          {
            path: "/student",
            element: <StudentExams />,
          },
          {
            path: "/student/exams/:id",
            element: <StudentExam />,
          },
          {
            path: "/student/exams/:id/result",
            element: <StudentExamResult />,
          },
          {
            path: "/student/results",
            element: <StudentResults />,
          },
        ],
      }
    ]
  },

  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
]);

export default router;