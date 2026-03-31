import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import FadeUp from '../components/animations/FadeUp';
import {
  Settings as SettingsIcon,
  Globe,
  Bell,
  Moon,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  User,
  Volume2,
  Zap,
  Eye,
  RefreshCw,
} from 'lucide-react';

const Toggle = ({ active, onToggle }) => (
  <button
    onClick={onToggle}
    className={`w-12 h-6 rounded-full transition-all duration-300 relative ${active ? 'bg-accent-teal shadow-[0_0_10px_rgba(0,212,170,0.4)]' : 'bg-white/10'}`}
  >
    <motion.div
      animate={{ left: active ? '28px' : '4px' }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="absolute top-1 w-4 h-4 bg-white rounded-full"
      style={{ position: 'absolute' }}
    />
  </button>
);

export default function Settings() {
  const { t, i18n } = useTranslation();

  // ✅ Load saved preferences from localStorage on mount
  const [lang, setLang] = useState(() => localStorage.getItem('preferredLanguage') || 'en');
  const [notifications, setNotifications] = useState(() => localStorage.getItem('pref_notifications') !== 'false');
  const [soundEffects, setSoundEffects] = useState(() => localStorage.getItem('pref_sound') !== 'false');
  const [reducedMotion, setReducedMotion] = useState(() => localStorage.getItem('pref_reducedMotion') === 'true');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('pref_highContrast') === 'true');
  const [saved, setSaved] = useState(false);

  // ✅ THIS is the fix — actually call i18n.changeLanguage when lang changes
  const handleLangChange = (newLang) => {
    setLang(newLang);
    i18n.changeLanguage(newLang);                        // ← changes ALL text instantly
    localStorage.setItem('preferredLanguage', newLang);  // ← persists across reloads
    showSaved();
  };

  const handleToggle = (key, setter, current) => {
    const newVal = !current;
    setter(newVal);
    localStorage.setItem(key, String(newVal));
    showSaved();
  };

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleResetData = () => {
    if (window.confirm("CRITICAL: This will permanently delete all your assessment history. Continue?")) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  const languages = [
    { code: 'en', label: 'English', native: 'English', flag: '🇺🇸' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  ];

  return (
    <div className="min-h-screen bg-[#050714] flex text-textPrimary font-body">
      <Sidebar user={{ name: "Justin" }} />

      <main className="flex-1 md:ml-64 p-6 lg:p-10 min-h-screen relative overflow-hidden">
        {/* Decorative Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-teal/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-purple/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-10 pb-24 relative z-10">

          {/* ── Header ── */}
          <FadeUp>
            <div className="flex items-center justify-between">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[10px] font-black tracking-[0.3em] text-accent-teal uppercase mb-4"
                >
                  {t('settings.controlCenter')}
                </motion.div>
                <h1 className="text-4xl lg:text-5xl font-display font-black text-white mb-3 flex items-center gap-4">
                  <SettingsIcon className="text-accent-teal" size={32} /> {t('settings.title')}
                </h1>
                <p className="text-textSecondary font-medium text-sm">
                  {t('settings.subtitle')}
                </p>
              </div>

              {/* ✅ Auto-save indicator */}
              <motion.div
                animate={{ opacity: saved ? 1 : 0, y: saved ? 0 : -10 }}
                className="flex items-center gap-2 bg-risk-low/10 text-risk-low border border-risk-low/20 px-3 py-2 rounded-xl text-xs font-bold"
              >
                <CheckCircle2 size={14} /> {t('settings.saved')}
              </motion.div>
            </div>
          </FadeUp>

          {/* ── Language Selection ── */}
          <FadeUp delay={0.1}>
            <Card className="p-6 overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                  <Globe size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white">
                    {t('settings.language')}
                  </h4>
                  <p className="text-xs text-textMuted">
                    {t('settings.languageDesc')}
                  </p>
                </div>
              </div>

              {/* ✅ Visual language cards instead of a plain dropdown */}
              <div className="grid grid-cols-3 gap-3">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleLangChange(l.code)}
                    className={`p-4 rounded-xl border transition-all duration-200 text-center group ${lang === l.code
                      ? 'border-accent-teal bg-accent-teal/10 shadow-[0_0_15px_rgba(0,212,170,0.15)]'
                      : 'border-border bg-bg-surface hover:border-white/20 hover:bg-bg-elevated'
                      }`}
                  >
                    <div className="text-2xl mb-2">{l.flag}</div>
                    <div className="text-sm font-bold text-white">{l.label}</div>
                    <div className="text-xs text-textMuted mt-0.5">{l.native}</div>
                    {lang === l.code && (
                      <div className="mt-2 flex justify-center">
                        <CheckCircle2 size={14} className="text-accent-teal" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </Card>
          </FadeUp>

          {/* ── Preferences ── */}
          <FadeUp delay={0.2}>
            <Card className="p-0 overflow-hidden divide-y divide-white/5">
              {/* Notifications */}
              <div className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center text-accent-purple shrink-0">
                  <Bell size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">
                    {t('settings.notifications')}
                  </h4>
                  <p className="text-xs text-textMuted">{t('settings.notificationsDesc')}</p>
                </div>
                <Toggle active={notifications} onToggle={() => handleToggle('pref_notifications', setNotifications, notifications)} />
              </div>

              {/* Sound Effects */}
              <div className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent-teal/10 flex items-center justify-center text-accent-teal shrink-0">
                  <Volume2 size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">{t('settings.soundEffects')}</h4>
                  <p className="text-xs text-textMuted">{t('settings.soundEffectsDesc')}</p>
                </div>
                <Toggle active={soundEffects} onToggle={() => handleToggle('pref_sound', setSoundEffects, soundEffects)} />
              </div>

              {/* Reduced Motion */}
              <div className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-risk-moderate/10 flex items-center justify-center text-risk-moderate shrink-0">
                  <Zap size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">{t('settings.reduceMotion')}</h4>
                  <p className="text-xs text-textMuted">{t('settings.reduceMotionDesc')}</p>
                </div>
                <Toggle active={reducedMotion} onToggle={() => handleToggle('pref_reducedMotion', setReducedMotion, reducedMotion)} />
              </div>

              {/* High Contrast */}
              <div className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                  <Eye size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">{t('settings.highContrast')}</h4>
                  <p className="text-xs text-textMuted">{t('settings.highContrastDesc')}</p>
                </div>
                <Toggle active={highContrast} onToggle={() => handleToggle('pref_highContrast', setHighContrast, highContrast)} />
              </div>

              {/* Dark Mode — always on */}
              <div className="p-5 flex items-center gap-4 opacity-60">
                <div className="w-10 h-10 rounded-xl bg-risk-low/10 flex items-center justify-center text-risk-low shrink-0">
                  <Moon size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">
                    {t('settings.darkMode')}
                  </h4>
                  <p className="text-xs text-textMuted">{t('settings.darkModeDesc')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-textMuted uppercase tracking-widest">{t('settings.alwaysOn')}</span>
                  <Toggle active={true} onToggle={() => { }} />
                </div>
              </div>

              {/* Privacy */}
              <div className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent-teal/10 flex items-center justify-center text-accent-teal shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">{t('settings.privacy')}</h4>
                  <p className="text-xs text-textMuted">{t('settings.privacyDesc')}</p>
                </div>
                <span className="text-[10px] font-bold bg-accent-teal/10 text-accent-teal px-2 py-1 rounded border border-accent-teal/20">
                  {t('settings.secure')}
                </span>
              </div>
            </Card>
          </FadeUp>

          {/* ── Reset Tests Only ── */}
          <FadeUp delay={0.3}>
            <Card className="p-6 border-accent-blue/20 bg-accent-blue/2">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue shrink-0">
                    <RefreshCw size={18} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">{t('settings.resetProgress')}</h4>
                    <p className="text-xs text-textSecondary max-w-sm">
                      {t('settings.resetProgressDesc')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm("Reset all test progress? Your settings will be kept.")) {
                      const keys = [
                        "test_word-recall_done", "test_pattern-recognition_done",
                        "test_number-sequence_done", "test_math-reasoning_done",
                        "test_reaction-time_done", "test_video-test_done",
                        "test_voice-analysis_done", "test_videoanalysis_done",
                        "result_wordrecall", "result_patternrecognition",
                        "result_numbersequence", "result_mathreasoning",
                        "result_reactiontime", "result_videotest",
                        "result_videoanalysis"
                      ];
                      keys.forEach(k => localStorage.removeItem(k));
                      showSaved();
                      window.location.href = '/hub';
                    }
                  }}
                  className="shrink-0 px-6 py-2.5 border border-accent-blue/30 text-accent-blue rounded-xl text-sm font-bold hover:bg-accent-blue/10 transition-all"
                >
                  {t('settings.resetTestsButton')}
                </button>
              </div>
            </Card>
          </FadeUp>

          {/* ── Danger Zone ── */}
          <FadeUp delay={0.4}>
            <div className="flex items-center gap-4 mb-6 pb-2 border-b border-risk-high/10">
              <div className="w-10 h-10 rounded-xl bg-risk-high/10 flex items-center justify-center text-risk-high">
                <Trash2 size={20} />
              </div>
              <h3 className="text-2xl font-display font-black text-white tracking-tight">
                {t('settings.dangerZone')}
              </h3>
            </div>

            <Card className="p-8 border-risk-high/20 hover:border-risk-high/40 transition-all duration-500">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h4 className="text-lg font-bold text-white mb-2 tracking-tight">{t('settings.purgeHistory')}</h4>
                  <p className="text-xs text-textSecondary font-medium leading-relaxed max-w-sm">
                    {t('settings.purgeHistoryDesc')}
                  </p>
                </div>
                <Button
                  onClick={handleResetData}
                  variant="danger"
                  className="shrink-0 px-8 py-3"
                >
                  {t('settings.factoryReset')}
                </Button>
              </div>
            </Card>
          </FadeUp>

        </div>
      </main>
    </div>
  );
}