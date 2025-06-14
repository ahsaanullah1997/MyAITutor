import React from "react";
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

  // Navigation items data
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="flex items-center justify-between px-10 py-3 bg-[#0f1419] border-b border-[#1e282d] w-full">
      {/* Logo section */}
      <div className="flex items-center gap-4">
        <div className="flex items-start">
          <div className="w-4 h-4 bg-[url(/vector---0.svg)] bg-[100%_100%]" />
        </div>
        <div className="flex items-start">
          <h1 className="font-bold text-white text-lg leading-[23px] font-['Lexend',Helvetica]">
            EduGenius
          </h1>
        </div>
      </div>

      {/* Navigation and CTA section */}
      <div className="flex items-center justify-end gap-8 flex-1">
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

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-4 h-4 border-2 border-[#3f8cbf] border-t-transparent rounded-full animate-spin"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-white text-sm font-['Lexend',Helvetica]">
                Welcome back!
              </span>
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
    </header>
  );
};