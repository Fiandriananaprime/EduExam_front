import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== allowedRoles) {
    if (role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }

    if (role === "STUDENT") {
      return <Navigate to="/student" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;