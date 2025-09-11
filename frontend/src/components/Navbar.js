// Navigation component
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/DemoAuthContext';
import { Leaf, Menu, X, User, LogOut, Trophy, BookOpen, Target, Users, Settings } from 'lucide-react';

const Navbar = () => {
  const { currentUser, userData, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      navigate('/');
      setIsMenuOpen(false);
    }
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: User },
    { name: 'Quizzes', href: '/quizzes', icon: BookOpen },
    { name: 'Challenges', href: '/challenges', icon: Target },
    { name: 'Community', href: '/community', icon: Users },
  ];

  // Add admin link if user is admin
  if (userData?.role === 'admin') {
    navigationItems.push({ name: 'Admin', href: '/admin', icon: Settings });
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">EcoLearn</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {currentUser ? (
              <>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                
                {/* User info and sign out */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-secondary-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {userData?.points || 0} pts
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {currentUser ? (
                <>
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                  
                  <div className="border-t pt-2 mt-2">
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <Trophy className="h-4 w-4 text-secondary-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {userData?.points || 0} points
                      </span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 text-gray-700 hover:text-red-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-1">
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-primary-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
