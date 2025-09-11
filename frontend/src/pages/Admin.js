// Admin page for teachers to manage quizzes and track student progress
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/DemoAuthContext';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  BookOpen, 
  Target, 
  Trophy,
  BarChart3,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Admin = () => {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [quizzes, setQuizzes] = useState([]);
  const [students, setStudents] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    difficulty: 'Beginner',
    duration: 300,
    points: 50,
    questions: []
  });
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correct: 0,
    explanation: ''
  });
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockStudents = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@greenvalley.edu',
      school: 'Green Valley High',
      points: 1250,
      level: 4,
      quizzesCompleted: 8,
      challengesCompleted: 15,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.c@ecoacademy.edu',
      school: 'Eco Academy',
      points: 890,
      level: 3,
      quizzesCompleted: 5,
      challengesCompleted: 12,
      lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000),
      joinDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Emma Wilson',
      email: 'emma.w@natureschool.edu',
      school: 'Nature School',
      points: 2100,
      level: 5,
      quizzesCompleted: 12,
      challengesCompleted: 25,
      lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
      joinDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
    }
  ];

  const mockQuizzes = [
    {
      id: '1',
      title: 'Climate Change Basics',
      description: 'Test your knowledge about climate change and its effects',
      difficulty: 'Beginner',
      duration: 300,
      points: 50,
      questions: 3,
      attempts: 45,
      averageScore: 78,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Renewable Energy',
      description: 'Learn about clean energy sources and their benefits',
      difficulty: 'Intermediate',
      duration: 420,
      points: 75,
      questions: 5,
      attempts: 32,
      averageScore: 82,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      title: 'Biodiversity Conservation',
      description: 'Explore the importance of protecting Earth\'s biodiversity',
      difficulty: 'Advanced',
      duration: 600,
      points: 100,
      questions: 8,
      attempts: 18,
      averageScore: 71,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  ];

  useEffect(() => {
    // Simulate loading and set mock data
    setTimeout(() => {
      setStudents(mockStudents);
      setQuizzes(mockQuizzes);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (newQuiz.questions.length === 0) {
      alert('Please add at least one question to the quiz.');
      return;
    }

    try {
      // In a real app, this would save to Firestore
      // const docRef = await addDoc(collection(db, 'quizzes'), newQuiz);
      
      const quiz = {
        ...newQuiz,
        id: Date.now().toString(),
        questions: newQuiz.questions.length,
        attempts: 0,
        averageScore: 0,
        createdAt: new Date()
      };
      
      setQuizzes(prev => [quiz, ...prev]);
      setNewQuiz({
        title: '',
        description: '',
        difficulty: 'Beginner',
        duration: 300,
        points: 50,
        questions: []
      });
      setShowQuizForm(false);
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.question.trim() || newQuestion.options.some(opt => !opt.trim())) {
      alert('Please fill in all fields for the question.');
      return;
    }

    setNewQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, { ...newQuestion }]
    }));

    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correct: 0,
      explanation: ''
    });
    setShowQuestionForm(false);
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        // In a real app, this would delete from Firestore
        // await deleteDoc(doc(db, 'quizzes', quizId));
        
        setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
      } catch (error) {
        console.error('Error deleting quiz:', error);
      }
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevel = (points) => {
    if (points < 100) return 1;
    if (points < 300) return 2;
    if (points < 600) return 3;
    if (points < 1000) return 4;
    if (points < 1500) return 5;
    return 6;
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'students', name: 'Students', icon: Users },
    { id: 'quizzes', name: 'Quizzes', icon: BookOpen },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp }
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage quizzes, track student progress, and analyze engagement
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {students.length}
                    </p>
                    <p className="text-sm text-gray-600">Total Students</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-secondary-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-secondary-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {quizzes.length}
                    </p>
                    <p className="text-sm text-gray-600">Total Quizzes</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {students.reduce((sum, s) => sum + s.quizzesCompleted, 0)}
                    </p>
                    <p className="text-sm text-gray-600">Quiz Attempts</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Trophy className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(quizzes.reduce((sum, q) => sum + q.averageScore, 0) / quizzes.length) || 0}%
                    </p>
                    <p className="text-sm text-gray-600">Avg Score</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {students.slice(0, 5).map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">
                          Completed {student.quizzesCompleted} quizzes
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {student.points} points
                      </p>
                      <p className="text-xs text-gray-600">
                        Level {getLevel(student.points)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        School
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quizzes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {student.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.school}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.points}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                            Level {getLevel(student.points)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.quizzesCompleted}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.lastActive.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900 mr-3">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Edit className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === 'quizzes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Quiz Management</h2>
              <button
                onClick={() => setShowQuizForm(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Quiz</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {quiz.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {quiz.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                          {quiz.difficulty}
                        </span>
                        <span className="text-xs text-gray-500">
                          {Math.floor(quiz.duration / 60)} min
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-500 hover:text-gray-700">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Questions:</span>
                      <span className="font-semibold">{quiz.questions}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Points:</span>
                      <span className="font-semibold">{quiz.points}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Attempts:</span>
                      <span className="font-semibold">{quiz.attempts}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Avg Score:</span>
                      <span className="font-semibold">{quiz.averageScore}%</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                      View Details
                    </button>
                    <button className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Student Engagement
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Students (7 days)</span>
                    <span className="font-semibold">{students.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Quiz Attempts</span>
                    <span className="font-semibold">
                      {students.reduce((sum, s) => sum + s.quizzesCompleted, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Session Time</span>
                    <span className="font-semibold">24 minutes</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quiz Performance
                </h3>
                <div className="space-y-4">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between">
                      <span className="text-gray-600">{quiz.title}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${quiz.averageScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold w-12 text-right">
                          {quiz.averageScore}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Creation Modal */}
        {showQuizForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Create New Quiz
                  </h3>
                  <button
                    onClick={() => setShowQuizForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleCreateQuiz} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quiz Title
                    </label>
                    <input
                      type="text"
                      value={newQuiz.title}
                      onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter quiz title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newQuiz.description}
                      onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={3}
                      placeholder="Enter quiz description"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulty
                      </label>
                      <select
                        value={newQuiz.difficulty}
                        onChange={(e) => setNewQuiz({ ...newQuiz, difficulty: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={newQuiz.duration / 60}
                        onChange={(e) => setNewQuiz({ ...newQuiz, duration: e.target.value * 60 })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Points
                      </label>
                      <input
                        type="number"
                        value={newQuiz.points}
                        onChange={(e) => setNewQuiz({ ...newQuiz, points: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">Questions</h4>
                      <button
                        type="button"
                        onClick={() => setShowQuestionForm(true)}
                        className="bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Question</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {newQuiz.questions.map((question, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-900 mb-2">
                            Q{index + 1}: {question.question}
                          </p>
                          <div className="space-y-1">
                            {question.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className={`text-sm ${
                                  optIndex === question.correct
                                    ? 'text-green-600 font-medium'
                                    : 'text-gray-600'
                                }`}
                              >
                                {String.fromCharCode(65 + optIndex)}. {option}
                                {optIndex === question.correct && ' ✓'}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowQuizForm(false)}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Create Quiz
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Question Creation Modal */}
        {showQuestionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Add Question
                  </h3>
                  <button
                    onClick={() => setShowQuestionForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleAddQuestion} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question
                    </label>
                    <textarea
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={3}
                      placeholder="Enter your question"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer Options
                    </label>
                    <div className="space-y-3">
                      {newQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="correct"
                            checked={newQuestion.correct === index}
                            onChange={() => setNewQuestion({ ...newQuestion, correct: index })}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...newQuestion.options];
                              newOptions[index] = e.target.value;
                              setNewQuestion({ ...newQuestion, options: newOptions });
                            }}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Explanation
                    </label>
                    <textarea
                      value={newQuestion.explanation}
                      onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={2}
                      placeholder="Explain why this answer is correct"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowQuestionForm(false)}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Add Question
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
