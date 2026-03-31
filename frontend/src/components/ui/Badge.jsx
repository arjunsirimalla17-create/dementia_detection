import React from "react";

export default function Badge({
  text,
  icon = null,
  variant = "neutral",
  pulsing = false,
  className = "",
}) {
  const variants = {
    neutral: "bg-bg-elevated text-textPrimary border border-borderLayer",
    teal: "bg-accent-teal/10 text-accent-teal border border-accent-teal/30",
    purple:
      "bg-accent-purple/10 text-accent-purple border border-accent-purple/30",
    blue: "bg-accent-blue/10 text-accent-blue border border-accent-blue/30",
    lowRisk: "bg-risk-low/10 text-risk-low border border-risk-low/30",
    modRisk:
      "bg-risk-moderate/10 text-risk-moderate border border-risk-moderate/30",
    highRisk: "bg-risk-high/10 text-risk-high border border-risk-high/30",
  };

  const pulseClass = pulsing ? "animate-pulse" : "";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${variants[variant]} ${pulseClass} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {text}
    </span>
  );
}
