// User management routes
const express = require('express');
const router = express.Router();

// Get user leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10, school = null } = req.query;

    // Mock leaderboard data
    const leaderboard = [
      {
        uid: 'user1',
        name: 'Sarah Johnson',
        school: 'Green Valley High',
        points: 1250,
        level: 4,
        avatar: 'SJ'
      },
      {
        uid: 'user2',
        name: 'Mike Chen',
        school: 'Eco Academy',
        points: 890,
        level: 3,
        avatar: 'MC'
      },
      {
        uid: 'user3',
        name: 'Emma Wilson',
        school: 'Nature School',
        points: 2100,
        level: 5,
        avatar: 'EW'
      },
      {
        uid: 'user4',
        name: 'Alex Rodriguez',
        school: 'Green Tech Institute',
        points: 1560,
        level: 4,
        avatar: 'AR'
      },
      {
        uid: 'user5',
        name: 'Lisa Park',
        school: 'Green Valley High',
        points: 780,
        level: 3,
        avatar: 'LP'
      }
    ];

    // Filter by school if specified
    const filteredLeaderboard = school 
      ? leaderboard.filter(user => user.school === school)
      : leaderboard;

    // Apply limit
    const limitedLeaderboard = filteredLeaderboard.slice(0, parseInt(limit));

    res.json({
      success: true,
      leaderboard: limitedLeaderboard,
      total: filteredLeaderboard.length
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch leaderboard',
      message: error.message 
    });
  }
});

// Get user statistics
router.get('/stats/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    // Mock user statistics
    const stats = {
      uid,
      totalPoints: 1250,
      currentLevel: 4,
      quizzesCompleted: 8,
      challengesCompleted: 15,
      badges: [
        { id: 'first_quiz', name: 'First Quiz', earnedAt: new Date() },
        { id: 'eco_warrior', name: 'Eco Warrior', earnedAt: new Date() },
        { id: 'quiz_master', name: 'Quiz Master', earnedAt: new Date() }
      ],
      weeklyProgress: {
        points: 150,
        quizzes: 2,
        challenges: 3
      },
      monthlyProgress: {
        points: 450,
        quizzes: 6,
        challenges: 8
      },
      achievements: [
        {
          id: 'streak_7',
          name: '7-Day Streak',
          description: 'Completed challenges for 7 consecutive days',
          earnedAt: new Date()
        },
        {
          id: 'quiz_perfect',
          name: 'Perfect Score',
          description: 'Scored 100% on a quiz',
          earnedAt: new Date()
        }
      ]
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user statistics',
      message: error.message 
    });
  }
});

// Update user points
router.post('/points/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { points, reason, type } = req.body;

    if (!points || points <= 0) {
      return res.status(400).json({ 
        error: 'Invalid points value' 
      });
    }

    // In a real app, this would update Firestore document
    const updatedUser = {
      uid,
      pointsAdded: points,
      reason,
      type,
      timestamp: new Date()
    };

    res.json({
      success: true,
      user: updatedUser,
      message: 'Points updated successfully'
    });
  } catch (error) {
    console.error('Points update error:', error);
    res.status(500).json({ 
      error: 'Failed to update points',
      message: error.message 
    });
  }
});

// Get user badges
router.get('/badges/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    // Mock badges data
    const badges = [
      {
        id: 'first_quiz',
        name: 'First Quiz',
        description: 'Complete your first quiz',
        icon: 'book',
        earned: true,
        earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'eco_warrior',
        name: 'Eco Warrior',
        description: 'Complete 10 challenges',
        icon: 'leaf',
        earned: true,
        earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'quiz_master',
        name: 'Quiz Master',
        description: 'Score 90% or higher on 5 quizzes',
        icon: 'trophy',
        earned: true,
        earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'streak_king',
        name: 'Streak King',
        description: 'Complete challenges for 30 consecutive days',
        icon: 'fire',
        earned: false,
        progress: 15,
        required: 30
      },
      {
        id: 'point_master',
        name: 'Point Master',
        description: 'Earn 1000 points',
        icon: 'star',
        earned: false,
        progress: 750,
        required: 1000
      }
    ];

    res.json({
      success: true,
      badges
    });
  } catch (error) {
    console.error('Badges fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch badges',
      message: error.message 
    });
  }
});

// Get user activity feed
router.get('/activity/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { limit = 20 } = req.query;

    // Mock activity feed
    const activities = [
      {
        id: '1',
        type: 'quiz_completed',
        title: 'Completed Climate Change Quiz',
        description: 'Scored 85% and earned 42 points',
        points: 42,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        icon: 'book'
      },
      {
        id: '2',
        type: 'challenge_completed',
        title: 'Completed Daily Challenge',
        description: 'Turned off lights for 2 hours',
        points: 10,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        icon: 'target'
      },
      {
        id: '3',
        type: 'badge_earned',
        title: 'Earned Eco Warrior Badge',
        description: 'Completed 10 challenges',
        points: 0,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        icon: 'award'
      },
      {
        id: '4',
        type: 'level_up',
        title: 'Level Up!',
        description: 'Reached level 4',
        points: 0,
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        icon: 'trending-up'
      }
    ];

    res.json({
      success: true,
      activities: activities.slice(0, parseInt(limit))
    });
  } catch (error) {
    console.error('Activity feed error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch activity feed',
      message: error.message 
    });
  }
});

module.exports = router;
