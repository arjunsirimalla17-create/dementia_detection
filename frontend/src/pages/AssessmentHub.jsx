import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/layout/Sidebar";
import Card from "../components/ui/Card";
import FadeUp from "../components/animations/FadeUp";
import Button from "../components/ui/Button";
import {
  Brain, Eye, Type, TrendingUp, Activity, Mic, Lock, CheckCircle2, Video
} from "lucide-react";

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(date).toLocaleDateString();
};

export default function AssessmentHub() {
  const { t } = useTranslation();
  const [refresh, setRefresh] = useState(0);

  // ✅ Read real user from localStorage
  const [user, setUser] = useState({ name: "User" });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const resetTests = () => {
    if (window.confirm("Reset all test data? This is for development only.")) {
      const keys = [
        "test_word-recall_done",
        "test_pattern-recognition_done",
        "test_number-sequence_done",
        "test_math-reasoning_done",
        "test_reaction-time_done",
        "test_video-test_done",
        "test_voice-analysis_done",
        "result_wordrecall",
        "result_patternrecognition",
        "result_numbersequence",
        "result_mathreasoning",
        "result_reactiontime",
        "result_videotest"
      ];
      keys.forEach(k => localStorage.removeItem(k));
      setRefresh(prev => prev + 1);
    }
  };

  const getStatus = (id) => {
    return localStorage.getItem(`test_${id}_done`) === "true" ? "completed" : "not-started";
  };

  const getResult = (id) => {
    const raw = localStorage.getItem(`result_${id.replace(/-/g, "")}`);
    return raw ? JSON.parse(raw) : null;
  };

  const modules = [
    {
      id: "word-recall",
      title: t("tests.wordRecall.title"),
      desc: t("hub.modules.wordRecall.desc"),
      time: "3 min",
      icon: <Type size={24} />,
      color: "text-accent-blue",
      bg: "bg-accent-blue/10",
      status: getStatus("word-recall"),
      result: getResult("word-recall"),
    },
    {
      id: "pattern-recognition",
      title: t("tests.patternRecognition.title"),
      desc: t("hub.modules.patternRecognition.desc"),
      time: "4 min",
      icon: <Eye size={24} />,
      color: "text-accent-teal",
      bg: "bg-accent-teal/10",
      status: getStatus("pattern-recognition"),
      result: getResult("pattern-recognition"),
    },
    {
      id: "number-sequence",
      title: t("tests.numberSequence.title"),
      desc: t("hub.modules.numberSequence.desc"),
      time: "3 min",
      icon: <TrendingUp size={24} />,
      color: "text-accent-purple",
      bg: "bg-accent-purple/10",
      status: getStatus("number-sequence"),
      result: getResult("number-sequence"),
    },
    {
      id: "math-reasoning",
      title: t("tests.mathReasoning.title"),
      desc: t("hub.modules.mathReasoning.desc"),
      time: "4 min",
      icon: <Brain size={24} />,
      color: "text-white",
      bg: "bg-white/10",
      status: getStatus("math-reasoning"),
      result: getResult("math-reasoning"),
    },
    {
      id: "reaction-time",
      title: t("tests.reactionTime.title"),
      desc: t("hub.modules.reactionTime.desc"),
      time: "1 min",
      icon: <Activity size={24} />,
      color: "text-risk-moderate",
      bg: "bg-risk-moderate/10",
      status: getStatus("reaction-time"),
      result: getResult("reaction-time"),
    },
    {
      id: "video-test",
      title: t("tests.videoComprehension.title"),
      desc: t("hub.modules.videoComprehension.desc"),
      time: "5 min",
      icon: <Eye size={24} />,
      color: "text-risk-high",
      bg: "bg-risk-high/10",
      status: getStatus("video-test"),
      result: getResult("video-test"),
      badge: "NEW",
    },
    {
      id: "voice-analysis",
      title: t("hub.modules.voiceAnalysis.title"),
      desc: t("hub.modules.voiceAnalysis.desc"),
      time: "2 min",
      icon: <Mic size={24} />,
      color: "text-accent-teal",
      bg: "bg-accent-teal/10",
      status: getStatus("voice-analysis"),
      result: getResult("voice-analysis"),
      locked: false,
    },
    {
      id: "video-analysis",
      title: t("hub.modules.videoAnalysis.title") || "Video Analysis",
      desc: t("hub.modules.videoAnalysis.desc") || "30-second AI facial tracking for motor and affective biomarkers.",
      time: "30 sec",
      icon: <Video size={24} />,
      color: "text-accent-blue",
      bg: "bg-accent-blue/10",
      status: localStorage.getItem("test_videoanalysis_done") === "true" ? "completed" : "not-started",
      result: JSON.parse(localStorage.getItem("result_videoanalysis") || "null"),
      path: "/video-analysis",
      resultKey: "result_videoanalysis",
      doneKey: "test_videoanalysis_done"
    },
  ];

  const completedCount = modules.filter(m => m.status === "completed" && m.id !== "voice-analysis").length;
  const voiceDone = localStorage.getItem('test_voice-analysis_done') === 'true';
  const totalCompleted = completedCount + (voiceDone ? 1 : 0);
  const totalCount = 7;
  const progressPercent = Math.round((totalCompleted / totalCount) * 100);
  const allCoreDone = completedCount === 6;

  return (
    <div className="min-h-screen bg-[#050714] flex text-textPrimary font-body">
      {/* ✅ Now passes real user from localStorage */}
      <Sidebar user={user} />

      <main className="flex-1 md:ml-64 p-6 lg:p-10 min-h-screen overflow-y-auto w-full relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-teal/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-purple/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-10 relative z-10">
          <FadeUp>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[10px] font-black tracking-[0.3em] text-accent-teal uppercase mb-3"
                >
                  {t("hub.eyebrow")}
                </motion.div>
                <h1 className="text-4xl lg:text-5xl font-display font-black text-white leading-tight">
                  {t("hub.title")}
                </h1>
                <p className="text-textSecondary max-w-xl mt-3 font-medium">
                  {t("hub.subtitle")}
                </p>
                <button
                  onClick={resetTests}
                  className="mt-6 text-[10px] font-bold tracking-widest text-risk-high hover:opacity-100 opacity-40 transition-all uppercase px-3 py-1 border border-risk-high/20 rounded-full"
                >
                  {t("hub.resetData")}
                </button>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div className="hidden md:flex flex-col items-end gap-2 mb-2">
                  <span className="text-xs font-bold text-textSecondary uppercase tracking-widest">
                    {t("hub.progress", { completed: completedCount, total: totalCount })}
                  </span>
                  <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      className="h-full bg-gradient-to-r from-accent-teal to-accent-blue shadow-glow-teal"
                    />
                  </div>
                </div>

                <Link to={allCoreDone ? "/results" : "#"}>
                  <Button
                    disabled={!allCoreDone}
                    variant={allCoreDone ? "primary" : "disabled"}
                    className="md:w-auto shrink-0 shadow-liquid"
                  >
                    {allCoreDone ? t("hub.viewReport") : t("hub.generateReport")} {!allCoreDone && <Lock size={14} className="ml-1 opacity-50" />}
                  </Button>
                </Link>
              </div>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {modules.map((mod, i) => (
              <FadeUp key={mod.id} delay={0.1 * i} className="h-full">
                <Card
                  className={`h-full flex flex-col relative group ${mod.locked ? "opacity-60 cursor-not-allowed" : ""}`}
                  hoverable={!mod.locked}
                >
                  <div className={`absolute top-0 left-0 w-full h-1 ${mod.status === "completed" ? "bg-risk-low"
                      : mod.status === "in-progress" ? "bg-risk-moderate"
                        : "bg-transparent"
                    }`} />

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${mod.bg} ${mod.color}`}>
                        {mod.locked ? <Lock size={24} /> : mod.icon}
                      </div>

                      {mod.badge && (
                        <span className="bg-accent-purple/20 text-accent-purple border border-accent-purple/30 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
                          {mod.badge}
                        </span>
                      )}

                      {mod.status === "completed" && (
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1.5 bg-risk-low/10 text-risk-low border border-risk-low/20 px-2.5 py-1 rounded-full text-xs font-bold">
                            <CheckCircle2 size={14} /> {mod.result?.score}%
                          </div>
                          {mod.result?.completedAt && (
                            <span className="text-[10px] text-textMuted font-medium">
                              {t("hub.completedAt", { time: timeAgo(mod.result.completedAt) })}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-accent-teal transition-colors">
                      {mod.title}
                    </h3>

                    <p className="text-sm text-textSecondary leading-relaxed flex-1 mb-6">
                      {mod.desc}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs font-medium text-textMuted bg-bg-elevated px-2.5 py-1 rounded border border-border">
                        ⏱ {mod.time}
                      </span>

                      {mod.locked ? (
                        <span className="text-xs font-medium text-textMuted uppercase tracking-wider">Locked</span>
                      ) : mod.status === "completed" ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-risk-low" />
                          <span className="text-xs font-semibold text-risk-low uppercase tracking-wider">
                            {t("hub.completed")}
                          </span>
                        </div>
                      ) : (
                        <Link to={mod.id === "voice-analysis" ? "/voice" : mod.id === "video-analysis" ? "/video-analysis" : `/test/${mod.id}`}>
                          <Button variant="ghost" className="py-2 px-6 text-sm">
                            {t("common.startTest") || "Start Test"}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              </FadeUp>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}