// Dashboard page with eco-points, progress, and leaderboard
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/DemoAuthContext';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  Trophy, 
  Leaf, 
  Target, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Award,
  Calendar,
  Cloud,
  Sun,
  CloudRain
} from 'lucide-react';
import ApiStatus from '../components/ApiStatus';

const Dashboard = () => {
  const { userData } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock weather data (in real app, this would come from OpenWeather API)
  useEffect(() => {
    const mockWeather = {
      temperature: 22,
      condition: 'sunny',
      humidity: 65,
      windSpeed: 12
    };
    setWeather(mockWeather);
    setLoading(false);
  }, []);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          orderBy('points', 'desc'),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const leaderboardData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getLevel = (points) => {
    if (points < 100) return { level: 1, name: 'Seedling', next: 100 };
    if (points < 300) return { level: 2, name: 'Sprout', next: 300 };
    if (points < 600) return { level: 3, name: 'Sapling', next: 600 };
    if (points < 1000) return { level: 4, name: 'Tree', next: 1000 };
    if (points < 1500) return { level: 5, name: 'Forest Guardian', next: 1500 };
    return { level: 6, name: 'Eco Master', next: null };
  };

  const userLevel = getLevel(userData?.points || 0);
  const progressPercentage = userLevel.next ? ((userData?.points || 0) / userLevel.next) * 100 : 100;

  const stats = [
    {
      title: 'Total Points',
      value: userData?.points || 0,
      icon: Trophy,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100'
    },
    {
      title: 'Current Level',
      value: userLevel.name,
      icon: Award,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100'
    },
    {
      title: 'Quizzes Completed',
      value: userData?.quizzesCompleted || 0,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Challenges Done',
      value: userData?.challengesCompleted || 0,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {userData?.name || 'Eco Warrior'}! 🌱
              </h1>
              <p className="text-gray-600">
                Keep up the great work in your environmental education journey!
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <ApiStatus />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`${stat.bgColor} p-3 rounded-lg`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Level Progress
                </h3>
                <span className="text-sm text-gray-600">
                  Level {userLevel.level}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>{userData?.points || 0} points</span>
                  {userLevel.next && (
                    <span>{userLevel.next} points to next level</span>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Leaf className="h-5 w-5 text-primary-600" />
                <span className="text-sm font-medium text-gray-900">
                  {userLevel.name}
                </span>
              </div>
            </div>

            {/* Weather Card */}
            {weather && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Today's Weather
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getWeatherIcon(weather.condition)}
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {weather.temperature}°C
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        {weather.condition}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>Humidity: {weather.humidity}%</p>
                    <p>Wind: {weather.windSpeed} km/h</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center space-x-3 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                  <BookOpen className="h-6 w-6 text-primary-600" />
                  <span className="font-medium text-primary-900">Take a Quiz</span>
                </button>
                <button className="flex items-center space-x-3 p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                  <Target className="h-6 w-6 text-secondary-600" />
                  <span className="font-medium text-secondary-900">View Challenges</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Leaderboard */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Trophy className="h-6 w-6 text-secondary-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Global Leaderboard
                </h3>
              </div>
              
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((user, index) => (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      user.id === userData?.uid
                        ? 'bg-primary-50 border border-primary-200'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {user.school || 'Student'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {user.points}
                      </p>
                      <p className="text-xs text-gray-600">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Achievements
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Award className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      First Quiz Completed!
                    </p>
                    <p className="text-xs text-green-700">
                      +10 points
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Daily Challenge
                    </p>
                    <p className="text-xs text-blue-700">
                      +5 points
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
