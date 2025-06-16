import React, { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../../../components/ui/navigation-menu";
import { useAuth } from "../../../../contexts/AuthContext";

export const HeroSection = (): JSX.Element => {
  const { user, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Navigation items data
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // Default to dark mode
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <header className="flex items-center justify-between px-4 md:px-10 py-3 bg-[#0f1419] border-b border-[#1e282d] w-full relative">
      {/* Logo section */}
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.location.href = user ? '/dashboard' : '/'}>
        <div className="flex items-start">
          <div className="w-4 h-4 bg-[url(/vector---0.svg)] bg-[100%_100%]" />
        </div>
        <div className="flex items-start">
          <h1 className="font-bold text-white text-lg leading-[23px] font-['Lexend',Helvetica]">
            MyEduPro
          </h1>
        </div>
      </div>

      {/* Desktop Navigation and CTA section */}
      <div className="hidden lg:flex items-center justify-end gap-8 flex-1">
        <NavigationMenu>
          <NavigationMenuList className="gap-9">
            {navItems.map((item, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink
                  className="font-medium text-white text-sm leading-[21px] font-['Lexend',Helvetica] hover:text-[#3f8cbf] transition-colors"
                  href={item.href}
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Auth Buttons and Theme Toggle */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={handleThemeToggle}
            className="w-8 h-8 flex items-center justify-center text-[#9eafbf] hover:text-white hover:bg-[#2a3540] rounded-lg transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="text-lg">
              {isDarkMode ? '☀️' : '🌙'}
            </span>
          </button>

          {loading ? (
            <div className="w-4 h-4 border-2 border-[#3f8cbf] border-t-transparent rounded-full animate-spin"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <Button 
                className="min-w-[100px] h-10 px-4 py-0 bg-[#3f8cbf] hover:bg-[#2d6a94] rounded-[20px] font-bold text-white text-sm font-['Lexend',Helvetica] transition-colors"
                onClick={() => window.location.href = '/dashboard'}
              >
                Dashboard
              </Button>
              <Button 
                className="min-w-[70px] h-10 px-4 py-0 bg-transparent border border-[#3f8cbf] text-[#3f8cbf] hover:bg-[#3f8cbf] hover:text-white rounded-[20px] font-bold text-sm font-['Lexend',Helvetica] transition-colors"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Button 
                className="min-w-[70px] h-10 px-4 py-0 bg-transparent border border-[#3f8cbf] text-[#3f8cbf] hover:bg-[#3f8cbf] hover:text-white rounded-[20px] font-bold text-sm font-['Lexend',Helvetica] transition-colors"
                onClick={() => window.location.href = '/login'}
              >
                Login
              </Button>
              <Button 
                className="min-w-[84px] h-10 px-4 py-0 bg-[#3f8cbf] hover:bg-[#2d6a94] rounded-[20px] font-bold text-white text-sm font-['Lexend',Helvetica] transition-colors"
                onClick={() => window.location.href = '/signup'}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center gap-3">
        {/* Mobile Theme Toggle Button */}
        <button
          onClick={handleThemeToggle}
          className="w-8 h-8 flex items-center justify-center text-[#9eafbf] hover:text-white hover:bg-[#2a3540] rounded-lg transition-colors"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <span className="text-lg">
            {isDarkMode ? '☀️' : '🌙'}
          </span>
        </button>

        {/* Mobile Auth Buttons - Show Dashboard if logged in */}
        {!loading && user && (
          <Button 
            className="h-8 px-3 py-0 bg-[#3f8cbf] hover:bg-[#2d6a94] rounded-[16px] font-bold text-white text-xs font-['Lexend',Helvetica] transition-colors"
            onClick={() => window.location.href = '/dashboard'}
          >
            Dashboard
          </Button>
        )}
        
        {/* Mobile Sign Up Button - Only show if not logged in */}
        {!loading && !user && (
          <Button 
            className="h-8 px-3 py-0 bg-[#3f8cbf] hover:bg-[#2d6a94] rounded-[16px] font-bold text-white text-xs font-['Lexend',Helvetica] transition-colors"
            onClick={() => window.location.href = '/signup'}
          >
            Sign Up
          </Button>
        )}
        
        <button
          onClick={toggleMobileMenu}
          className="flex flex-col justify-center items-center w-8 h-8 space-y-1"
          aria-label="Toggle mobile menu"
        >
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0f1419] border-b border-[#1e282d] z-50">
          <div className="flex flex-col p-4 space-y-4">
            {/* Mobile Navigation */}
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="font-medium text-white text-base leading-6 font-['Lexend',Helvetica] hover:text-[#3f8cbf] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            
            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-[#1e282d]">
              {loading ? (
                <div className="flex justify-center">
                  <div className="w-4 h-4 border-2 border-[#3f8cbf] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : user ? (
                <div className="flex flex-col gap-3">
                  <Button 
                    className="w-full h-10 bg-[#3f8cbf] hover:bg-[#2d6a94] rounded-[20px] font-bold text-white text-sm font-['Lexend',Helvetica] transition-colors"
                    onClick={() => {
                      window.location.href = '/dashboard';
                      setMobileMenuOpen(false);
                    }}
                  >
                    Go to Dashboard
                  </Button>
                  <Button 
                    className="w-full h-10 bg-transparent border border-[#3f8cbf] text-[#3f8cbf] hover:bg-[#3f8cbf] hover:text-white rounded-[20px] font-bold text-sm font-['Lexend',Helvetica] transition-colors"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button 
                    className="w-full h-10 bg-transparent border border-[#3f8cbf] text-[#3f8cbf] hover:bg-[#3f8cbf] hover:text-white rounded-[20px] font-bold text-sm font-['Lexend',Helvetica] transition-colors"
                    onClick={() => {
                      window.location.href = '/login';
                      setMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    className="w-full h-10 bg-[#3f8cbf] hover:bg-[#2d6a94] rounded-[20px] font-bold text-white text-sm font-['Lexend',Helvetica] transition-colors"
                    onClick={() => {
                      window.location.href = '/signup';
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};