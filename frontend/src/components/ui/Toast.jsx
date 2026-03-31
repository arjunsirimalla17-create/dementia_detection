import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export default function Toast({
  message,
  type = "info",
  isVisible,
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const icons = {
    success: <CheckCircle className="text-risk-low" size={24} />,
    error: <AlertCircle className="text-risk-high" size={24} />,
    info: <Info className="text-accent-blue" size={24} />,
  };

  const borders = {
    success: "border-risk-low/30",
    error: "border-risk-high/30",
    info: "border-accent-blue/30",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 bg-bg-elevated border ${borders[type]} rounded-xl shadow-glow-teal max-w-sm`}
        >
          {icons[type]}
          <p className="text-sm font-medium text-textPrimary flex-grow">
            {message}
          </p>
          <button
            onClick={onClose}
            className="text-textMuted hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
