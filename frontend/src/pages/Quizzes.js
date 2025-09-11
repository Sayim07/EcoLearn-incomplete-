// Quizzes page with interactive quiz functionality
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/DemoAuthContext';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  Star,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

const Quizzes = () => {
  const { userData, setUserData } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock quiz data (in real app, this would come from Firestore)
  const mockQuizzes = [
    {
      id: '1',
      title: 'Climate Change Basics',
      description: 'Test your knowledge about climate change and its effects',
      difficulty: 'Beginner',
      duration: 300, // 5 minutes
      points: 50,
      questions: [
        {
          question: 'What is the main cause of global warming?',
          options: [
            'Increased solar radiation',
            'Greenhouse gas emissions',
            'Volcanic eruptions',
            'Ocean currents'
          ],
          correct: 1,
          explanation: 'Greenhouse gas emissions, particularly CO2, trap heat in the atmosphere causing global warming.'
        },
        {
          question: 'Which gas is most responsible for the greenhouse effect?',
          options: [
            'Oxygen',
            'Nitrogen',
            'Carbon Dioxide',
            'Argon'
          ],
          correct: 2,
          explanation: 'Carbon dioxide is the most significant greenhouse gas contributing to climate change.'
        },
        {
          question: 'What percentage of Earth\'s atmosphere is made up of greenhouse gases?',
          options: [
            'Less than 1%',
            'About 5%',
            'About 20%',
            'More than 50%'
          ],
          correct: 0,
          explanation: 'Greenhouse gases make up less than 1% of Earth\'s atmosphere, but they have a significant impact on temperature.'
        }
      ]
    },
    {
      id: '2',
      title: 'Renewable Energy',
      description: 'Learn about clean energy sources and their benefits',
      difficulty: 'Intermediate',
      duration: 420, // 7 minutes
      points: 75,
      questions: [
        {
          question: 'Which renewable energy source is most widely used globally?',
          options: [
            'Solar power',
            'Wind power',
            'Hydroelectric power',
            'Geothermal power'
          ],
          correct: 2,
          explanation: 'Hydroelectric power is the most widely used renewable energy source globally.'
        },
        {
          question: 'What is the main advantage of solar panels?',
          options: [
            'They work at night',
            'They produce clean electricity',
            'They are always efficient',
            'They don\'t require maintenance'
          ],
          correct: 1,
          explanation: 'Solar panels produce clean electricity without emitting greenhouse gases.'
        }
      ]
    },
    {
      id: '3',
      title: 'Biodiversity Conservation',
      description: 'Explore the importance of protecting Earth\'s biodiversity',
      difficulty: 'Advanced',
      duration: 600, // 10 minutes
      points: 100,
      questions: [
        {
          question: 'What is the primary cause of species extinction today?',
          options: [
            'Natural disasters',
            'Climate change',
            'Habitat destruction',
            'Predation'
          ],
          correct: 2,
          explanation: 'Habitat destruction is the leading cause of species extinction in modern times.'
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading and set mock data
    setTimeout(() => {
      setQuizzes(mockQuizzes);
      setLoading(false);
    }, 1000);
  }, []);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && selectedQuiz && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedQuiz && !quizCompleted) {
      handleQuizComplete();
    }
  }, [timeLeft, selectedQuiz, quizCompleted]);

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTimeLeft(quiz.duration);
    setQuizCompleted(false);
  };

  const selectAnswer = (answerIndex) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null) return;
    
    const question = selectedQuiz.questions[currentQuestion];
    const isCorrect = selectedAnswer === question.correct;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
    setQuizCompleted(true);
    const finalScore = score + (selectedAnswer === selectedQuiz.questions[currentQuestion].correct ? 1 : 0);
    const percentage = (finalScore / selectedQuiz.questions.length) * 100;
    const pointsEarned = Math.floor((percentage / 100) * selectedQuiz.points);
    
    // Update user points in Firestore
    try {
      if (userData) {
        await updateDoc(doc(db, 'users', userData.uid), {
          points: increment(pointsEarned),
          quizzesCompleted: increment(1)
        });
        
        // Update local user data
        setUserData({
          ...userData,
          points: userData.points + pointsEarned,
          quizzesCompleted: (userData.quizzesCompleted || 0) + 1
        });
      }
    } catch (error) {
      console.error('Error updating user points:', error);
    }
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTimeLeft(0);
    setQuizCompleted(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (selectedQuiz && !quizCompleted) {
    const question = selectedQuiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedQuiz.questions.length) * 100;

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quiz Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedQuiz.title}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="h-5 w-5" />
                  <span className="font-mono text-lg">
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <button
                  onClick={resetQuiz}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Question {currentQuestion + 1} of {selectedQuiz.questions.length}
            </p>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {question.question}
            </h2>
            
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswer === index
                      ? showResult
                        ? index === question.correct
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? showResult
                          ? index === question.correct
                            ? 'border-green-500 bg-green-500'
                            : 'border-red-500 bg-red-500'
                          : 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer === index && showResult && (
                        index === question.correct ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <XCircle className="h-4 w-4 text-white" />
                        )
                      )}
                    </div>
                    <span className="text-gray-900">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {showResult && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Explanation:</strong> {question.explanation}
                </p>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              {!showResult ? (
                <button
                  onClick={checkAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <span>
                    {currentQuestion < selectedQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = (score / selectedQuiz.questions.length) * 100;
    const pointsEarned = Math.floor((percentage / 100) * selectedQuiz.points);

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mb-6">
              <Trophy className="h-16 w-16 text-secondary-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Quiz Completed!
              </h1>
              <p className="text-gray-600">
                Great job on completing "{selectedQuiz.title}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-primary-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-primary-600">
                  {score}/{selectedQuiz.questions.length}
                </p>
                <p className="text-sm text-primary-800">Correct Answers</p>
              </div>
              <div className="bg-secondary-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-secondary-600">
                  {Math.round(percentage)}%
                </p>
                <p className="text-sm text-secondary-800">Score</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-green-600">
                  +{pointsEarned}
                </p>
                <p className="text-sm text-green-800">Points Earned</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={resetQuiz}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Take Another Quiz
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Environmental Quizzes
          </h1>
          <p className="text-gray-600">
            Test your knowledge and earn eco-points with our interactive quizzes!
          </p>
        </div>

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {quiz.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {quiz.description}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                  {quiz.difficulty}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{Math.floor(quiz.duration / 60)} minutes</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <BookOpen className="h-4 w-4" />
                  <span>{quiz.questions.length} questions</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Trophy className="h-4 w-4" />
                  <span>Up to {quiz.points} points</span>
                </div>
              </div>

              <button
                onClick={() => startQuiz(quiz)}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Start Quiz</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Quiz Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {userData?.quizzesCompleted || 0}
              </div>
              <div className="text-gray-600">Quizzes Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-600 mb-2">
                {userData?.points || 0}
              </div>
              <div className="text-gray-600">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {quizzes.length}
              </div>
              <div className="text-gray-600">Available Quizzes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;
