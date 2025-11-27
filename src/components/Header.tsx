import React from 'react';
import { useAuth } from '../AuthContext';
import { Package, LayoutDashboard, Upload, LogIn, LogOut, User } from 'lucide-react';

interface HeaderProps {
    currentPage: 'upload' | 'dashboard';
    onNavigate: (page: 'upload' | 'dashboard') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
    const { user, signInWithGoogle, signOut } = useAuth();

    const handleAuth = async () => {
        try {
            if (user) {
                await signOut();
            } else {
                await signInWithGoogle();
            }
        } catch (error) {
            console.error('Authentication error:', error);
        }
    };

    return (
        <header className="bg-white border-b-2 border-amber-200 shadow-sm sticky top-0 z-50">
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
                                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-lg">
                                        <User className="w-4 h-4 text-amber-600" />
                                        <span className="text-sm font-medium text-amber-900">
                                            {user.displayName || user.email}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleAuth}
                                        className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-semibold transition-all duration-200"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="hidden sm:inline">Sign Out</span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleAuth}
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
    );
};
