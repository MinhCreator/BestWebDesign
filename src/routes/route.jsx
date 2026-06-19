import { AppConfig } from "../config/app.config";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../components/admin/ProtectedRoute";
import { AuthProvider } from "../context/AuthContext";

const adminPaths = [
  "/admin/login",
  "/admin/dashboard",
  "/admin/registrations",
  "/admin/events",
  "/admin/content",
  "/admin/health",
  "/admin/users",
];

const RouterSupport = () => {
  const routers = AppConfig.Routes;
  const publicRoutes = routers.filter((r) => !adminPaths.includes(r.path));
  const adminRoutes = routers.filter((r) => adminPaths.includes(r.path));
  // return (
  //   <BrowserRouter>
  //     <Routes>
  //       <Route element={<Layout />}>
  //         {routers.map((route, index) => (
  //           <Route
  //             key={index}
  //             path={route.path}
  //             element={route.isDisableRoute ? null : route.component?.()}
  //           />
  //         ))}
  //       </Route>
  //     </Routes>
  //   </BrowserRouter>
  // );
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes with main Layout */}
          <Route element={<Layout />}>
            {publicRoutes.map((route, index) => (
              <Route
                key={`public-${index}`}
                path={route.path}
                element={route.isDisableRoute ? null : route.component?.()}
              />
            ))}
          </Route>

          {/* Admin routes with AdminLayout */}
          <Route element={<AdminLayout />}>
            {adminRoutes
              .filter((r) => r.path !== "/admin/login")
              .map((route, index) => (
                <Route
                  key={`admin-${index}`}
                  path={route.path}
                  element={
                    <ProtectedRoute
                      requiredRole={
                        route.path === "/admin/users" ? "superadmin" : null
                      }
                    >
                      {route.component?.()}
                    </ProtectedRoute>
                  }
                />
              ))}
          </Route>

          {/* Admin login (no layout, no guard) */}
          <Route
            path="/admin/login"
            element={adminRoutes
              .find((r) => r.path === "/admin/login")
              ?.component?.()}
          />

          {/* /admin redirects to dashboard */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default RouterSupport;
