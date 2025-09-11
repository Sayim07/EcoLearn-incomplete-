// Challenge management routes
const express = require('express');
const router = express.Router();

// Get all challenges
router.get('/', async (req, res) => {
  try {
    const { category, type, limit = 20 } = req.query;

    // Mock challenges data
    const challenges = [
      {
        id: '1',
        title: 'Turn Off Lights',
        description: 'Turn off all unnecessary lights in your home for 2 hours',
        category: 'energy',
        type: 'daily',
        points: 10,
        difficulty: 'Easy',
        duration: '2 hours',
        icon: 'lightbulb',
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
        difficulty: 'Easy',
        duration: '30 minutes',
        icon: 'recycle',
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
        difficulty: 'Hard',
        duration: '2 hours',
        icon: 'tree',
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
        difficulty: 'Medium',
        duration: '1 hour',
        icon: 'bike',
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
        difficulty: 'Easy',
        duration: '5 minutes',
        icon: 'droplets',
        completed: false,
        streak: 0
      }
    ];

    // Filter by category if specified
    let filteredChallenges = challenges;
    if (category) {
      filteredChallenges = filteredChallenges.filter(challenge => 
        challenge.category === category
      );
    }

    // Filter by type if specified
    if (type) {
      filteredChallenges = filteredChallenges.filter(challenge => 
        challenge.type === type
      );
    }

    // Apply limit
    const limitedChallenges = filteredChallenges.slice(0, parseInt(limit));

    res.json({
      success: true,
      challenges: limitedChallenges,
      total: filteredChallenges.length
    });
  } catch (error) {
    console.error('Challenges fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch challenges',
      message: error.message 
    });
  }
});

// Get specific challenge
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Mock challenge data
    const challenge = {
      id,
      title: 'Turn Off Lights',
      description: 'Turn off all unnecessary lights in your home for 2 hours',
      category: 'energy',
      type: 'daily',
      points: 10,
      difficulty: 'Easy',
      duration: '2 hours',
      icon: 'lightbulb',
      instructions: [
        'Identify all unnecessary lights in your home',
        'Turn them off for exactly 2 hours',
        'Take a photo as proof (optional)',
        'Report completion in the app'
      ],
      tips: [
        'Use natural light during the day',
        'Consider using LED bulbs for better efficiency',
        'Make it a family activity'
      ],
      environmentalImpact: {
        co2Saved: 0.5, // kg
        energySaved: 2.5, // kWh
        description: 'Turning off lights for 2 hours can save significant energy and reduce CO2 emissions.'
      }
    };

    res.json({
      success: true,
      challenge
    });
  } catch (error) {
    console.error('Challenge fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch challenge',
      message: error.message 
    });
  }
});

// Complete challenge
router.post('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, proof, notes } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        error: 'User ID is required' 
      });
    }

    // Mock challenge completion
    const challenge = {
      id,
      points: 10,
      type: 'daily'
    };

    // In a real app, this would save to Firestore
    const completion = {
      id: `completion_${Date.now()}`,
      challengeId: id,
      userId,
      points: challenge.points,
      proof,
      notes,
      completedAt: new Date(),
      verified: false // Would be verified by admin in real app
    };

    res.json({
      success: true,
      completion,
      message: 'Challenge completed successfully'
    });
  } catch (error) {
    console.error('Challenge completion error:', error);
    res.status(500).json({ 
      error: 'Failed to complete challenge',
      message: error.message 
    });
  }
});

// Get user's challenge completions
router.get('/user/:userId/completions', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, type } = req.query;

    // Mock completions data
    const completions = [
      {
        id: 'completion1',
        challengeId: '1',
        challengeTitle: 'Turn Off Lights',
        points: 10,
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        verified: true
      },
      {
        id: 'completion2',
        challengeId: '2',
        challengeTitle: 'Recycle Paper',
        points: 15,
        completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        verified: true
      },
      {
        id: 'completion3',
        challengeId: '4',
        challengeTitle: 'Bike to School',
        points: 25,
        completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        verified: false
      }
    ];

    // Filter by type if specified
    let filteredCompletions = completions;
    if (type) {
      // In a real app, this would filter by challenge type
      filteredCompletions = completions;
    }

    res.json({
      success: true,
      completions: filteredCompletions.slice(0, parseInt(limit))
    });
  } catch (error) {
    console.error('User completions error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user completions',
      message: error.message 
    });
  }
});

// Get challenge categories
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      {
        id: 'energy',
        name: 'Energy',
        description: 'Challenges related to energy conservation',
        icon: 'lightbulb',
        color: 'yellow'
      },
      {
        id: 'waste',
        name: 'Waste',
        description: 'Challenges related to waste reduction and recycling',
        icon: 'recycle',
        color: 'green'
      },
      {
        id: 'nature',
        name: 'Nature',
        description: 'Challenges related to nature conservation',
        icon: 'tree',
        color: 'emerald'
      },
      {
        id: 'transport',
        name: 'Transport',
        description: 'Challenges related to sustainable transportation',
        icon: 'bike',
        color: 'blue'
      },
      {
        id: 'water',
        name: 'Water',
        description: 'Challenges related to water conservation',
        icon: 'droplets',
        color: 'cyan'
      }
    ];

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch categories',
      message: error.message 
    });
  }
});

// Get challenge statistics
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Mock statistics
    const stats = {
      totalCompleted: 15,
      totalPoints: 250,
      currentStreak: 5,
      longestStreak: 12,
      categoryBreakdown: {
        energy: 5,
        waste: 4,
        nature: 2,
        transport: 3,
        water: 1
      },
      weeklyProgress: {
        completed: 3,
        points: 45
      },
      monthlyProgress: {
        completed: 12,
        points: 180
      }
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Challenge stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch challenge statistics',
      message: error.message 
    });
  }
});

// Create new challenge (Admin only)
router.post('/', async (req, res) => {
  try {
    const { title, description, category, type, points, difficulty, duration, instructions } = req.body;

    if (!title || !description || !category || !type || !points) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, description, category, type, points' 
      });
    }

    // In a real app, this would save to Firestore
    const challenge = {
      id: `challenge_${Date.now()}`,
      title,
      description,
      category,
      type,
      points,
      difficulty: difficulty || 'Easy',
      duration: duration || '30 minutes',
      instructions: instructions || [],
      createdAt: new Date(),
      createdBy: req.user?.uid || 'admin'
    };

    res.status(201).json({
      success: true,
      challenge,
      message: 'Challenge created successfully'
    });
  } catch (error) {
    console.error('Challenge creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create challenge',
      message: error.message 
    });
  }
});

module.exports = router;
