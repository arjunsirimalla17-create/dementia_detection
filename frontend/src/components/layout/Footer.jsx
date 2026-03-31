import React from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Heart,
  Shield,
  Activity,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-transparent border-t border-white/5 mt-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent-teal/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand Col */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <Brain className="text-accent-teal" size={28} />
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                NeuroLoop
              </span>
            </Link>
            <p className="text-sm text-textSecondary leading-relaxed pr-4">
              {t("footer.desc")}
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-accent-teal hover:border-accent-teal/50 transition-all cursor-pointer hover:scale-110">
                <Shield size={20} />
              </div>
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-risk-high hover:border-risk-high/50 transition-all cursor-pointer hover:scale-110">
                <Heart size={20} />
              </div>
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-accent-blue hover:border-accent-blue/50 transition-all cursor-pointer hover:scale-110">
                <Activity size={20} />
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-display font-semibold mb-6">
              {t("footer.platform.title")}
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/hub" className="text-sm text-textSecondary hover:text-accent-teal transition-colors">
                  {t("footer.platform.assessments")}
                </Link>
              </li>
              <li>
                <Link to="/#science" className="text-sm text-textSecondary hover:text-accent-teal transition-colors">
                  {t("footer.platform.clinicalResearch")}
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="text-sm text-textSecondary hover:text-accent-teal transition-colors">
                  {t("footer.platform.howItWorks")}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-textSecondary hover:text-accent-teal transition-colors">
                  {t("footer.platform.dashboard")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-display font-semibold mb-6">
              {t("footer.company.title")}
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-sm text-textSecondary hover:text-accent-teal transition-colors">
                  {t("footer.company.about")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-textSecondary hover:text-accent-teal transition-colors">
                  {t("footer.company.contact")}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-textSecondary hover:text-accent-teal transition-colors flex items-center gap-2">
                  {t("footer.company.privacy")}{" "}
                  <span className="text-[10px] uppercase bg-bg-surface px-2 py-0.5 rounded text-textMuted border border-border">
                    HIPAA
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-textSecondary hover:text-accent-teal transition-colors">
                  {t("footer.company.terms")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-display font-semibold mb-6">
              {t("footer.contact.title")}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-textSecondary">
                <Mail size={16} className="text-accent-teal" />
                hello@neuroloop.ai
              </li>
              <li className="flex items-center gap-3 text-sm text-textSecondary">
                <Phone size={16} className="text-accent-teal" />
                1-800-NEURO-AI
              </li>
              <li className="flex items-start gap-3 text-sm text-textSecondary">
                <MapPin size={16} className="text-accent-teal mt-1 flex-shrink-0" />
                124 Medical Innovation Blvd, Suite 400
                <br />
                San Francisco, CA 94107
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-textMuted">
            &copy; {new Date().getFullYear()} Neuro Loop Insight. {t("footer.bottom.rights")}
          </p>
          <div className="flex items-center gap-2 text-sm text-textMuted">
            <span>{t("footer.bottom.built")}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-risk-low"></span>
            <span>{t("footer.bottom.systems")}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}