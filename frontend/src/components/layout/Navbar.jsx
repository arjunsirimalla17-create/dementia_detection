import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Menu, X, Brain } from "lucide-react";
import Button from "../ui/Button";
import LanguageSelector from "../ui/LanguageSelector";

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    setIsLoggedIn(!!localStorage.getItem("authToken"));
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname === "/") {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 600);
    }
  };

  const glassClasses = isScrolled
    ? "bg-[rgba(5,11,24,0.8)] backdrop-blur-[20px] border-b border-border shadow-lg py-3"
    : "bg-transparent py-5";

  const linkClass = "text-sm font-medium transition-colors hover:text-accent-teal relative group text-textSecondary cursor-pointer";
  const activeLinkClass = "text-sm font-medium transition-colors hover:text-accent-teal relative group text-accent-teal cursor-pointer";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${glassClasses}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent-teal to-accent-blue p-[1px]">
              <div className="absolute inset-0 rounded-xl bg-deep bg-opacity-80 backdrop-blur-sm group-hover:bg-opacity-60 transition-all" />
              <Brain className="relative text-accent-teal group-hover:text-white transition-colors" size={24} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent-teal group-hover:to-accent-blue transition-all">
              NeuroLoop
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {/* Home */}
              <Link
                to="/"
                className={location.pathname === "/" ? activeLinkClass : linkClass}
              >
                {t("nav.home")}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-teal transition-all group-hover:w-full" />
              </Link>

              {/* How It Works */}
              <a
                href="#how-it-works"
                onClick={(e) => handleNavClick(e, "how-it-works")}
                className={linkClass}
              >
                {t("nav.howItWorks")}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-teal transition-all group-hover:w-full" />
              </a>

              {/* Science */}
              <a
                href="#science"
                onClick={(e) => handleNavClick(e, "science")}
                className={linkClass}
              >
                {t("nav.science")}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-teal transition-all group-hover:w-full" />
              </a>

              {/* About */}
              <a
                href="#about"
                onClick={(e) => handleNavClick(e, "about")}
                className={linkClass}
              >
                {t("nav.about")}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-teal transition-all group-hover:w-full" />
              </a>
            </div>

            <div className="flex items-center gap-4 pl-6 border-l border-border">
              <LanguageSelector />
              {isLoggedIn ? (
                <Link to="/dashboard">
                  <Button variant="secondary" className="py-2 px-5 text-sm">
                    {t("sidebar.dashboard") || "Dashboard"}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-textPrimary hover:text-accent-teal transition-colors"
                  >
                    {t("nav.login")}
                  </Link>
                  <Link to="/register">
                    <Button className="py-2 px-5 text-sm">
                      {t("nav.startAssessment")}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-textPrimary hover:text-accent-teal transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg-surface border-b border-border absolute top-full left-0 w-full overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-textPrimary hover:text-accent-teal py-2">
                {t("nav.home")}
              </Link>
              <a href="#how-it-works" onClick={(e) => handleNavClick(e, "how-it-works")} className="text-lg font-medium text-textPrimary hover:text-accent-teal py-2">
                {t("nav.howItWorks")}
              </a>
              <a href="#science" onClick={(e) => handleNavClick(e, "science")} className="text-lg font-medium text-textPrimary hover:text-accent-teal py-2">
                {t("nav.science")}
              </a>
              <a href="#about" onClick={(e) => handleNavClick(e, "about")} className="text-lg font-medium text-textPrimary hover:text-accent-teal py-2">
                {t("nav.about")}
              </a>

              <div className="h-[1px] bg-border my-2" />
              <div className="flex justify-between items-center py-2">
                <LanguageSelector />
              </div>

              {isLoggedIn ? (
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full text-center py-3">
                    {t("sidebar.dashboard") || "Dashboard"}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-center py-3">
                      {t("nav.login")}
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full text-center py-3">
                      {t("nav.startAssessment")}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}