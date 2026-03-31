import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AssessmentHub from "./pages/AssessmentHub";
import AssessmentWrapper from "./pages/AssessmentWrapper";
import VoiceAnalysis from "./pages/VoiceAnalysis";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import VideoAnalysis from "./pages/VideoAnalysis";
import ProtectedRoute from "./components/ProtectedRoute";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const saved = localStorage.getItem("preferredLanguage");
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-deep text-textPrimary font-body">
      <main className="flex-grow">
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/hub" element={<ProtectedRoute><AssessmentHub /></ProtectedRoute>} />
          <Route path="/voice" element={<ProtectedRoute><VoiceAnalysis /></ProtectedRoute>} />
          <Route path="/video-analysis" element={<ProtectedRoute><VideoAnalysis /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/test/:moduleId" element={<ProtectedRoute><AssessmentWrapper /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;