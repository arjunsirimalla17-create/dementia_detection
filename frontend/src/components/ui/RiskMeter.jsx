import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function RiskMeter({ score, animate = true }) {
  const [currentScore, setCurrentScore] = useState(0);

  // Calculate exact rotation for the needle (-90 to +90 degrees)
  const rotation = -90 + (score / 100) * 180;

  useEffect(() => {
    if (!animate) {
      setCurrentScore(score);
      return;
    }

    const timer = setTimeout(() => {
      let startTimestamp = null;
      const duration = 2000;

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        // easeOutExpo
        const easeProgress =
          progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setCurrentScore(Math.round(easeProgress * score));

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCurrentScore(score);
        }
      };
      window.requestAnimationFrame(step);
    }, 500);

    return () => clearTimeout(timer);
  }, [score, animate]);

  let statusText = "LOW RISK";
  let statusColor = "text-risk-low";
  if (score > 30 && score <= 55) {
    statusText = "MODERATE RISK";
    statusColor = "text-risk-moderate";
  } else if (score > 55) {
    statusText = "HIGH RISK";
    statusColor = "text-risk-high";
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 relative">
      {/* SVG Arc Meter */}
      <div className="relative w-64 h-32 overflow-hidden">
        <svg viewBox="0 0 200 100" className="w-full h-full drop-shadow-lg">
          {/* Background Track */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="var(--bg-elevated)"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Low Risk Segment (0-30 = 0-54 deg) */}
          <path
            d="M 10 100 A 90 90 0 0 1 56.4 22"
            fill="none"
            stroke="var(--risk-low)"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Moderate Risk Segment (30-55 = 54-99 deg) */}
          <path
            d="M 56.4 22 A 90 90 0 0 1 140.3 19"
            fill="none"
            stroke="var(--risk-moderate)"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* High Risk Segment (55-100 = 99-180 deg) */}
          <path
            d="M 140.3 19 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="var(--risk-high)"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>

        {/* Needle Indicator */}
        <motion.div
          className="absolute bottom-[-10px] left-1/2 w-2 h-[85px] origin-bottom rounded-full z-10"
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 2, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            background:
              "linear-gradient(to top, var(--bg-elevated) 20%, white 100%)",
            marginLeft: "-4px", // Center correction
          }}
        >
          {/* Needle Center Pin */}
          <div className="absolute -bottom-1 -left-[6px] w-5 h-5 rounded-full bg-white border-4 border-bg-deep" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-6 text-center"
      >
        <span className="text-5xl font-display font-bold text-white tracking-tight">
          {currentScore}
        </span>
        <div
          className={`mt-2 font-bold tracking-wider text-sm bg-bg-surface px-4 py-1.5 rounded-full border border-border ${statusColor}`}
        >
          {statusText}
        </div>
      </motion.div>
    </div>
  );
}
