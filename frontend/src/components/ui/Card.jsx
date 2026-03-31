import React from "react";
import { motion } from "framer-motion";

export default function Card({
  children,
  className = "",
  elevated = false,
  hoverable = true,
  delay = 0,
}) {
  const baseClasses = "liquid-glass overflow-hidden relative group";
  const hoverClasses = hoverable ? "shimmer-trigger" : "cursor-default";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: delay,
      }}
      className={`${baseClasses} ${hoverClasses} ${className}`}
    >
      <div className="shimmer-layer absolute inset-0 pointer-events-none" />
      {children}
    </motion.div>
  );
}
