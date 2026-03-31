import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ✅ MIGRATED: Firebase Auth
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Fetch extra profile data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      // Clear previous user's data but keep language prefs
      Object.keys(localStorage).forEach(key => {
        if (key !== 'i18nextLng' && key !== 'preferredLanguage') {
          localStorage.removeItem(key);
        }
      });

      // 3. Save to localStorage so Dashboard/Sidebar can read it
      localStorage.setItem("authToken", await user.getIdToken());
      localStorage.setItem("user", JSON.stringify({
        name: userData.name || user.displayName || user.email.split("@")[0],
        email: user.email,
        joined: userData.joined || user.metadata.creationTime,
        streak: userData.streak || 0,
      }));

      // 4. Restore preferred language if saved
      if (userData.language) {
        localStorage.setItem("preferredLanguage", userData.language);
      }

      navigate("/dashboard");

    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found. Please register first.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/invalid-credential":
          setError("Invalid email or password. Please try again.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please wait a moment and try again.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── UI below is UNCHANGED ──────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#050714] flex font-body relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-teal/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-purple/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Left Pane */}
      <div className="hidden lg:flex w-[45%] relative border-r border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/2 to-transparent pointer-events-none" />
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-accent-teal/10 rounded-full blur-[100px]" />
        <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
          <Link to="/" className="flex items-center gap-2 group w-max">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent-teal to-accent-blue">
              <Brain className="text-deep" size={24} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">NeuroLoop</span>
          </Link>
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="liquid-glass p-10 max-w-md mb-12 shadow-liquid relative group overflow-hidden border border-white/10"
            >
              <div className="shimmer-layer opacity-20" />
              <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                <Brain size={160} />
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-[10px] font-black tracking-[0.3em] text-accent-teal uppercase mb-4">
                {t("auth.clinicalInsight") || "Clinical Insight"}
              </motion.div>
              <h3 className="text-2xl font-display font-black text-white mb-4 relative z-10 leading-tight">
                {t("auth.earlyDetection") || "Early Detection Saves Lives"}
              </h3>
              <p className="text-sm text-textSecondary relative z-10 leading-relaxed font-medium">
                {t("auth.aiAssessment") || "AI-powered cognitive assessment platform for early dementia detection."}
              </p>
            </motion.div>
            <div className="flex gap-6 mt-12 text-sm text-textMuted font-medium">
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-risk-low" /> {t("auth.hipaa") || "HIPAA Compliant"}</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-risk-low" /> {t("auth.encryption") || "Encrypted"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 relative">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
              {t("auth.loginTitle") || "Welcome Back"}
            </h1>
            <p className="text-textSecondary">
              {t("auth.loginSubtitle") || "Sign in to your account"}
            </p>
          </div>

          <div className="flex mb-10 border-b border-white/5 pb-1">
            <Link to="/login" className="flex-1 pb-4 text-center border-b-2 border-accent-teal text-accent-teal text-[11px] font-black tracking-widest uppercase">
              {t("auth.authTab") || "Sign In"}
            </Link>
            <Link to="/register" className="flex-1 pb-4 text-center text-textMuted hover:text-white transition-colors text-[11px] font-black tracking-widest uppercase">
              {t("auth.regTab") || "Register"}
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 rounded-xl bg-risk-high/10 border border-risk-high/30 flex items-start gap-3">
                <AlertCircle className="text-risk-high mt-0.5" size={18} />
                <div>
                  <p className="text-sm text-risk-high font-medium">{error}</p>
                  {error.includes("register") && (
                    <Link to="/register" className="text-xs text-accent-teal underline mt-1 block">
                      Click here to create an account →
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textMuted group-focus-within:text-accent-teal transition-colors">
                <Mail size={20} />
              </div>
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-4 bg-bg-surface border border-border rounded-xl focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all text-white placeholder-textMuted"
                placeholder={t("auth.emailLabel") || "Email address"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textMuted group-focus-within:text-accent-teal transition-colors">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-12 pr-12 py-4 bg-bg-surface border border-border rounded-xl focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all text-white placeholder-textMuted"
                placeholder={t("auth.passwordLabel") || "Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-textMuted hover:text-white transition-colors" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-textSecondary">{t("auth.rememberMe") || "Remember me"}</span>
              <Link to="/forgot-password" className="text-accent-teal hover:text-white transition-colors font-medium">
                {t("auth.forgotPassword") || "Forgot password?"}
              </Link>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-4 bg-gradient-to-r from-accent-teal to-accent-blue text-deep font-bold rounded-xl shadow-glow-teal hover:shadow-[0_0_40px_rgba(0,212,170,0.3)] transition-all flex justify-center items-center h-14"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-deep/30 border-t-deep rounded-full animate-spin" />
                ) : (
                  t("auth.loginButton") || "Sign In"
                )}
              </button>
            </motion.div>
          </form>

          <p className="text-center text-textSecondary text-sm mt-8">
            {t("auth.noAccount") || "Don't have an account?"}{" "}
            <Link to="/register" className="text-accent-teal hover:text-white font-semibold transition-colors">
              {t("auth.registerLink") || "Create one →"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}