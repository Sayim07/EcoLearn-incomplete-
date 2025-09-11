// Home page with authentication forms
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/DemoAuthContext';
import { Leaf, BookOpen, Trophy, Users, Target, CheckCircle, ArrowRight } from 'lucide-react';

const Home = () => {
  const { signUp, signIn } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    school: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      
      const result = await signUp(formData.email, formData.password, {
        name: formData.name,
        school: formData.school
      });
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } else {
      const result = await signIn(formData.email, formData.password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    }
    
    setLoading(false);
  };

  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Quizzes',
      description: 'Test your environmental knowledge with engaging quizzes and earn eco-points.'
    },
    {
      icon: Target,
      title: 'Daily Challenges',
      description: 'Complete eco-friendly challenges and track your environmental impact.'
    },
    {
      icon: Trophy,
      title: 'Leaderboards',
      description: 'Compete with classmates and see who\'s the top eco-warrior!'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Share achievements and learn from your peers in the eco-community.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Leaf className="h-16 w-16 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary-600">EcoLearn</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A gamified environmental education platform that makes learning about sustainability fun and engaging for students of all ages.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mt-16">
          {/* Authentication Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-gray-600">
                {isSignUp ? 'Join the eco-education revolution!' : 'Sign in to continue your eco-journey'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={isSignUp}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School/Institution
                  </label>
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    required={isSignUp}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your school name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required={isSignUp}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {isSignUp ? 'Already have an account? Sign in' : 'Don\'t have an account? Sign up'}
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Why Choose EcoLearn?
              </h3>
              <p className="text-gray-600 mb-8">
                Our platform combines education with gamification to create an engaging learning experience that motivates students to care for the environment.
              </p>
            </div>

            <div className="grid gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-primary-50 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="h-5 w-5 text-primary-600" />
                <span className="font-semibold text-primary-900">Ready to start?</span>
              </div>
              <p className="text-primary-700 text-sm">
                Join thousands of students already making a difference for our planet!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-6 w-6 text-primary-400" />
            <span className="text-xl font-bold">EcoLearn</span>
          </div>
          <p className="text-gray-400">
            Making environmental education engaging and fun for the next generation.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
