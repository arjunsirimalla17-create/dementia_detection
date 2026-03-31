import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, User, Mail, Lock, Phone, Eye, EyeOff,
  Globe, CheckCircle2, AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../components/ui/Button";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", age: "",
    gender: "Male", language: "en", password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculatePasswordStrength = (pass) => {
    if (pass.length === 0) return 0;
    let strength = 0;
    if (pass.length > 5) strength += 33;
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength += 33;
    if (pass.match(/\d/) && pass.match(/[^a-zA-Z\d]/)) strength += 34;
    return strength;
  };

  const passStrength = calculatePasswordStrength(formData.password);

  let strengthColor = "bg-bg-elevated";
  let strengthText = "";
  if (passStrength > 0 && passStrength <= 33) {
    strengthColor = "bg-risk-high"; strengthText = t("auth.weak");
  } else if (passStrength > 33 && passStrength <= 66) {
    strengthColor = "bg-risk-moderate"; strengthText = t("auth.fair");
  } else if (passStrength > 66) {
    strengthColor = "bg-risk-low"; strengthText = t("auth.strong");
  }

  // ✅ MIGRATED: Firebase Auth + Firestore
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, formData.email, formData.password
      );
      const user = userCredential.user;

      // 2. Set display name in Firebase Auth
      await updateProfile(user, { displayName: formData.name });

      // Clear previous user's data but keep language prefs
      Object.keys(localStorage).forEach(key => {
        if (key !== 'i18nextLng' && key !== 'preferredLanguage') {
          localStorage.removeItem(key);
        }
      });

      // 3. Save extra details (phone, age, gender, language) to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        gender: formData.gender,
        language: formData.language,
        joined: new Date().toISOString(),
        streak: 0,
      });

      // 4. Save to localStorage so Dashboard/Sidebar can read it
      localStorage.setItem("authToken", await user.getIdToken());
      localStorage.setItem("user", JSON.stringify({
        name: formData.name,
        email: formData.email,
        joined: new Date().toISOString(),
        streak: 0,
      }));

      // 5. Apply selected language preference
      localStorage.setItem("preferredLanguage", formData.language);

      navigate("/dashboard");

    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("An account with this email already exists.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/weak-password":
          setError("Password must be at least 6 characters.");
          break;
        default:
          setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── UI below is UNCHANGED ──────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#050714] flex font-body relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-teal/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Left Pane */}
      <div className="hidden lg:flex w-[45%] relative border-r border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/2 to-transparent pointer-events-none" />
        <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
          <Link to="/" className="flex items-center gap-2 group w-max">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent-teal to-accent-blue">
              <Brain className="text-deep leading-none" size={24} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent-teal group-hover:to-accent-blue transition-all">
              NeuroLoop
            </span>
          </Link>
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="liquid-glass p-10 max-w-md mb-12 shadow-liquid relative group overflow-hidden border border-white/10"
            >
              <div className="shimmer-layer opacity-20" />
              <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                <Brain size={160} />
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="text-[10px] font-black tracking-[0.3em] text-accent-teal uppercase mb-4">
                {t("auth.clinicalInsight")}
              </motion.div>
              <h3 className="text-2xl font-display font-black text-white mb-6 relative z-10 leading-tight">
                {t("auth.earlyDetection")}
              </h3>
              <ul className="space-y-4 relative z-10">
                {[
                  { icon: <CheckCircle2 size={16} />, text: t("auth.hipaa") },
                  { icon: <CheckCircle2 size={16} />, text: "6 Clinical Cognitive Modules" },
                  { icon: <CheckCircle2 size={16} />, text: "AI Voice & Phonation Analysis" },
                  { icon: <CheckCircle2 size={16} />, text: "Secure Physician Linkage" }
                ].map((item, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + (i * 0.1) }}
                    className="flex items-center gap-3 text-sm text-textSecondary font-medium">
                    <span className="text-accent-teal">{item.icon}</span>
                    {item.text}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Pane */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 lg:p-12 relative overflow-y-auto">
        <div className="w-full max-w-lg my-auto">
          <div className="text-center mb-10 mt-8 lg:mt-0">
            <h1 className="text-3xl font-display font-bold text-white mb-3">{t("auth.registerTitle")}</h1>
            <p className="text-textSecondary">{t("auth.registerSubtitle")}</p>
          </div>

          <div className="flex mb-10 border-b border-white/5 pb-1">
            <Link to="/login" className="flex-1 pb-4 text-center text-textMuted hover:text-white transition-colors text-[11px] font-black tracking-widest uppercase">
              {t("auth.authTab")}
            </Link>
            <Link to="/register" className="flex-1 pb-4 text-center border-b-2 border-accent-teal text-accent-teal text-[11px] font-black tracking-widest uppercase">
              {t("auth.regTab")}
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-6 p-4 rounded-xl bg-risk-high/10 border border-risk-high/30 flex items-start gap-3">
                <AlertCircle className="text-risk-high mt-0.5" size={18} />
                <p className="text-sm text-risk-high font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleRegister} className="space-y-5 pb-12">
            {/* Name */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textMuted group-focus-within:text-accent-teal transition-colors">
                <User size={20} />
              </div>
              <input type="text" name="name" id="name" required
                className="w-full pl-12 pr-4 py-4 bg-bg-surface border border-border rounded-xl focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all text-white placeholder-transparent peer"
                placeholder={t("auth.fullName")} value={formData.name} onChange={handleChange} />
              <label htmlFor="name" className="absolute left-12 -top-2.5 bg-bg-surface px-1 text-xs font-semibold text-textMuted transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-textSecondary peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-accent-teal pointer-events-none">
                {t("auth.fullName")}
              </label>
            </div>

            {/* Email */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textMuted group-focus-within:text-accent-teal transition-colors">
                <Mail size={20} />
              </div>
              <input type="email" name="email" id="email" required
                className="w-full pl-12 pr-4 py-4 bg-bg-surface border border-border rounded-xl focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all text-white placeholder-transparent peer"
                placeholder={t("auth.emailLabel")} value={formData.email} onChange={handleChange} />
              <label htmlFor="email" className="absolute left-12 -top-2.5 bg-bg-surface px-1 text-xs font-semibold text-textMuted transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-textSecondary peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-accent-teal pointer-events-none">
                {t("auth.emailLabel")}
              </label>
            </div>

            {/* Phone & Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textMuted group-focus-within:text-accent-teal transition-colors">
                  <Phone size={20} />
                </div>
                <input type="tel" name="phone" id="phone"
                  className="w-full pl-12 pr-4 py-4 bg-bg-surface border border-border rounded-xl focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all text-white placeholder-transparent peer"
                  placeholder={t("auth.phone")} value={formData.phone} onChange={handleChange} />
                <label htmlFor="phone" className="absolute left-12 -top-2.5 bg-bg-surface px-1 text-xs font-semibold text-textMuted transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-textSecondary peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-accent-teal pointer-events-none">
                  {t("auth.phone")}
                </label>
              </div>
              <div className="relative group">
                <input type="number" name="age" id="age" min="18" max="120"
                  className="w-full px-4 py-4 bg-bg-surface border border-border rounded-xl focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all text-white placeholder-transparent peer"
                  placeholder={t("auth.age")} value={formData.age} onChange={handleChange} />
                <label htmlFor="age" className="absolute left-4 -top-2.5 bg-bg-surface px-1 text-xs font-semibold text-textMuted transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-textSecondary peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-accent-teal pointer-events-none">
                  {t("auth.age")}
                </label>
              </div>
            </div>

            {/* Gender & Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative group flex items-center bg-white/5 border border-white/10 rounded-xl p-1 overflow-hidden">
                {["Male", "Female", "Other"].map((g) => (
                  <label key={g} className={`flex-1 text-[10px] font-black tracking-widest uppercase py-2.5 rounded-lg cursor-pointer transition-all text-center ${formData.gender === g ? "bg-white/10 text-accent-teal shadow-liquid" : "text-textMuted hover:text-white"}`}>
                    <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} className="hidden" />
                    {g}
                  </label>
                ))}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textMuted">
                  <Globe size={20} />
                </div>
                <select name="language" id="language"
                  className="w-full pl-12 pr-10 py-4 bg-bg-surface border border-border rounded-xl focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all text-white appearance-none cursor-pointer"
                  value={formData.language} onChange={handleChange}>
                  <option value="en">English (US)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="te">Telugu (తెలుగు)</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-textMuted">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textMuted group-focus-within:text-accent-teal transition-colors">
                <Lock size={20} />
              </div>
              <input type={showPassword ? "text" : "password"} name="password" id="password" required
                className="w-full pl-12 pr-12 py-4 bg-bg-surface border border-border rounded-xl focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all text-white placeholder-transparent peer"
                placeholder={t("auth.passwordLabel")} value={formData.password} onChange={handleChange} />
              <label htmlFor="password" className="absolute left-12 -top-2.5 bg-bg-surface px-1 text-xs font-semibold text-textMuted transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-textSecondary peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-accent-teal pointer-events-none">
                {t("auth.passwordLabel")}
              </label>
              <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-textMuted hover:text-white transition-colors" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Strength */}
            {formData.password.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-textSecondary">{t("auth.passStrength")}</span>
                  <span className={`text-xs font-bold ${strengthColor.replace("bg-", "text-")}`}>{strengthText}</span>
                </div>
                <div className="flex gap-1 h-1.5 w-full bg-bg-elevated rounded-full overflow-hidden">
                  <motion.div className={`h-full ${strengthColor}`} initial={{ width: 0 }} animate={{ width: `${passStrength}%` }} transition={{ duration: 0.3 }} />
                </div>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-2">
              <button type="submit" disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-accent-teal to-accent-blue text-deep font-bold rounded-xl shadow-glow-teal hover:shadow-[0_0_40px_rgba(0,212,170,0.3)] transition-all flex justify-center items-center h-14">
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-deep/30 border-t-deep rounded-full animate-spin" />
                ) : (
                  t("auth.registerButton")
                )}
              </button>
            </motion.div>

            <p className="text-center text-xs text-textMuted mt-4 px-8 leading-relaxed">
              {t("auth.agreeTerms")}{" "}
              <Link to="/terms" className="text-textSecondary hover:text-white underline decoration-border underline-offset-2">{t("auth.terms")}</Link>{" "}
              {t("common.and") || "and"}{" "}
              <Link to="/privacy" className="text-textSecondary hover:text-white underline decoration-border underline-offset-2">{t("auth.privacy")}</Link>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}