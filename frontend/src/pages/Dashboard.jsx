import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Brain, Flame, Calendar, CheckCircle2, AlertCircle,
  Award, Eye, TrendingUp, ChevronRight, Activity, Type,
} from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import Card from "../components/ui/Card";
import RiskMeter from "../components/ui/RiskMeter";
import FadeUp from "../components/animations/FadeUp";
import CountUp from "../components/animations/CountUp";
import { Link } from "react-router-dom";

function loadTestData() {
  const testMap = [
    { id: "word-recall", localKey: "wordrecall", title: "Word Recall", icon: "Type" },
    { id: "pattern-recognition", localKey: "patternrecognition", title: "Pattern Test", icon: "Eye" },
    { id: "number-sequence", localKey: "numbersequence", title: "Number Seq", icon: "TrendingUp" },
    { id: "math-reasoning", localKey: "mathreasoning", title: "Math Reason", icon: "Brain" },
    { id: "reaction-time", localKey: "reactiontime", title: "Reaction Time", icon: "Activity" },
    { id: "video-test", localKey: "videotest", title: "Video Test", icon: "Eye" },
  ];
  return testMap.map((t) => {
    const done = localStorage.getItem(`test_${t.id}_done`) === "true";
    const raw = localStorage.getItem(`result_${t.localKey}`);
    const result = raw ? JSON.parse(raw) : null;
    return { ...t, status: done ? "completed" : "not-started", score: result ? `${result.score}%` : "-", result };
  });
}

function calcRiskScore(modules) {
  const completed = modules.filter((m) => m.result);
  if (completed.length === 0) return null;
  const avg = Math.round(completed.reduce((sum, m) => sum + (100 - m.result.score), 0) / completed.length);
  return Math.min(100, Math.max(0, avg));
}

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const [modules, setModules] = useState([]);
  const [riskScore, setRiskScore] = useState(null);

  // ✅ Read real user from localStorage — no more hardcoded Justin!
  const [user, setUser] = useState({ name: "User", streak: 5 });

  useEffect(() => {
    const data = loadTestData();
    setModules(data);
    setRiskScore(calcRiskScore(data));

    // ✅ Load the logged-in user's real name and email
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser({
        name: parsed.name || "User",
        email: parsed.email || "",
        joined: parsed.joined || "",
        streak: 5,
      });
    }
  }, []);

  const completedCount = modules.filter((m) => m.status === "completed").length;
  const allDone = completedCount === 6;

  const iconMap = {
    Type: <Type size={18} />,
    Eye: <Eye size={18} />,
    TrendingUp: <TrendingUp size={18} />,
    Brain: <Brain size={18} />,
    Activity: <Activity size={18} />,
  };

  const getInsights = () => {
    const insights = [];
    const mod = (key) => modules.find((m) => m.localKey === key);
    const video = mod("videotest");
    const reaction = mod("reactiontime");
    const word = mod("wordrecall");

    if (video?.result) {
      const level = video.result.score < 50 ? "high" : video.result.score < 75 ? "moderate" : "low";
      insights.push({ level, title: t("results.dimension1.title"), desc: `${t("common.score")}: ${video.result.score}%. ${video.result.score < 60 ? t("results.dimension1.desc") : t("results.lowRisk")}`, bar: video.result.score });
    }
    if (reaction?.result) {
      const avg = reaction.result.details?.average || 500;
      const level = avg > 600 ? "high" : avg > 400 ? "moderate" : "low";
      insights.push({ level, title: `${t("tests.reactionTime.title")} (${avg}ms avg)`, desc: avg > 600 ? t("results.dimension2.desc") : t("results.lowRisk"), bar: Math.min(100, Math.round((1000 - avg) / 10)) });
    }
    if (word?.result) {
      insights.push({ level: word.result.score >= 80 ? "low" : "moderate", title: t("tests.wordRecall.title"), desc: `${t("common.score")}: ${word.result.score}%. ${word.result.score >= 80 ? t("results.lowRisk") : t("results.dimension1.desc")}`, bar: word.result.score });
    }
    if (insights.length === 0) {
      insights.push({ level: "moderate", title: t("dashboard.notStarted"), desc: t("dashboard.status.notStarted"), bar: 0 });
    }
    return insights;
  };

  const insights = getInsights();

  const badges = [
    { name: "Memory Master", icon: "🧠", earned: modules.find(m => m.localKey === "wordrecall")?.status === "completed" },
    { name: "Quick Thinker", icon: "⚡", earned: modules.find(m => m.localKey === "reactiontime")?.status === "completed" },
    { name: "On Fire", icon: "🔥", earned: completedCount >= 3 },
    { name: "All-Rounder", icon: "🌟", earned: allDone },
    { name: "Voice Champ", icon: "🎙️", earned: false },
    { name: "Film Scholar", icon: "🎬", earned: modules.find(m => m.localKey === "videotest")?.status === "completed" },
  ];

  return (
    <div className="min-h-screen bg-[#050714] flex text-textPrimary overflow-hidden font-body">
      <Sidebar user={user} />

      <main className="flex-1 md:ml-64 p-6 lg:p-10 min-h-screen overflow-y-auto w-full relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-teal/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-purple/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-12 relative z-10 pb-20">

          {/* ROW 1 */}
          <section className="flex flex-col md:flex-row gap-8 mb-12">
            <FadeUp delay={0.1} className="md:w-1/3">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] font-black tracking-[0.3em] text-accent-teal uppercase mb-4">
                {t("dashboard.patientOverview")}
              </motion.div>
              {/* ✅ Shows real user name */}
              <h1 className="text-4xl font-display font-black text-white mb-3">
                {t("dashboard.welcome", { name: user.name })}
              </h1>
              <p className="text-textSecondary font-medium">
                {new Date().toLocaleDateString(
                  i18n.language === 'en' ? 'en-US' : i18n.language === 'hi' ? 'hi-IN' : 'te-IN',
                  { weekday: "long", month: "long", day: "numeric" }
                )}
              </p>
              <div className="mt-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 mb-3">
                  <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse" />
                  <span className="text-xs font-bold text-white tracking-widest uppercase">{t("dashboard.dayStreak", { count: user.streak })}</span>
                </div>
                <p className="text-xs text-textMuted font-medium leading-relaxed">
                  {completedCount === 0
                    ? t("dashboard.status.notStarted")
                    : completedCount < 6
                      ? t("dashboard.status.inProgress", { completed: completedCount })
                      : t("dashboard.status.allDone")}
                </p>
              </div>
            </FadeUp>

            <div className="md:w-2/3 grid grid-cols-2 lg:grid-cols-4 gap-5">
              <FadeUp delay={0.2} className="h-full">
                <Card className="p-5 h-full flex flex-col justify-between relative overflow-hidden">
                  <div className="text-textMuted text-[10px] font-black tracking-widest uppercase mb-6 flex items-center justify-between">
                    {t("dashboard.riskScore")} <AlertCircle size={14} className="text-risk-high opacity-50" />
                  </div>
                  <div>
                    <div className="text-4xl font-display font-black text-white">
                      {riskScore !== null ? <CountUp endValue={riskScore} /> : <span className="text-2xl text-textMuted">N/A</span>}
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                      <div className="h-full bg-risk-high opacity-60" style={{ width: `${riskScore || 0}%` }} />
                    </div>
                    <p className="text-[10px] text-textMuted mt-2 uppercase tracking-widest">
                      {riskScore === null ? t("dashboard.completeToGenerate") : riskScore < 30 ? t("results.lowRisk") : riskScore < 55 ? t("results.moderateRisk") : t("results.highRisk")}
                    </p>
                  </div>
                </Card>
              </FadeUp>

              <FadeUp delay={0.3} className="h-full">
                <Card className="p-5 h-full flex flex-col justify-between relative overflow-hidden">
                  <div className="text-textMuted text-[10px] font-black tracking-widest uppercase mb-6 flex items-center justify-between">
                    {t("dashboard.progress")} <CheckCircle2 size={14} className="text-accent-teal opacity-50" />
                  </div>
                  <div>
                    <div className="text-4xl font-display font-black text-white">
                      {completedCount}<span className="text-xl text-white/20">/6</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(completedCount / 6) * 100}%` }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-accent-teal" />
                    </div>
                    <div className="text-[10px] text-accent-teal font-black mt-2 tracking-widest uppercase">{t("dashboard.phaseOne")}</div>
                  </div>
                </Card>
              </FadeUp>

              <FadeUp delay={0.4} className="h-full">
                <Card className="p-5 h-full flex flex-col justify-between relative overflow-hidden">
                  <div className="text-textMuted text-[10px] font-black tracking-widest uppercase mb-6 flex items-center justify-between">
                    {t("dashboard.streak")} <Flame size={14} className="text-accent-purple opacity-50" />
                  </div>
                  <div>
                    <div className="text-4xl font-display font-black text-white">{user.streak}</div>
                    <div className="text-[10px] text-accent-purple font-black mt-2 tracking-widest uppercase">{t("dashboard.activeDays")}</div>
                  </div>
                </Card>
              </FadeUp>

              <FadeUp delay={0.5} className="h-full">
                <Card className="p-5 h-full flex flex-col justify-between bg-white/5 border-white/10">
                  <div className="text-textMuted text-[10px] font-black tracking-widest uppercase mb-6 flex items-center justify-between">
                    {t("dashboard.statusTitle")} <Calendar size={14} className="text-accent-blue opacity-50" />
                  </div>
                  <div>
                    <div className="text-2xl font-display font-black text-white leading-tight">
                      {allDone ? t("dashboard.allDone") : completedCount === 0 ? t("dashboard.notStarted") : t("dashboard.inProgress")}
                    </div>
                    {allDone && (
                      <Link to="/results" className="text-[10px] text-accent-teal font-black mt-2 tracking-widest uppercase block hover:underline">
                        {t("dashboard.viewReport")}
                      </Link>
                    )}
                  </div>
                </Card>
              </FadeUp>
            </div>
          </section>

          {/* ROW 2 */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <FadeUp delay={0.6} className="lg:col-span-5 h-full">
              <Card elevated className="h-full border-t-4 border-t-risk-high relative overflow-hidden flex flex-col items-center justify-center p-8">
                <h2 className="text-lg font-display font-semibold text-white mb-6 absolute top-6 left-6">{t("dashboard.neuroAnalysis")}</h2>
                {riskScore !== null ? (
                  <div className="mt-8 scale-110"><RiskMeter score={riskScore} /></div>
                ) : (
                  <div className="mt-8 text-center">
                    <div className="w-32 h-32 rounded-full border-4 border-dashed border-border flex items-center justify-center mx-auto mb-4">
                      <Brain size={40} className="text-textMuted" />
                    </div>
                    <p className="text-textMuted text-sm">{t("dashboard.completeToGenerate")}</p>
                    <Link to="/hub">
                      <button className="mt-4 text-xs font-bold text-accent-teal uppercase tracking-widest hover:underline">
                        {t("dashboard.startNow")}
                      </button>
                    </Link>
                  </div>
                )}
              </Card>
            </FadeUp>

            <FadeUp delay={0.7} className="lg:col-span-7 h-full">
              <Card className="h-full p-8 md:p-10 flex flex-col">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center text-accent-purple">
                    <Brain size={22} />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-white tracking-tight">{t("dashboard.insightsTitle")}</h2>
                </div>
                <div className="flex-1 space-y-5">
                  {insights.map((insight, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${insight.level === "high" ? "bg-risk-high/10 text-risk-high" : insight.level === "moderate" ? "bg-risk-moderate/10 text-risk-moderate" : "bg-risk-low/10 text-risk-low"}`}>
                        {insight.level === "low" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white mb-1">{insight.title}</p>
                        <p className="text-sm text-textSecondary leading-relaxed">{insight.desc}</p>
                        <div className="h-1.5 w-full bg-bg-elevated rounded-full mt-3 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${insight.bar}%` }} transition={{ duration: 1, delay: 0.3 * i }} className={`h-full ${insight.level === "high" ? "bg-risk-high" : insight.level === "moderate" ? "bg-risk-moderate" : "bg-risk-low"}`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </FadeUp>
          </section>

          {/* ROW 3 */}
          <section>
            <FadeUp delay={0.8} className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-display font-bold text-white tracking-tight">{t("dashboard.assessmentModules")}</h2>
                <p className="text-textMuted text-xs mt-2 font-medium tracking-wide">{t("dashboard.phase1Battery")}</p>
              </div>
              <Link to="/hub" className="text-[10px] font-black tracking-widest text-accent-teal hover:text-white transition-all uppercase px-4 py-2 border border-accent-teal/20 rounded-full bg-accent-teal/5 flex items-center">
                {t("dashboard.goToHub")} <ChevronRight size={14} className="ml-2" />
              </Link>
            </FadeUp>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {modules.map((mod, i) => (
                <FadeUp key={i} delay={0.1 * (i + 8)}>
                  <Card hoverable={false} className={`p-4 h-full border ${mod.status === "completed" ? "border-risk-low/30 bg-risk-low/5" : "border-border"}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${mod.status === "completed" ? "bg-risk-low text-deep" : "bg-bg-elevated text-textMuted"}`}>
                      {mod.status === "completed" ? <CheckCircle2 size={16} /> : iconMap[mod.icon]}
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1 truncate">{mod.title}</h3>
                    <div className="flex justify-between items-center text-xs">
                      <span className={`${mod.status === "completed" ? "text-risk-low" : "text-textMuted"} uppercase font-bold tracking-wider`}>
                        {mod.status.replace("-", " ")}
                      </span>
                      {mod.status === "completed" && (
                        <span className="text-white font-mono bg-bg-surface px-1.5 rounded border border-border">{mod.score}</span>
                      )}
                    </div>
                  </Card>
                </FadeUp>
              ))}
            </div>

            {completedCount === 0 && (
              <FadeUp delay={1.2} className="mt-6 text-center">
                <Link to="/hub">
                  <button className="px-8 py-3 bg-accent-teal text-deep font-bold rounded-xl hover:bg-accent-teal/90 transition-all shadow-glow-teal">
                    {t("dashboard.startFirst")}
                  </button>
                </Link>
              </FadeUp>
            )}
          </section>

          {/* ROW 4 */}
          <section>
            <FadeUp delay={1.4}>
              <h2 className="text-xl font-display font-semibold text-white mb-6 flex items-center gap-2">
                <Award size={20} className="text-accent-blue" /> {t("dashboard.achievements")}
              </h2>
            </FadeUp>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {badges.map((badge, i) => (
                <FadeUp key={i} delay={0.05 * (i + 14)}>
                  <div className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${badge.earned ? "bg-gradient-to-b from-bg-elevated to-bg-surface border-accent-blue/30 shadow-[0_0_15px_rgba(59,139,255,0.1)]" : "bg-bg-surface border-border opacity-40 grayscale"}`}>
                    <div className="text-3xl mb-3 drop-shadow-md">{badge.icon}</div>
                    <span className="text-xs font-semibold text-center text-textPrimary leading-tight">{badge.name}</span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}