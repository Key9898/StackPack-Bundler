import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Package, LayoutDashboard, Upload, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { AuthModal } from './AuthModal';

interface HeaderProps {
    currentPage: 'upload' | 'dashboard';
    onNavigate: (page: 'upload' | 'dashboard') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
    const { user, signOut } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
        const isGoogle = user.providerData.some(p => p.providerId === 'google.com');

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
        const isGoogle = user.providerData.some(p => p.providerId === 'google.com');

        if (isGoogle) {
            // For Google users, maybe show email or just "User"
            // User didn't specify text label for Google, but usually email is good.
            // But user said "Navbar User Display... Google... Email First Letter in Avatar".
            // Let's show email as label for Google users.
            return user.email;
        }

        // For Email/Password users, show Username
        return user.displayName || user.email;
    };

    return (
        <>
            <header className="bg-white border-b-2 border-amber-200 shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('upload')}>
                            <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg shadow-md">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                StackPack
                            </span>
                        </div>

                        {/* Navigation */}
                        <nav className="flex items-center gap-4">
                            <button
                                onClick={() => onNavigate('upload')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${currentPage === 'upload'
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'text-amber-700 hover:bg-amber-50'
                                    }`}
                            >
                                <Upload className="w-4 h-4" />
                                <span className="hidden sm:inline">Upload</span>
                            </button>

                            <button
                                onClick={() => onNavigate('dashboard')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${currentPage === 'dashboard'
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'text-amber-700 hover:bg-amber-50'
                                    }`}
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </button>

                            {/* Auth Button */}
                            <div className="ml-2 pl-2 border-l-2 border-amber-200">
                                {user ? (
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-lg border border-amber-100">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-sm">
                                                {getAvatarLetter()}
                                            </div>
                                            <div className="hidden sm:flex items-center gap-2">
                                                <UserIcon className="w-4 h-4 text-amber-600" />
                                                <span className="text-sm font-medium text-amber-900">
                                                    {getUserLabel()}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleSignOut}
                                            className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-semibold transition-all duration-200"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span className="hidden sm:inline">Sign Out</span>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsAuthModalOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 btn-primary"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        <span className="hidden sm:inline">Sign In</span>
                                    </button>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
};
