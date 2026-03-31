import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import FadeUp from '../components/animations/FadeUp';
import { Mail, Award, Clock, ChevronRight } from 'lucide-react';

export default function Profile() {
  const { t } = useTranslation();

  const user = JSON.parse(localStorage.getItem('user')) || {
    name: "Justin Ebenezer",
    email: "justin@neuroloop.ai",
    joined: "March 2024"
  };

  // ✅ All titles use t() so they change with language
  const allModules = [
    { id: 'word-recall', titleKey: 'tests.wordRecall.title', color: 'text-accent-blue' },
    { id: 'pattern-recognition', titleKey: 'tests.patternRecognition.title', color: 'text-accent-teal' },
    { id: 'number-sequence', titleKey: 'tests.numberSequence.title', color: 'text-accent-purple' },
    { id: 'math-reasoning', titleKey: 'tests.mathReasoning.title', color: 'text-white' },
    { id: 'reaction-time', titleKey: 'tests.reactionTime.title', color: 'text-risk-moderate' },
    { id: 'video-test', titleKey: 'tests.videoComprehension.title', color: 'text-risk-high' },
  ];

  // ✅ Dates use t() so they change with language
  const getDateLabel = (completedAt) => {
    if (!completedAt) return t("profile.recently") || "Recently";
    const diff = Math.floor((Date.now() - completedAt) / 1000);
    if (diff < 60) return t("profile.justNow") || "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} ${t("profile.minsAgo") || "mins ago"}`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ${t("profile.hoursAgo") || "hours ago"}`;
    return `${Math.floor(diff / 86400)} ${t("profile.daysAgo") || "days ago"}`;
  };

  const history = allModules
    .filter(m => localStorage.getItem(`test_${m.id}_done`) === 'true')
    .map(m => {
      const raw = localStorage.getItem(`result_${m.id.replace(/-/g, '')}`);
      const result = raw ? JSON.parse(raw) : null;
      return {
        id: m.id,
        title: t(m.titleKey),           // ✅ translated title
        date: getDateLabel(result?.completedAt), // ✅ translated date
        score: result ? `${result.score}%` : '-',
        color: m.color,
      };
    });

  return (
    <div className="min-h-screen bg-[#050714] flex text-textPrimary font-body">
      <Sidebar user={user} />

      <main className="flex-1 md:ml-64 p-6 lg:p-10 min-h-screen relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-teal/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-accent-purple/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-12 pb-24 relative z-10">

          {/* ── Header ── */}
          <FadeUp>
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-12 text-center md:text-left">
              <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-accent-teal/20 to-accent-blue/20 p-[2px] shadow-liquid relative group">
                <div className="absolute inset-0 bg-accent-teal/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="w-full h-full rounded-[2.4rem] bg-[#0A0D1E] flex items-center justify-center text-4xl font-black text-white relative z-10">
                  {user.name.charAt(0)}
                </div>
              </div>
              <div className="pb-2">
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] font-black tracking-[0.3em] text-accent-teal uppercase mb-3"
                >
                  {t("profile.authorizedClinician") || "Authorized Clinician"}
                </motion.div>
                <h1 className="text-4xl lg:text-5xl font-display font-black text-white mb-2 leading-tight">
                  {user.name}
                </h1>
                <p className="text-textSecondary font-medium flex items-center justify-center md:justify-start gap-2 text-sm">
                  <Mail size={16} className="text-accent-blue/50" /> {user.email}
                </p>
              </div>
            </div>
          </FadeUp>

          {/* ── Stats Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FadeUp delay={0.1}>
              <Card className="p-6 text-center">
                <div className="text-textMuted uppercase text-[10px] font-bold tracking-widest mb-2">
                  {t("profile.memberSince") || "Member Since"}
                </div>
                <div className="text-xl font-display font-bold text-white">{user.joined}</div>
              </Card>
            </FadeUp>
            <FadeUp delay={0.2}>
              <Card className="p-6 text-center">
                <div className="text-textMuted uppercase text-[10px] font-bold tracking-widest mb-2">
                  {t("profile.testsCompleted") || "Tests Completed"}
                </div>
                <div className="text-xl font-display font-bold text-accent-teal">{history.length} / 6</div>
              </Card>
            </FadeUp>
            <FadeUp delay={0.3}>
              <Card className="p-6 text-center">
                <div className="text-textMuted uppercase text-[10px] font-bold tracking-widest mb-2">
                  {t("profile.currentStreak") || "Current Streak"}
                </div>
                <div className="text-xl font-display font-bold text-accent-purple">
                  4 {t("profile.days") || "Days"}
                </div>
              </Card>
            </FadeUp>
          </div>

          {/* ── Activity History ── */}
          <FadeUp delay={0.4}>
            <h2 className="text-2xl font-display font-black text-white mb-8 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-blue">
                <Clock size={20} />
              </div>
              {t("profile.biometricActivity") || "Assessment Activity"}
            </h2>
            <div className="space-y-4">
              {history.length > 0 ? history.map((item, i) => (
                <Card key={i} className="p-4 flex items-center justify-between hover:translate-x-1 transition-transform cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${item.color}`}>
                      <Award size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-textMuted">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{t("common.score") || "Score"}</p>
                      <p className={`text-xs font-mono ${item.color}`}>{item.score}</p>
                    </div>
                    <ChevronRight size={18} className="text-textMuted" />
                  </div>
                </Card>
              )) : (
                <div className="text-center py-12 bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <p className="text-textMuted italic">
                    {t("profile.noTests") || "No assessments completed yet. Start your first test!"}
                  </p>
                </div>
              )}
            </div>
          </FadeUp>

        </div>
      </main>
    </div>
  );
}