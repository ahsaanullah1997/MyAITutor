import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Button } from "../../../components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Get current page from URL
  const currentPath = window.location.pathname;

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [currentPath]);

  const navigationItems = [
    { 
      name: "Dashboard", 
      href: "/dashboard", 
      icon: "📊",
      active: currentPath === "/dashboard"
    },
    { 
      name: "AI Tutor", 
      href: "/dashboard/ai-tutor", 
      icon: "🤖",
      active: currentPath === "/dashboard/ai-tutor"
    },
    { 
      name: "Progress", 
      href: "/dashboard/progress", 
      icon: "📈",
      active: currentPath === "/dashboard/progress"
    },
    { 
      name: "Study Materials", 
      href: "/dashboard/materials", 
      icon: "📚",
      active: currentPath === "/dashboard/materials"
    },
    { 
      name: "Tests & Quizzes", 
      href: "/dashboard/tests", 
      icon: "📝",
      active: currentPath === "/dashboard/tests"
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Get page title based on current path
  const getPageTitle = () => {
    const item = navigationItems.find(item => item.active);
    if (currentPath === "/dashboard/settings") return "Settings";
    return item ? item.name : "Dashboard";
  };

  // Close dropdown when clicking outside
  const handleDropdownToggle = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  // Calculate sidebar width based on state
  const getSidebarWidth = () => {
    if (isMobile) return 'w-64'; // Always full width on mobile
    return sidebarCollapsed ? 'w-16' : 'w-64';
  };

  return (
    <div className="min-h-screen bg-[#0f1419] flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed' : 'relative'} 
        inset-y-0 left-0 z-50 
        ${getSidebarWidth()} 
        bg-[#1e282d] border-r border-[#3d4f5b] 
        transform transition-all duration-300 ease-in-out
        ${isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        flex flex-col
      `}>
        
        {/* Logo and Collapse Button */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#3d4f5b] min-h-[73px]">
          {/* Logo */}
          <div 
            className={`flex items-center gap-3 cursor-pointer transition-all duration-300 ${
              !isMobile && sidebarCollapsed ? 'opacity-0 pointer-events-none w-0 overflow-hidden' : 'opacity-100 w-auto'
            }`}
            onClick={() => window.location.href = '/dashboard'}
          >
            <div className="w-6 h-6 bg-[#3f8cbf] rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <h1 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg whitespace-nowrap">
              MyEduPro
            </h1>
          </div>
          
          {/* Collapse Button - Only show on desktop */}
          {!isMobile && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="flex items-center justify-center w-8 h-8 text-[#9eafbf] hover:text-white hover:bg-[#2a3540] rounded-lg transition-colors flex-shrink-0"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <span className="text-lg">
                {sidebarCollapsed ? '→' : '←'}
              </span>
            </button>
          )}

          {/* Mobile Close Button */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="flex items-center justify-center w-8 h-8 text-[#9eafbf] hover:text-white hover:bg-[#2a3540] rounded-lg transition-colors"
            >
              <span className="text-lg">✕</span>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group relative ${
                    item.active
                      ? 'bg-[#3f8cbf] text-white'
                      : 'text-[#9eafbf] hover:bg-[#2a3540] hover:text-white'
                  }`}
                  title={!isMobile && sidebarCollapsed ? item.name : undefined}
                >
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <span className={`[font-family:'Lexend',Helvetica] font-medium text-sm transition-all duration-300 ${
                    !isMobile && sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
                  }`}>
                    {item.name}
                  </span>
                  
                  {/* Tooltip for collapsed state */}
                  {!isMobile && sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[#0f1419] text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section: Settings, User Profile, and Sign Out */}
        <div className="border-t border-[#3d4f5b]">
          {/* Settings */}
          <div className="px-4 py-2">
            <a
              href="/dashboard/settings"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group relative ${
                currentPath === "/dashboard/settings"
                  ? 'bg-[#3f8cbf] text-white'
                  : 'text-[#9eafbf] hover:bg-[#2a3540] hover:text-white'
              }`}
              title={!isMobile && sidebarCollapsed ? "Settings" : undefined}
            >
              <span className="text-lg flex-shrink-0">⚙️</span>
              <span className={`[font-family:'Lexend',Helvetica] font-medium text-sm transition-all duration-300 ${
                !isMobile && sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
              }`}>
                Settings
              </span>
              
              {/* Tooltip for collapsed state */}
              {!isMobile && sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-[#0f1419] text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  Settings
                </div>
              )}
            </a>
          </div>

          {/* User Profile */}
          <div className={`px-4 py-4 border-t border-[#3d4f5b] transition-all duration-300`}>
            <div className={`flex items-center gap-3 ${!isMobile && sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-[#3f8cbf] rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                {profile?.profile_picture_url ? (
                  <img 
                    src={profile.profile_picture_url} 
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-sm [font-family:'Lexend',Helvetica]">
                    {profile?.first_name?.[0] || 'U'}{profile?.last_name?.[0] || ''}
                  </span>
                )}
              </div>
              <div className={`flex-1 min-w-0 transition-all duration-300 ${
                !isMobile && sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
              }`}>
                <p className="text-white font-medium text-sm [font-family:'Lexend',Helvetica] truncate">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-[#9eafbf] text-xs [font-family:'Lexend',Helvetica] truncate">
                  {profile?.grade || 'Complete your profile'}
                </p>
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="p-4">
            <Button
              onClick={handleSignOut}
              className={`w-full bg-transparent border border-[#3d4f5b] text-[#9eafbf] hover:bg-[#2a3540] hover:text-white rounded-lg [font-family:'Lexend',Helvetica] font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                !isMobile && sidebarCollapsed ? 'px-2' : 'px-4'
              }`}
              title={!isMobile && sidebarCollapsed ? "Sign Out" : undefined}
            >
              <span className={!isMobile && sidebarCollapsed ? 'text-lg' : 'text-sm'}>
                {!isMobile && sidebarCollapsed ? '🚪' : '🚪'}
              </span>
              <span className={`transition-all duration-300 ${
                !isMobile && sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
              }`}>
                Sign Out
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-[#1e282d] border-b border-[#3d4f5b] px-4 lg:px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center justify-center w-8 h-8 text-white hover:bg-[#2a3540] rounded-lg transition-colors"
            >
              <div className="space-y-1">
                <span className="block w-5 h-0.5 bg-white"></span>
                <span className="block w-5 h-0.5 bg-white"></span>
                <span className="block w-5 h-0.5 bg-white"></span>
              </div>
            </button>

            {/* Page Title */}
            <h1 className="[font-family:'Lexend',Helvetica] font-bold text-white text-xl lg:text-2xl truncate">
              {getPageTitle()}
            </h1>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Button 
                className="hidden sm:flex bg-[#3f8cbf] hover:bg-[#2d6a94] text-white rounded-lg px-4 py-2 [font-family:'Lexend',Helvetica] font-medium text-sm whitespace-nowrap"
                onClick={() => window.location.href = '/dashboard/ai-tutor'}
              >
                Ask AI Tutor
              </Button>
              
              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button
                  onClick={handleDropdownToggle}
                  className="w-8 h-8 bg-[#3f8cbf] rounded-full flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-[#3f8cbf] hover:ring-opacity-50 transition-all flex-shrink-0"
                >
                  {profile?.profile_picture_url ? (
                    <img 
                      src={profile.profile_picture_url} 
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-xs font-bold">
                      {profile?.first_name?.[0] || 'U'}
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#1e282d] border border-[#3d4f5b] rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      {/* User Info */}
                      <div className="px-4 py-2 border-b border-[#3d4f5b]">
                        <p className="text-white font-medium text-sm [font-family:'Lexend',Helvetica] truncate">
                          {profile?.first_name} {profile?.last_name}
                        </p>
                        <p className="text-[#9eafbf] text-xs [font-family:'Lexend',Helvetica] truncate">
                          {user?.email}
                        </p>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-1">
                        <a
                          href="/dashboard/settings"
                          className="flex items-center gap-3 px-4 py-2 text-[#9eafbf] hover:bg-[#2a3540] hover:text-white transition-colors [font-family:'Lexend',Helvetica] text-sm"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <span className="text-base">⚙️</span>
                          Settings
                        </a>
                        
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            handleSignOut();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-[#9eafbf] hover:bg-[#2a3540] hover:text-white transition-colors [font-family:'Lexend',Helvetica] text-sm text-left"
                        >
                          <span className="text-base">🚪</span>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};