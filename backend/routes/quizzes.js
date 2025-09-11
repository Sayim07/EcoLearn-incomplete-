// Quiz management routes
const express = require('express');
const router = express.Router();

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const { difficulty, limit = 20 } = req.query;

    // Mock quizzes data
    const quizzes = [
      {
        id: '1',
        title: 'Climate Change Basics',
        description: 'Test your knowledge about climate change and its effects',
        difficulty: 'Beginner',
        duration: 300,
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
          }
        ],
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
          }
        ],
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
        ],
        attempts: 18,
        averageScore: 71,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];

    // Filter by difficulty if specified
    const filteredQuizzes = difficulty 
      ? quizzes.filter(quiz => quiz.difficulty.toLowerCase() === difficulty.toLowerCase())
      : quizzes;

    // Apply limit
    const limitedQuizzes = filteredQuizzes.slice(0, parseInt(limit));

    res.json({
      success: true,
      quizzes: limitedQuizzes,
      total: filteredQuizzes.length
    });
  } catch (error) {
    console.error('Quizzes fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch quizzes',
      message: error.message 
    });
  }
});

// Get specific quiz
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Mock quiz data
    const quiz = {
      id,
      title: 'Climate Change Basics',
      description: 'Test your knowledge about climate change and its effects',
      difficulty: 'Beginner',
      duration: 300,
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
        }
      ],
      attempts: 45,
      averageScore: 78,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    };

    res.json({
      success: true,
      quiz
    });
  } catch (error) {
    console.error('Quiz fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch quiz',
      message: error.message 
    });
  }
});

// Submit quiz attempt
router.post('/:id/attempt', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, answers, timeSpent } = req.body;

    if (!userId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, answers' 
      });
    }

    // Mock quiz scoring
    const quiz = {
      id,
      questions: [
        {
          correct: 1,
          points: 25
        },
        {
          correct: 2,
          points: 25
        }
      ]
    };

    let score = 0;
    let correctAnswers = 0;
    const results = [];

    answers.forEach((answer, index) => {
      const question = quiz.questions[index];
      const isCorrect = answer === question.correct;
      
      if (isCorrect) {
        score += question.points;
        correctAnswers++;
      }
      
      results.push({
        questionIndex: index,
        selectedAnswer: answer,
        correctAnswer: question.correct,
        isCorrect,
        points: isCorrect ? question.points : 0
      });
    });

    const percentage = Math.round((correctAnswers / quiz.questions.length) * 100);
    const totalPoints = Math.round((percentage / 100) * 50); // Assuming 50 total points

    // In a real app, this would save the attempt to Firestore
    const attempt = {
      id: `attempt_${Date.now()}`,
      quizId: id,
      userId,
      answers,
      results,
      score: percentage,
      points: totalPoints,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      timeSpent,
      completedAt: new Date()
    };

    res.json({
      success: true,
      attempt,
      message: 'Quiz submitted successfully'
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ 
      error: 'Failed to submit quiz',
      message: error.message 
    });
  }
});

// Get user's quiz attempts
router.get('/user/:userId/attempts', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;

    // Mock attempts data
    const attempts = [
      {
        id: 'attempt1',
        quizId: '1',
        quizTitle: 'Climate Change Basics',
        score: 85,
        points: 42,
        correctAnswers: 2,
        totalQuestions: 2,
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'attempt2',
        quizId: '2',
        quizTitle: 'Renewable Energy',
        score: 90,
        points: 68,
        correctAnswers: 1,
        totalQuestions: 1,
        completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
      }
    ];

    res.json({
      success: true,
      attempts: attempts.slice(0, parseInt(limit))
    });
  } catch (error) {
    console.error('User attempts error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user attempts',
      message: error.message 
    });
  }
});

// Create new quiz (Admin only)
router.post('/', async (req, res) => {
  try {
    const { title, description, difficulty, duration, points, questions } = req.body;

    if (!title || !description || !questions || questions.length === 0) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, description, questions' 
      });
    }

    // In a real app, this would save to Firestore
    const quiz = {
      id: `quiz_${Date.now()}`,
      title,
      description,
      difficulty: difficulty || 'Beginner',
      duration: duration || 300,
      points: points || 50,
      questions,
      attempts: 0,
      averageScore: 0,
      createdAt: new Date(),
      createdBy: req.user?.uid || 'admin'
    };

    res.status(201).json({
      success: true,
      quiz,
      message: 'Quiz created successfully'
    });
  } catch (error) {
    console.error('Quiz creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create quiz',
      message: error.message 
    });
  }
});

// Update quiz (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // In a real app, this would update Firestore document
    const updatedQuiz = {
      id,
      ...updates,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      quiz: updatedQuiz,
      message: 'Quiz updated successfully'
    });
  } catch (error) {
    console.error('Quiz update error:', error);
    res.status(500).json({ 
      error: 'Failed to update quiz',
      message: error.message 
    });
  }
});

// Delete quiz (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // In a real app, this would delete from Firestore
    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    console.error('Quiz deletion error:', error);
    res.status(500).json({ 
      error: 'Failed to delete quiz',
      message: error.message 
    });
  }
});

module.exports = router;
