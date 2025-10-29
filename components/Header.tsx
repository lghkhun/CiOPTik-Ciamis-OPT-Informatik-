
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LeafIcon } from './Icons';

const Header: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { path: '/', label: 'Beranda' },
        { path: '/informasi', label: 'Informasi' },
        { path: '/data', label: 'Data Publik' },
        { path: '/admin', label: 'Admin Dashboard', auth: true },
    ];
    
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <LeafIcon className="h-8 w-8 text-green-600" />
                        <Link to="/" className="text-xl font-bold text-gray-800">CiOPTik</Link>
                    </div>
                    <nav className="hidden md:flex items-center space-x-4">
                        {navLinks.map(link => {
                            if (link.auth && !isAuthenticated) return null;
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                        isActive 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="flex items-center">
                        {isAuthenticated ? (
                             <button
                                onClick={handleLogout}
                                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;