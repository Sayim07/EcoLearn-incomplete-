// Authentication routes
const express = require('express');
const router = express.Router();

// Mock authentication endpoints
// In a real app, these would integrate with Firebase Admin SDK

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, school } = req.body;

    // Validate input
    if (!email || !password || !name || !school) {
      return res.status(400).json({ 
        error: 'Missing required fields: email, password, name, school' 
      });
    }

    // In a real app, this would create a user in Firebase Auth
    // and a user document in Firestore
    const user = {
      uid: `user_${Date.now()}`,
      email,
      name,
      school,
      points: 0,
      level: 1,
      badges: [],
      createdAt: new Date(),
      lastLogin: new Date()
    };

    res.status(201).json({
      success: true,
      user,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed',
      message: error.message 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // In a real app, this would verify credentials with Firebase Auth
    const user = {
      uid: `user_${Date.now()}`,
      email,
      name: 'Test User',
      school: 'Test School',
      points: 150,
      level: 2,
      badges: ['first_quiz'],
      lastLogin: new Date()
    };

    res.json({
      success: true,
      user,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      message: error.message 
    });
  }
});

// Get user profile
router.get('/profile/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    // In a real app, this would fetch from Firestore
    const user = {
      uid,
      email: 'user@example.com',
      name: 'Test User',
      school: 'Test School',
      points: 150,
      level: 2,
      badges: ['first_quiz', 'eco_warrior'],
      quizzesCompleted: 5,
      challengesCompleted: 8,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastLogin: new Date()
    };

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch profile',
      message: error.message 
    });
  }
});

// Update user profile
router.put('/profile/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const updates = req.body;

    // In a real app, this would update Firestore document
    const updatedUser = {
      uid,
      ...updates,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      error: 'Failed to update profile',
      message: error.message 
    });
  }
});

// Logout (client-side handled, but we can track it)
router.post('/logout', async (req, res) => {
  try {
    const { uid } = req.body;

    // In a real app, this might update last logout time
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      error: 'Logout failed',
      message: error.message 
    });
  }
});

module.exports = router;
