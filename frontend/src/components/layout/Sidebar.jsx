import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  BrainCog,
  Activity,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar({ user }) {
  const { t } = useTranslation();
  const navItems = [
    {
      label: t("sidebar.dashboard"),
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    { label: t("sidebar.hub"), icon: <BrainCog size={20} />, path: "/hub" },
    { label: t("sidebar.results"), icon: <Activity size={20} />, path: "/results" },
  ];

  const handleLogout = () => {
    Object.keys(localStorage).forEach(key => {
      if (key !== 'i18nextLng' && key !== 'preferredLanguage') {
        localStorage.removeItem(key);
      }
    });
    window.location.href = "/";
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-bg-surface border-r border-border hidden md:flex flex-col z-40 transform transition-transform">
      <div className="p-6 h-20 border-b border-border flex items-center">
        <NavLink to="/dashboard" className="text-xl font-display font-bold text-white tracking-tighter">
          NEURO<span className="text-accent-teal">LOOP</span>
        </NavLink>
      </div>

      <div className="flex-1 py-8 flex flex-col gap-2 px-4 overflow-y-auto">
        {/* User Card */}
        <NavLink
          to="/profile"
          className={({ isActive }) => `mb-8 p-4 bg-bg-elevated rounded-xl border border-border flex items-center gap-3 transition-all hover:border-accent-teal/50 ${isActive ? 'border-accent-teal/50 ring-1 ring-accent-teal/20' : ''}`}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-teal flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div>
            <p className="text-sm font-semibold text-textPrimary">
              {user?.name || t("sidebar.viewProfile")}
            </p>
            <p className="text-xs text-textMuted hover:text-accent-teal transition-colors">{t("sidebar.viewProfile")}</p>
          </div>
        </NavLink>

        <div className="text-xs uppercase font-bold text-textMuted mb-2 px-2 tracking-wider">
          {t("sidebar.menu")}
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive
                ? "bg-accent-teal/10 text-accent-teal shadow-[inset_4px_0_0_0_var(--accent-teal)]"
                : "text-textSecondary hover:bg-bg-elevated hover:text-white"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        {/* Bottom Actions */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive
              ? "bg-accent-teal/10 text-accent-teal shadow-[inset_4px_0_0_0_var(--accent-teal)]"
              : "text-textSecondary hover:bg-bg-elevated hover:text-white"
            }`
          }
        >
          <Settings size={20} />
          {t("sidebar.settings")}
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 mt-1 rounded-xl transition-all font-medium text-sm text-red-400 hover:bg-red-400/10 hover:text-red-300"
        >
          <LogOut size={20} />
          {t("sidebar.logout")}
        </button>
      </div>
    </aside>
  );
}
