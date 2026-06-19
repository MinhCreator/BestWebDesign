import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, isSuperAdmin, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requiredRole === "superadmin" && !isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-xl">
        Access denied. Superadmin only.
      </div>
    );
  }

  return children;
}
