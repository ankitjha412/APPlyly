import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Applications from "./pages/Applications";
import ApplicationDetail from "./pages/ApplicationDetail";
import ApplicationForm from "./pages/ApplicationForm";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/auth" element={<Auth />} />

      {/* Protected + Layout (Sidebar wrapper) */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Default redirect */}
        <Route index element={<Navigate to="applications" />} />

        {/* Applications */}
        <Route path="applications" element={<Applications />} />
        <Route path="applications/:id" element={<ApplicationDetail />} />

        {/* Add Candidate */}
        <Route path="apply" element={<ApplicationForm />} />

        {/* Analytics */}
        <Route path="analytics" element={<Analytics />} />

        {/* Profile */}
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Catch-all (redirect unknown paths) */}
      <Route path="*" element={<Navigate to="/auth" />} />
    </Routes>
  );
}
