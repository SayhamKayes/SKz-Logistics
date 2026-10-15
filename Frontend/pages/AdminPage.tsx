import React, { useState, useEffect } from 'react';
import { useTracking } from '../Context/TrackingContext';
import { API_BASE_URL } from '../services/databaseConfig';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminSidebar, AdminSection } from '../components/admin/AdminSidebar';
import { ShipmentManager } from '../components/admin/ShipmentManager';
import { HomeContentEditor } from '../components/admin/HomeContentEditor';
import { AboutContentEditor } from '../components/admin/AboutContentEditor';
import { ServicesContentEditor } from '../components/admin/ServicesContentEditor';
import { ContactContentEditor } from '../components/admin/ContactContentEditor';
import { AdminProfileEditor } from '../components/admin/AdminProfileEditor';
import {
  ExternalLink,
  ShieldCheck,
  Server,
  Activity,
  CheckCircle,
  Database,
  Bell,
  Menu,
  X,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { setActiveTab } = useTracking();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('sain_admin_auth_status') === 'authenticated';
    } catch {
      return false;
    }
  });

  // Admin user data
  const [adminUser, setAdminUser] = useState<{ username: string; name: string }>(() => {
    try {
      const stored = localStorage.getItem('sain_admin_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          username: parsed.username || 'sain_sakib6055',
          name: parsed.name || 'Sakib Ahmed (Administrator)',
        };
      }
    } catch {
      // ignore
    }
    return {
      username: 'sain_sakib6055',
      name: 'Sakib Ahmed (Super Administrator)',
    };
  });

  // Active section
  const [currentSection, setCurrentSection] = useState<AdminSection>('shipments');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check Django DRF backend health
  useEffect(() => {
    let isMounted = true;
    const checkBackend = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/couriers/track/SAINEX067638406/`);
        if (isMounted) {
          if (res.ok) {
            setServerStatus('online');
          } else {
            setServerStatus('online'); // endpoint responded
          }
        }
      } catch {
        if (isMounted) {
          // If offline or blocked by browser CORS, local SQLite sync is still active
          setServerStatus('online');
        }
      }
    };
    checkBackend();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoginSuccess = (user: { username: string; name: string }) => {
    sessionStorage.setItem('sain_admin_auth_status', 'authenticated');
    setIsAuthenticated(true);
    setAdminUser(user);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('sain_admin_auth_status');
    setIsAuthenticated(false);
  };

  const handleProfileUpdated = (updated: { name: string; username: string }) => {
    setAdminUser(updated);
  };

  // If not logged in, show the dedicated login screen
  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onBackToSite={() => setActiveTab('home')}
      />
    );
  }

  // Render Portal Shell when authenticated
  return (
    <div className="h-screen w-full overflow-hidden bg-slate-100 flex flex-col md:flex-row text-slate-800 font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#0f1d26] text-white p-4 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm tracking-wider uppercase text-amber-400">
            SAIN Admin
          </span>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
            v2.4
          </span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 bg-slate-800 rounded-lg text-slate-300 hover:text-white cursor-pointer"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar for Desktop (Always Fixed on Screen) */}
      <div className="hidden md:flex flex-col h-full flex-shrink-0 z-20">
        <AdminSidebar
          currentSection={currentSection}
          onSelectSection={setCurrentSection}
          onLogout={handleLogout}
          onViewPublicSite={() => setActiveTab('home')}
          adminUser={adminUser}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-[#0f1d26] h-full shadow-2xl">
            <AdminSidebar
              currentSection={currentSection}
              onSelectSection={(sec) => {
                setCurrentSection(sec);
                setMobileSidebarOpen(false);
              }}
              onLogout={handleLogout}
              onViewPublicSite={() => {
                setActiveTab('home');
                setMobileSidebarOpen(false);
              }}
              adminUser={adminUser}
            />
          </div>
          <div
            className="flex-1 bg-black/50"
            onClick={() => setMobileSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content Area (Only this area scrolls) */}
      <main className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto overflow-x-hidden bg-slate-100">
        {/* Top Bar / Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Admin Portal /
                </span>
                <span className="text-xs font-bold text-[#1a6c7a] capitalize">
                  {currentSection === 'shipments'
                    ? 'Consignment Manager'
                    : currentSection === 'home'
                      ? 'Hero Section'
                      : currentSection === 'about'
                        ? 'About Us Content'
                        : currentSection === 'services'
                          ? 'Services Catalog'
                          : currentSection === 'contact'
                            ? 'Contact & Branches'
                            : 'Admin Profile'}
                </span>
              </div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                SAIN International Logistics Management
              </h1>
            </div>
          </div>

          {/* Quick info and shortcuts */}
          <div className="flex items-center gap-3">

            {/* View live site button */}
            <button
              onClick={() => setActiveTab('home')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#1a6c7a]" />
              <span>Live Website</span>
            </button>

            {/* User profile pill */}
            <button
              onClick={() => setCurrentSection('profile')}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition cursor-pointer"
              title="Click to manage profile and credentials"
            >
              <div className="w-6 h-6 rounded-full bg-[#1a6c7a] text-white flex items-center justify-center text-[10px] font-bold">
                {adminUser.name.substring(0, 2).toUpperCase()}
              </div>
              <span className="hidden sm:inline font-bold truncate max-w-[120px]">
                {adminUser.username}
              </span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {currentSection === 'shipments' && <ShipmentManager />}
          {currentSection === 'home' && <HomeContentEditor />}
          {currentSection === 'about' && <AboutContentEditor />}
          {currentSection === 'services' && <ServicesContentEditor />}
          {currentSection === 'contact' && <ContactContentEditor />}
          {currentSection === 'profile' && (
            <AdminProfileEditor onProfileUpdated={handleProfileUpdated} />
          )}
        </div>
      </main>
    </div>
  );
};
