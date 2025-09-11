// Challenges page with daily/weekly eco challenges
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/DemoAuthContext';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  Target, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Trophy, 
  Leaf,
  Recycle,
  TreePine,
  Bike,
  Lightbulb,
  Droplets,
  Wind,
  Star,
  Award
} from 'lucide-react';

const Challenges = () => {
  const { userData, setUserData } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock challenges data
  const mockChallenges = [
    {
      id: '1',
      title: 'Turn Off Lights',
      description: 'Turn off all unnecessary lights in your home for 2 hours',
      category: 'energy',
      type: 'daily',
      points: 10,
      icon: Lightbulb,
      difficulty: 'Easy',
      duration: '2 hours',
      completed: false,
      streak: 0
    },
    {
      id: '2',
      title: 'Recycle Paper',
      description: 'Collect and recycle 5 pieces of paper waste',
      category: 'waste',
      type: 'daily',
      points: 15,
      icon: Recycle,
      difficulty: 'Easy',
      duration: '30 minutes',
      completed: false,
      streak: 0
    },
    {
      id: '3',
      title: 'Plant a Tree',
      description: 'Plant a tree in your garden or local park',
      category: 'nature',
      type: 'weekly',
      points: 100,
      icon: TreePine,
      difficulty: 'Hard',
      duration: '2 hours',
      completed: false,
      streak: 0
    },
    {
      id: '4',
      title: 'Bike to School',
      description: 'Use a bicycle instead of a car for your commute',
      category: 'transport',
      type: 'daily',
      points: 25,
      icon: Bike,
      difficulty: 'Medium',
      duration: '1 hour',
      completed: false,
      streak: 0
    },
    {
      id: '5',
      title: 'Save Water',
      description: 'Take a 5-minute shower instead of a 10-minute one',
      category: 'water',
      type: 'daily',
      points: 12,
      icon: Droplets,
      difficulty: 'Easy',
      duration: '5 minutes',
      completed: false,
      streak: 0
    },
    {
      id: '6',
      title: 'Use Reusable Bag',
      description: 'Use a reusable shopping bag instead of plastic bags',
      category: 'waste',
      type: 'daily',
      points: 8,
      icon: Recycle,
      difficulty: 'Easy',
      duration: '5 minutes',
      completed: false,
      streak: 0
    },
    {
      id: '7',
      title: 'Wind Energy Research',
      description: 'Research and learn about wind energy for 30 minutes',
      category: 'education',
      type: 'weekly',
      points: 50,
      icon: Wind,
      difficulty: 'Medium',
      duration: '30 minutes',
      completed: false,
      streak: 0
    },
    {
      id: '8',
      title: 'Compost Food Waste',
      description: 'Start composting your food waste for a week',
      category: 'waste',
      type: 'weekly',
      points: 75,
      icon: Leaf,
      difficulty: 'Medium',
      duration: '7 days',
      completed: false,
      streak: 0
    }
  ];

  const categories = [
    { id: 'all', name: 'All Challenges', icon: Target },
    { id: 'energy', name: 'Energy', icon: Lightbulb },
    { id: 'waste', name: 'Waste', icon: Recycle },
    { id: 'nature', name: 'Nature', icon: TreePine },
    { id: 'transport', name: 'Transport', icon: Bike },
    { id: 'water', name: 'Water', icon: Droplets },
    { id: 'education', name: 'Education', icon: Wind }
  ];

  useEffect(() => {
    // Simulate loading and set mock data
    setTimeout(() => {
      setChallenges(mockChallenges);
      setLoading(false);
    }, 1000);
  }, []);

  const completeChallenge = async (challengeId) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    try {
      // Update user points in Firestore
      if (userData) {
        await updateDoc(doc(db, 'users', userData.uid), {
          points: increment(challenge.points),
          challengesCompleted: increment(1)
        });

        // Update local user data
        setUserData({
          ...userData,
          points: userData.points + challenge.points,
          challengesCompleted: (userData.challengesCompleted || 0) + 1
        });
      }

      // Update challenge completion status
      setChallenges(prev => 
        prev.map(c => 
          c.id === challengeId 
            ? { ...c, completed: true, streak: c.streak + 1 }
            : c
        )
      );

      setCompletedChallenges(prev => [...prev, challengeId]);
    } catch (error) {
      console.error('Error completing challenge:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'daily':
        return 'bg-blue-100 text-blue-800';
      case 'weekly':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredChallenges = selectedCategory === 'all' 
    ? challenges 
    : challenges.filter(challenge => challenge.category === selectedCategory);

  const dailyChallenges = challenges.filter(c => c.type === 'daily' && !c.completed);
  const weeklyChallenges = challenges.filter(c => c.type === 'weekly' && !c.completed);
  const completedCount = challenges.filter(c => c.completed).length;

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Eco Challenges
          </h1>
          <p className="text-gray-600">
            Complete daily and weekly challenges to earn points and make a positive impact!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Target className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {completedCount}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {dailyChallenges.length}
                </p>
                <p className="text-sm text-gray-600">Daily Available</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {weeklyChallenges.length}
                </p>
                <p className="text-sm text-gray-600">Weekly Available</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-secondary-100 rounded-lg">
                <Trophy className="h-6 w-6 text-secondary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {userData?.points || 0}
                </p>
                <p className="text-sm text-gray-600">Total Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => {
            const Icon = challenge.icon;
            return (
              <div
                key={challenge.id}
                className={`bg-white rounded-xl shadow-sm p-6 transition-all ${
                  challenge.completed 
                    ? 'opacity-75 border-2 border-green-200' 
                    : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${
                      challenge.completed ? 'bg-green-100' : 'bg-primary-100'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        challenge.completed ? 'text-green-600' : 'text-primary-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {challenge.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(challenge.type)}`}>
                          {challenge.type}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  {challenge.completed && (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {challenge.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Points:</span>
                    <span className="font-semibold text-gray-900">
                      +{challenge.points}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold text-gray-900">
                      {challenge.duration}
                    </span>
                  </div>
                  {challenge.streak > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Streak:</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold text-gray-900">
                          {challenge.streak}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => completeChallenge(challenge.id)}
                  disabled={challenge.completed}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    challenge.completed
                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {challenge.completed ? (
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Award className="h-4 w-4" />
                      <span>Complete Challenge</span>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Achievement Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {completedCount}
              </div>
              <div className="text-gray-600">Challenges Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-600 mb-2">
                {challenges.reduce((sum, c) => sum + c.streak, 0)}
              </div>
              <div className="text-gray-600">Total Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {challenges.filter(c => c.completed).reduce((sum, c) => sum + c.points, 0)}
              </div>
              <div className="text-gray-600">Points from Challenges</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
