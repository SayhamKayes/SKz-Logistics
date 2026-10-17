import React from 'react';
import { SainLogo } from '../../assets/Logo';
import {
  Package,
  Home,
  Info,
  Truck,
  Phone,
  User,
  LogOut,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  PanelBottom,
  Clock,
  History,
} from 'lucide-react';
import { getAdminInitials } from '../../utils/adminInitials';

export type AdminSection = 'shipments' | 'timers' | 'history' | 'home' | 'about' | 'services' | 'contact' | 'footer' | 'profile';

interface AdminSidebarProps {
  currentSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  onLogout: () => void;
  onViewPublicSite: () => void;
  adminUser: { username: string; name: string };
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentSection,
  onSelectSection,
  onLogout,
  onViewPublicSite,
  adminUser,
}) => {
  const menuItems: { id: AdminSection; label: string; icon: any; badge?: string }[] = [
    { id: 'shipments', label: 'Shipment Manager', icon: Package },
    { id: 'timers', label: 'Shipment Timer', icon: Clock },
    { id: 'home', label: 'Hero Section', icon: Home },
    { id: 'about', label: 'About Us Section', icon: Info },
    { id: 'services', label: 'Services Catalog', icon: Truck },
    { id: 'contact', label: 'Contact & Branches', icon: Phone },
    { id: 'footer', label: 'Footer Section', icon: PanelBottom },
    { id: 'profile', label: 'Admin Profile & Security', icon: User },
    { id: 'history', label: 'Activity & History', icon: History },
  ];

  return (
    <aside className="w-64 bg-[#0f1d26] text-slate-300 flex flex-col justify-between border-r border-slate-800 flex-shrink-0 h-full overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-950/40">
          <div className="bg-white p-2 rounded-xl scale-90 origin-left inline-block shadow-sm">
            <SainLogo variant="full" />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Admin Portal
            </span>
            <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded">
              v3.1 Pro
            </span>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Portal Navigation
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${isActive
                  ? 'bg-[#1a6c7a] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-400/20 text-amber-300 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer with Logged In User & Logout */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 space-y-3">
        {/* Admin user info */}
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs select-none">
            {getAdminInitials(adminUser.name)}
          </div>
          <div className="overflow-hidden">
            <h5 className="text-xs font-bold text-slate-100 truncate">{adminUser.name}</h5>
            <p className="text-[10px] text-slate-400 truncate">@{adminUser.username}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-1.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer"
            title="Open Public Website in a new tab"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Public Website</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </a>

          <button
            onClick={onLogout}
            className="w-full py-2 px-3 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-lg text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
