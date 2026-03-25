import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Package,
  LayoutDashboard,
  Upload,
  LogIn,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { AuthModal } from '../AuthModal';
import type { HeaderProps } from './Header.types';

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getAvatarLetter = () => {
    if (!user) return '?';
    // If Google user (usually has providerData with google.com)
    const isGoogle = user.providerData.some((p) => p.providerId === 'google.com');

    if (isGoogle && user.email) {
      return user.email.charAt(0).toUpperCase();
    }

    // If Email/Password user (has displayName)
    if (user.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }

    return user.email?.charAt(0).toUpperCase() || '?';
  };

  const getUserLabel = () => {
    if (!user) return '';
    const isGoogle = user.providerData.some((p) => p.providerId === 'google.com');

    if (isGoogle) {
      return user.email;
    }

    // For Email/Password users, show Username
    return user.displayName || user.email;
  };

  const handleNavigate = (page: 'upload' | 'dashboard') => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b-2 border-amber-200 dark:border-gray-700 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleNavigate('upload')}
            >
              <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg shadow-md">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                StackPack
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors"
                title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-amber-700" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-400" />
                )}
              </button>
              <button
                onClick={() => handleNavigate('upload')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  currentPage === 'upload'
                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100'
                    : 'text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-gray-700'
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>

              <button
                onClick={() => handleNavigate('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  currentPage === 'dashboard'
                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100'
                    : 'text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-gray-700'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>

              {/* Auth Button */}
              <div className="ml-2 pl-2 border-l-2 border-amber-200 dark:border-gray-700">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-gray-700 rounded-lg border border-amber-100 dark:border-gray-600">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-sm">
                        {getAvatarLetter()}
                      </div>
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
                          {getUserLabel()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-gray-700 hover:bg-amber-200 dark:hover:bg-gray-600 text-amber-900 dark:text-amber-100 rounded-lg font-semibold transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 btn-primary"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                )}
              </div>
            </nav>

            {/* Mobile: Auth + Hamburger */}
            <div className="flex sm:hidden items-center gap-2">
              {user ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-sm">
                  {getAvatarLetter()}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1 px-3 py-2 btn-primary text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-amber-700 dark:text-amber-300" />
                ) : (
                  <Menu className="w-6 h-6 text-amber-700 dark:text-amber-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-amber-100 bg-white dark:bg-gray-900 dark:border-gray-700 px-4 py-3 flex flex-col gap-1">
            <button
              onClick={() => handleNavigate('upload')}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                currentPage === 'upload'
                  ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100'
                  : 'text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-gray-700'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
            <button
              onClick={() => handleNavigate('dashboard')}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                currentPage === 'dashboard'
                  ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100'
                  : 'text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-gray-700'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => {
                toggleTheme();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-lg font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
            {user && (
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-3 rounded-lg font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                Sign Out ({getUserLabel()})
              </button>
            )}
          </div>
        )}
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
