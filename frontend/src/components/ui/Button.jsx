import React from "react";
import { motion } from "framer-motion";

export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  className = "",
  disabled = false,
  icon = null,
}) {
  const baseClasses =
    "relative overflow-hidden font-semibold rounded-2xl px-6 py-3 transition-all duration-300 outline-none flex items-center justify-center gap-2 glossy-btn active:scale-95 shimmer-trigger";

  const variants = {
    primary:
      "bg-gradient-to-br from-accent-teal to-accent-blue text-deep shadow-liquid hover:shadow-glow-teal border border-white/10",
    ghost:
      "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10",
    danger:
      "bg-risk-high text-white shadow-liquid hover:bg-red-600 border border-white/5",
    disabled:
      "bg-white/5 text-textMuted cursor-not-allowed border border-white/5 opacity-50",
  };

  const currentVariant = disabled ? "disabled" : variant;

  return (
    <motion.button
      type={type}
      whileHover={disabled ? {} : { y: -1 }}
      whileTap={disabled ? {} : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={!disabled ? onClick : null}
      className={`${baseClasses} ${variants[currentVariant]} ${className}`}
      disabled={disabled}
    >
      <div className="shimmer-layer absolute inset-0 pointer-events-none" />
      {children}
      {icon && <span className="relative z-10 ml-1">{icon}</span>}
    </motion.button>
  );
}
