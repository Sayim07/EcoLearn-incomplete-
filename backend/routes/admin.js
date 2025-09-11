// Admin management routes
const express = require('express');
const router = express.Router();

// Get admin dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const stats = {
      users: {
        total: 1250,
        active: 890,
        newThisWeek: 45,
        growth: 12.5
      },
      quizzes: {
        total: 25,
        attempts: 3450,
        averageScore: 78.5,
        completionRate: 85.2
      },
      challenges: {
        total: 50,
        completions: 5670,
        completionRate: 72.3,
        popularCategory: 'energy'
      },
      community: {
        posts: 2340,
        likes: 15600,
        comments: 3890,
        engagement: 68.5
      },
      revenue: {
        monthly: 12500,
        growth: 8.3,
        subscriptions: 890
      }
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch admin dashboard data',
      message: error.message 
    });
  }
});

// Get all users with pagination
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, sortBy = 'points', order = 'desc' } = req.query;

    // Mock users data
    const users = [
      {
        id: 'user1',
        name: 'Sarah Johnson',
        email: 'sarah.j@greenvalley.edu',
        school: 'Green Valley High',
        points: 1250,
        level: 4,
        quizzesCompleted: 8,
        challengesCompleted: 15,
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
        joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        status: 'active'
      },
      {
        id: 'user2',
        name: 'Mike Chen',
        email: 'mike.c@ecoacademy.edu',
        school: 'Eco Academy',
        points: 890,
        level: 3,
        quizzesCompleted: 5,
        challengesCompleted: 12,
        lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000),
        joinDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        status: 'active'
      },
      {
        id: 'user3',
        name: 'Emma Wilson',
        email: 'emma.w@natureschool.edu',
        school: 'Nature School',
        points: 2100,
        level: 5,
        quizzesCompleted: 12,
        challengesCompleted: 25,
        lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
        joinDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        status: 'active'
      }
    ];

    // Apply search filter
    let filteredUsers = users;
    if (search) {
      filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.school.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply sorting
    filteredUsers.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (order === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    res.json({
      success: true,
      users: paginatedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredUsers.length,
        pages: Math.ceil(filteredUsers.length / limit)
      }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch users',
      message: error.message 
    });
  }
});

// Get user details
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Mock user details
    const user = {
      id,
      name: 'Sarah Johnson',
      email: 'sarah.j@greenvalley.edu',
      school: 'Green Valley High',
      points: 1250,
      level: 4,
      badges: ['first_quiz', 'eco_warrior', 'quiz_master'],
      quizzesCompleted: 8,
      challengesCompleted: 15,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      activity: [
        {
          type: 'quiz_completed',
          description: 'Completed Climate Change Quiz',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          type: 'challenge_completed',
          description: 'Completed Daily Challenge',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
        }
      ]
    };

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('User details error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user details',
      message: error.message 
    });
  }
});

// Update user status
router.put('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended', 'banned'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be active, suspended, or banned' 
      });
    }

    // In a real app, this would update Firestore
    const result = {
      userId: id,
      status,
      updatedAt: new Date(),
      updatedBy: req.user?.uid || 'admin'
    };

    res.json({
      success: true,
      result,
      message: 'User status updated successfully'
    });
  } catch (error) {
    console.error('User status update error:', error);
    res.status(500).json({ 
      error: 'Failed to update user status',
      message: error.message 
    });
  }
});

// Get quiz analytics
router.get('/analytics/quizzes', async (req, res) => {
  try {
    const analytics = {
      totalQuizzes: 25,
      totalAttempts: 3450,
      averageScore: 78.5,
      completionRate: 85.2,
      topPerformingQuizzes: [
        {
          id: 'quiz1',
          title: 'Climate Change Basics',
          attempts: 450,
          averageScore: 82.3,
          completionRate: 88.5
        },
        {
          id: 'quiz2',
          title: 'Renewable Energy',
          attempts: 380,
          averageScore: 79.1,
          completionRate: 86.2
        }
      ],
      difficultyBreakdown: {
        beginner: { count: 10, averageScore: 85.2 },
        intermediate: { count: 12, averageScore: 76.8 },
        advanced: { count: 3, averageScore: 68.4 }
      },
      weeklyTrends: [
        { week: 'Week 1', attempts: 120, averageScore: 75.2 },
        { week: 'Week 2', attempts: 145, averageScore: 78.1 },
        { week: 'Week 3', attempts: 160, averageScore: 79.5 },
        { week: 'Week 4', attempts: 155, averageScore: 81.2 }
      ]
    };

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error('Quiz analytics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch quiz analytics',
      message: error.message 
    });
  }
});

// Get challenge analytics
router.get('/analytics/challenges', async (req, res) => {
  try {
    const analytics = {
      totalChallenges: 50,
      totalCompletions: 5670,
      completionRate: 72.3,
      popularCategories: [
        { category: 'energy', completions: 1200, percentage: 21.2 },
        { category: 'waste', completions: 980, percentage: 17.3 },
        { category: 'transport', completions: 850, percentage: 15.0 },
        { category: 'nature', completions: 720, percentage: 12.7 },
        { category: 'water', completions: 650, percentage: 11.5 }
      ],
      dailyCompletions: [
        { date: '2024-01-01', completions: 45 },
        { date: '2024-01-02', completions: 52 },
        { date: '2024-01-03', completions: 38 },
        { date: '2024-01-04', completions: 61 },
        { date: '2024-01-05', completions: 48 }
      ],
      topChallenges: [
        {
          id: 'challenge1',
          title: 'Turn Off Lights',
          completions: 450,
          completionRate: 85.2
        },
        {
          id: 'challenge2',
          title: 'Recycle Paper',
          completions: 380,
          completionRate: 78.5
        }
      ]
    };

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error('Challenge analytics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch challenge analytics',
      message: error.message 
    });
  }
});

// Get system health
router.get('/system/health', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date(),
      services: {
        database: 'connected',
        authentication: 'active',
        storage: 'available',
        email: 'operational'
      },
      metrics: {
        responseTime: '120ms',
        errorRate: '0.1%',
        throughput: '150 req/min'
      }
    };

    res.json({
      success: true,
      health
    });
  } catch (error) {
    console.error('System health error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch system health',
      message: error.message 
    });
  }
});

// Export data
router.get('/export/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { format = 'csv' } = req.query;

    // In a real app, this would generate actual export files
    const exportData = {
      type,
      format,
      status: 'processing',
      downloadUrl: `/api/admin/export/${type}/download`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    res.json({
      success: true,
      export: exportData,
      message: 'Export initiated successfully'
    });
  } catch (error) {
    console.error('Data export error:', error);
    res.status(500).json({ 
      error: 'Failed to initiate data export',
      message: error.message 
    });
  }
});

module.exports = router;
