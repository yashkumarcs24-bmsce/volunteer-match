import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailVerification from "./pages/EmailVerification";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Opportunities from "./pages/Opportunities";
import Messages from "./pages/Messages";
import CreateOpportunity from "./pages/CreateOpportunity";
import EditOpportunity from "./pages/EditOpportunity";
import Applicants from "./pages/Applicants";
import NotFound from "./pages/NotFound";
import AdminRoute from "./routes/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";

/* 🔐 Protected Route */
function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner-large"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user || user === false) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppContent() {
  const { dark } = useContext(AuthContext);
  const [search, setSearch] = useState("");

  return (
    <div className={`app-layout ${dark ? "dark" : ""}`}>
      <Router>
        <Navbar search={search} setSearch={setSearch} />
        <Toaster position="top-right" />

        <div className="page">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/opportunities" element={<Opportunities />} />

            {/* USER ROUTES */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard search={search} />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            <Route
              path="/messages"
              element={
                <PrivateRoute>
                  <Messages />
                </PrivateRoute>
              }
            />

            <Route
              path="/create-opportunity"
              element={
                <PrivateRoute>
                  <CreateOpportunity />
                </PrivateRoute>
              }
            />

            <Route
              path="/edit-opportunity/:id"
              element={
                <PrivateRoute>
                  <EditOpportunity />
                </PrivateRoute>
              }
            />

            <Route
              path="/applicants"
              element={
                <PrivateRoute>
                  <Applicants />
                </PrivateRoute>
              }
            />

            {/* ADMIN ROUTE */}
            <Route
              path="/admin-dashboard"
              element={
                <PrivateRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </PrivateRoute>
              }
            />

            {/* 404 ROUTE */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </div>

        <Footer />
      </Router>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
