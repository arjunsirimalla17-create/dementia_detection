import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Button from "../components/ui/Button";
import FadeUp from "../components/animations/FadeUp";
import CountUp from "../components/animations/CountUp";
import Card from "../components/ui/Card";
import RiskMeter from "../components/ui/RiskMeter";
import {
  ChevronRight,
  Play,
  Shield,
  FlaskConical,
  Star,
  Activity,
  Brain,
  Mic,
  Eye,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";

export default function Landing() {
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  const yBrain = useTransform(scrollY, [0, 1000], [0, 200]);

  return (
    <div className="relative overflow-hidden bg-deep text-textPrimary">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <motion.div animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-accent-teal/10 rounded-full blur-[120px] pointer-events-none" />
        <motion.div animate={{ x: [0, -40, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-accent-purple/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-12 flex flex-col items-center text-center pt-10 lg:pt-0">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 relative group shimmer-trigger overflow-hidden">
              <div className="shimmer-layer" />
              <span className="w-2 h-2 rounded-full bg-accent-teal shadow-[0_0_10px_rgba(0,212,170,0.8)] animate-pulse" />
              <span className="text-xs font-bold text-white/80 tracking-[0.2em] uppercase">{t("hero.eyebrow")}</span>
            </motion.div>

            {/* ✅ MEDIUM SIZE — perfect balance */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold leading-[1.1] tracking-tight text-white mb-8 max-w-5xl">
              <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, type: "spring", stiffness: 300, damping: 30 }} className="block">{t("hero.h1_line1")}</motion.span>
              <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, type: "spring", stiffness: 300, damping: 30 }} className="block text-gradient">{t("hero.h1_line2")}</motion.span>
              <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 300, damping: 30 }} className="block">{t("hero.h1_line3")}</motion.span>
            </h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="text-lg md:text-xl text-textSecondary max-w-2xl mb-12 leading-relaxed font-medium">
              {t("hero.subtitle")}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, type: "spring" }} className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto">
              <Link to="/register">
                <Button className="w-full sm:w-auto text-lg px-10 py-5">
                  {t("hero.primaryCta")}
                  <ChevronRight size={20} className="ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" className="w-full sm:w-auto text-lg px-10 py-5">
                  {t("hero.secondaryCta")}
                </Button>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex flex-wrap items-center justify-center gap-8 text-[10px] font-bold tracking-[0.2em] text-textMuted uppercase">
              <div className="flex items-center gap-2"><Shield size={14} className="text-accent-teal" /> {t("hero.trust.hipaa")}</div>
              <div className="flex items-center gap-2"><FlaskConical size={14} className="text-accent-blue" /> {t("hero.trust.research")}</div>
              <div className="flex items-center gap-2"><Star size={14} className="text-accent-purple" /> {t("hero.trust.rating")}</div>
            </motion.div>
          </div>
        </div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-textMuted flex flex-col items-center gap-2">
          <span className="text-xs font-semibold tracking-widest uppercase">Scroll to explore</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-textMuted to-transparent" />
        </motion.div>
      </section>

      {/* STATS */}
      <section className="relative border-y border-border bg-bg-surface/50 py-12">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-teal to-transparent opacity-30" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border">
            <FadeUp delay={0.1} className="text-center px-4">
              <div className="text-3xl md:text-5xl font-display font-bold text-white mb-2 flex items-center justify-center">
                <span className="text-accent-teal mr-2 text-xl md:text-2xl">🧠</span>
                <CountUp endValue={50} suffix=",000+" />
              </div>
              <div className="text-sm text-textMuted font-medium tracking-wide uppercase">{t("stats.usersAssessed") || "Users Assessed"}</div>
            </FadeUp>
            <FadeUp delay={0.2} className="text-center px-4">
              <div className="text-3xl md:text-5xl font-display font-bold text-white mb-2 flex items-center justify-center">
                <span className="text-accent-blue mr-2 text-xl md:text-2xl">📊</span>
                <CountUp endValue={94.2} decimals={1} suffix="%" />
              </div>
              <div className="text-sm text-textMuted font-medium tracking-wide uppercase">{t("stats.detectionGenAccuracy") || "Detection Accuracy"}</div>
            </FadeUp>
            <FadeUp delay={0.3} className="text-center px-4">
              <div className="text-3xl md:text-5xl font-display font-bold text-white mb-2 flex items-center justify-center">
                <span className="text-accent-purple mr-2 text-xl md:text-2xl">🌍</span>
                <CountUp endValue={3} />
              </div>
              <div className="text-sm text-textMuted font-medium tracking-wide uppercase">{t("stats.languagesSupported") || "Languages Supported"}</div>
            </FadeUp>
            <FadeUp delay={0.4} className="text-center px-4">
              <div className="text-3xl md:text-5xl font-display font-bold text-white mb-2 flex items-center justify-center">
                <span className="text-yellow-400 mr-2 text-xl md:text-2xl">⚡</span>
                <CountUp endValue={15} />
              </div>
              <div className="text-sm text-textMuted font-medium tracking-wide uppercase">{t("stats.averageTestTime") || "Min Avg Test Time"}</div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* WHY NEUROLOOP */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">{t("landing.whyNeuroLoop.title") || "Why NeuroLoop?"}</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeUp delay={0.1}>
              <Card className="h-full p-8 border-t-4 border-t-accent-teal">
                <div className="w-12 h-12 rounded-xl bg-accent-teal/10 flex items-center justify-center text-accent-teal mb-6">
                  <Activity size={24} />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">{t("landing.whyNeuroLoop.clinicalAccuracy.title") || "Clinical Accuracy"}</h3>
                <p className="text-textSecondary leading-relaxed">{t("landing.whyNeuroLoop.clinicalAccuracy.desc") || "94.2% detection accuracy validated by clinical research across diverse populations."}</p>
              </Card>
            </FadeUp>
            <FadeUp delay={0.2}>
              <Card className="h-full p-8 border-t-4 border-t-accent-blue">
                <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue mb-6">
                  <Shield size={24} />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">{t("landing.whyNeuroLoop.privacyFirst.title") || "Privacy First"}</h3>
                <p className="text-textSecondary leading-relaxed">{t("landing.whyNeuroLoop.privacyFirst.desc") || "All data is stored locally on your device. Nothing is shared without your explicit consent."}</p>
              </Card>
            </FadeUp>
            <FadeUp delay={0.3}>
              <Card className="h-full p-8 border-t-4 border-t-accent-purple">
                <div className="w-12 h-12 rounded-xl bg-accent-purple/10 flex items-center justify-center text-accent-purple mb-6">
                  <Brain size={24} />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">{t("landing.whyNeuroLoop.multiLanguage.title") || "Multi-Language"}</h3>
                <p className="text-textSecondary leading-relaxed">{t("landing.whyNeuroLoop.multiLanguage.desc") || "Full support for English, Hindi and Telugu — including all test questions and instructions."}</p>
              </Card>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-bg-surface/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              {t("landing.howItWorks.titleParts.l1") || "Three Steps to"} <span className="text-gradient">{t("landing.howItWorks.titleParts.l2") || "Cognitive Clarity"}</span>
            </h2>
            <p className="text-lg text-textSecondary">{t("landing.howItWorks.subtitle")}</p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {[1, 2, 3].map((step) => (
              <FadeUp key={step} delay={0.2 * step} className="relative">
                <div className="text-8xl font-display font-black text-white/5 absolute -top-10 -left-4 z-0">{step}</div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-display font-bold text-white mb-4">{t(`landing.howItWorks.step${step}.title`)}</h3>
                  <p className="text-textSecondary leading-relaxed">{t(`landing.howItWorks.step${step}.desc`)}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IS THIS FOR */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeUp className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">{t("landing.whoIsThisFor.title") || "Who Is This For?"}</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { key: 'elderly', emoji: '👴', color: 'border-t-accent-teal' },
              { key: 'caregivers', emoji: '🤝', color: 'border-t-accent-blue' },
              { key: 'neurologists', emoji: '🧠', color: 'border-t-accent-purple' },
            ].map((item, idx) => (
              <FadeUp key={item.key} delay={0.1 * idx}>
                <Card className={`p-8 h-full border-t-4 ${item.color} text-center`}>
                  <div className="text-5xl mb-6">{item.emoji}</div>
                  <h3 className="text-2xl font-display font-bold text-white mb-4">
                    {t(`landing.whoIsThisFor.${item.key}.title`) || item.key}
                  </h3>
                  <p className="text-textSecondary leading-relaxed">
                    {t(`landing.whoIsThisFor.${item.key}.desc`) || ""}
                  </p>
                </Card>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* SCIENCE */}
      <section id="science" className="py-24 relative overflow-hidden bg-deep">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
                {t("landing.science.titleParts.l1") || "The"} <span className="text-gradient">{t("landing.science.titleParts.l2") || "Science"}</span> {t("landing.science.titleParts.l3") || "of NeuroLoop"}
              </h2>
              <div className="space-y-8">
                {['biometrics', 'vocal', 'validation'].map((item, idx) => (
                  <div key={item}>
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${idx === 0 ? 'bg-accent-teal/10 text-accent-teal' : idx === 1 ? 'bg-accent-blue/10 text-accent-blue' : 'bg-accent-purple/10 text-accent-purple'}`}>
                        {idx === 0 ? <Activity size={18} /> : idx === 1 ? <Mic size={18} /> : <FlaskConical size={18} />}
                      </div>
                      {t(`landing.science.${item}.title`)}
                    </h3>
                    <p className="text-textSecondary leading-relaxed">{t(`landing.science.${item}.desc`)}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
            <FadeUp delay={0.2} className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-bg-elevated to-deep border border-border p-1 flex items-center justify-center">
                <div className="w-full h-full rounded-[20px] bg-deep/80 backdrop-blur-3xl p-8 flex flex-col justify-center">
                  <div className="space-y-6">
                    {[
                      { label: 'Sensitivity', value: '96.4%', color: 'bg-accent-teal' },
                      { label: 'Specificity', value: '92.1%', color: 'bg-accent-blue' },
                      { label: 'F1-Score', value: '0.94', color: 'bg-accent-purple' }
                    ].map((stat, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-sm font-bold text-textSecondary uppercase tracking-widest">{stat.label}</span>
                          <span className="text-2xl font-display font-black text-white">{stat.value}</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: stat.value }} transition={{ duration: 1, delay: 0.5 }} className={`h-full ${stat.color}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <FadeUp className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-white mb-4">{t("landing.testimonials.title")}</h2>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { n: "David M.", a: 68, l: t("landing.testimonials.david.location"), r: 5, text: t("landing.testimonials.david.text") },
            { n: "Sarah K.", a: 55, l: t("landing.testimonials.sarah.location"), r: 5, text: t("landing.testimonials.sarah.text") },
            { n: "Dr. James L.", a: 45, l: t("landing.testimonials.james.location"), r: 5, text: t("landing.testimonials.james.text") },
          ].map((item, idx) => (
            <FadeUp key={idx} delay={0.2 * idx}>
              <Card className="p-8 h-full">
                <div className="flex text-yellow-500 mb-4">{[...Array(item.r)].map((_, i) => <Star key={i} size={16} className="fill-current" />)}</div>
                <p className="text-textPrimary italic mb-6 leading-relaxed">"{item.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-teal/20 text-accent-teal font-bold flex items-center justify-center">{item.n.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-white text-sm">{item.n}</p>
                    <p className="text-xs text-textMuted">{item.a > 0 ? `Age ${item.a} • ` : ""}{item.l}</p>
                  </div>
                </div>
              </Card>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border relative overflow-hidden bg-deep">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-surface via-deep to-accent-teal/5" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <FadeUp>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">{t("landing.cta.title")}</h2>
            <p className="text-xl text-textSecondary mb-10">{t("landing.cta.subtitle")}</p>
            <div className="flex flex-col items-center gap-6">
              <Link to="/register">
                <Button className="text-xl px-12 py-5 shadow-glow-teal hover:shadow-[0_0_60px_rgba(0,212,170,0.3)]">
                  {t("landing.cta.button") || "Start Your Assessment — Register Now"}
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-textSecondary">
                <span>{t("landing.cta.alreadyHaveAccount") || "Already have an account?"}</span>
                <Link to="/login" className="text-accent-teal font-bold hover:underline">
                  {t("landing.cta.signInLink") || "Sign in →"}
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}