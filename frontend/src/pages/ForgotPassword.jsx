import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import API_CONFIG from "../api/config";

export default function ForgotPassword() {
    const [step, setStep] = useState("email"); // email → otp → reset → done
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Step 1 — Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/users/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Failed to send OTP");
                setIsLoading(false);
                return;
            }
            setStep("otp");
        } catch (err) {
            setError("Server error. Make sure backend is running.");
        }
        setIsLoading(false);
    };

    // Step 2 — Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/users/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Invalid OTP");
                setIsLoading(false);
                return;
            }
            setStep("reset");
        } catch (err) {
            setError("Server error. Make sure backend is running.");
        }
        setIsLoading(false);
    };

    // Step 3 — Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/users/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Failed to reset password");
                setIsLoading(false);
                return;
            }
            setStep("done");
        } catch (err) {
            setError("Server error. Make sure backend is running.");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#050714] flex items-center justify-center font-body relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-teal/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-purple/5 rounded-full blur-[140px] pointer-events-none" />

            <div className="w-full max-w-md p-6 relative z-10">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 justify-center mb-10">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent-teal to-accent-blue">
                        <Brain className="text-deep" size={24} />
                    </div>
                    <span className="font-display font-bold text-xl tracking-tight text-white">NeuroLoop</span>
                </Link>

                {/* Step Indicators */}
                <div className="flex items-center justify-center gap-2 mb-10">
                    {["email", "otp", "reset", "done"].map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${step === s ? "bg-accent-teal text-deep" :
                                    ["email", "otp", "reset", "done"].indexOf(step) > i ? "bg-accent-teal/30 text-accent-teal" :
                                        "bg-white/5 text-textMuted"}`}>
                                {i + 1}
                            </div>
                            {i < 3 && <div className={`w-8 h-0.5 ${["email", "otp", "reset", "done"].indexOf(step) > i ? "bg-accent-teal" : "bg-white/10"}`} />}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">

                    {/* Step 1 — Enter Email */}
                    {step === "email" && (
                        <motion.div key="email" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-display font-bold text-white mb-2">Forgot Password?</h1>
                                <p className="text-textSecondary">Enter your email and we'll send you an OTP</p>
                            </div>
                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-risk-high/10 border border-risk-high/30 flex items-center gap-3">
                                    <AlertCircle className="text-risk-high" size={18} />
                                    <p className="text-sm text-risk-high font-medium">{error}</p>
                                </div>
                            )}
                            <form onSubmit={handleSendOtp} className="space-y-5">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textMuted group-focus-within:text-accent-teal transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-bg-surface border border-border rounded-xl focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all text-white placeholder-textMuted"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <button type="submit" disabled={isLoading}
                                    className="w-full py-4 bg-gradient-to-r from-accent-teal to-accent-blue text-deep font-bold rounded-xl shadow-glow-teal transition-all flex justify-center items-center h-14">
                                    {isLoading ? <div className="w-6 h-6 border-2 border-deep/30 border-t-deep rounded-full animate-spin" /> : "Send OTP"}
                                </button>
                            </form>
                            <p className="text-center text-textSecondary text-sm mt-6">
                                Remember your password?{" "}
                                <Link to="/login" className="text-accent-teal hover:text-white font-semibold transition-colors">Sign in →</Link>
                            </p>
                        </motion.div>
                    )}

                    {/* Step 2 — Enter OTP */}
                    {step === "otp" && (
                        <motion.div key="otp" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-display font-bold text-white mb-2">Enter OTP</h1>
                                <p className="text-textSecondary">We sent a 6 digit OTP to <span className="text-accent-teal font-semibold">{email}</span></p>
                            </div>
                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-risk-high/10 border border-risk-high/30 flex items-center gap-3">
                                    <AlertCircle className="text-risk-high" size={18} />
                                    <p className="text-sm text-risk-high font-medium">{error}</p>
                                </div>
                            )}
                            <form onSubmit={handleVerifyOtp} className="space-y-5">
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    className="w-full px-6 py-5 bg-bg-surface border border-border rounded-xl focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all text-white text-3xl font-mono text-center tracking-[0.5em] placeholder-textMuted"
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                                <button type="submit" disabled={isLoading}
                                    className="w-full py-4 bg-gradient-to-r from-accent-teal to-accent-blue text-deep font-bold rounded-xl shadow-glow-teal transition-all flex justify-center items-center h-14">
                                    {isLoading ? <div className="w-6 h-6 border-2 border-deep/30 border-t-deep rounded-full animate-spin" /> : "Verify OTP"}
                                </button>
                                <button type="button" onClick={() => { setStep("email"); setError(null); }}
                                    className="w-full py-3 text-textMuted hover:text-white transition-colors text-sm">
                                    ← Change email
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* Step 3 — New Password */}
                    {step === "reset" && (
                        <motion.div key="reset" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-display font-bold text-white mb-2">New Password</h1>
                                <p className="text-textSecondary">Enter your new password below</p>
                            </div>
                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-risk-high/10 border border-risk-high/30 flex items-center gap-3">
                                    <AlertCircle className="text-risk-high" size={18} />
                                    <p className="text-sm text-risk-high font-medium">{error}</p>
                                </div>
                            )}
                            <form onSubmit={handleResetPassword} className="space-y-5">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textMuted group-focus-within:text-accent-teal transition-colors">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        minLength={6}
                                        className="w-full pl-12 pr-12 py-4 bg-bg-surface border border-border rounded-xl focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all text-white placeholder-textMuted"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-textMuted hover:text-white transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <button type="submit" disabled={isLoading}
                                    className="w-full py-4 bg-gradient-to-r from-accent-teal to-accent-blue text-deep font-bold rounded-xl shadow-glow-teal transition-all flex justify-center items-center h-14">
                                    {isLoading ? <div className="w-6 h-6 border-2 border-deep/30 border-t-deep rounded-full animate-spin" /> : "Reset Password"}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* Step 4 — Done */}
                    {step === "done" && (
                        <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                            <div className="w-20 h-20 bg-risk-low/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={40} className="text-risk-low" />
                            </div>
                            <h1 className="text-3xl font-display font-bold text-white mb-3">Password Reset!</h1>
                            <p className="text-textSecondary mb-8">Your password has been reset successfully. You can now sign in with your new password.</p>
                            <button onClick={() => navigate("/login")}
                                className="w-full py-4 bg-gradient-to-r from-accent-teal to-accent-blue text-deep font-bold rounded-xl shadow-glow-teal transition-all h-14">
                                Go to Sign In →
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}