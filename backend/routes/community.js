// Community and social features routes
const express = require('express');
const router = express.Router();

// Get community posts
router.get('/posts', async (req, res) => {
  try {
    const { limit = 20, type = 'all' } = req.query;

    // Mock community posts
    const posts = [
      {
        id: '1',
        userId: 'user1',
        userName: 'Sarah Johnson',
        userSchool: 'Green Valley High',
        userPoints: 1250,
        userAvatar: 'SJ',
        content: 'Just completed the "Plant a Tree" challenge! 🌳 Feeling great about contributing to our planet. #EcoWarrior #TreePlanting',
        type: 'achievement',
        achievement: {
          title: 'Tree Planting Challenge',
          points: 100,
          icon: 'TreePine'
        },
        likes: 12,
        comments: 3,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        liked: false
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Mike Chen',
        userSchool: 'Eco Academy',
        userPoints: 890,
        userAvatar: 'MC',
        content: 'Amazing quiz on renewable energy! Learned so much about solar power. The explanations were really helpful.',
        type: 'quiz',
        achievement: {
          title: 'Renewable Energy Quiz',
          points: 75,
          score: '95%'
        },
        likes: 8,
        comments: 2,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        liked: true
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Emma Wilson',
        userSchool: 'Nature School',
        userPoints: 2100,
        userAvatar: 'EW',
        content: 'Week 3 of my zero-waste journey! Here are some tips that have helped me reduce my plastic consumption by 80%.',
        type: 'tip',
        achievement: null,
        likes: 25,
        comments: 7,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        liked: false
      }
    ];

    // Filter by type if specified
    const filteredPosts = type === 'all' 
      ? posts 
      : posts.filter(post => post.type === type);

    res.json({
      success: true,
      posts: filteredPosts.slice(0, parseInt(limit)),
      total: filteredPosts.length
    });
  } catch (error) {
    console.error('Community posts error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch community posts',
      message: error.message 
    });
  }
});

// Create new post
router.post('/posts', async (req, res) => {
  try {
    const { userId, content, type, achievement } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, content' 
      });
    }

    // In a real app, this would save to Firestore
    const post = {
      id: `post_${Date.now()}`,
      userId,
      content,
      type: type || 'tip',
      achievement: achievement || null,
      likes: 0,
      comments: 0,
      timestamp: new Date(),
      liked: false
    };

    res.status(201).json({
      success: true,
      post,
      message: 'Post created successfully'
    });
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create post',
      message: error.message 
    });
  }
});

// Like/unlike post
router.post('/posts/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, action = 'toggle' } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        error: 'User ID is required' 
      });
    }

    // In a real app, this would update Firestore
    const result = {
      postId: id,
      userId,
      action,
      timestamp: new Date()
    };

    res.json({
      success: true,
      result,
      message: 'Post like updated successfully'
    });
  } catch (error) {
    console.error('Post like error:', error);
    res.status(500).json({ 
      error: 'Failed to update post like',
      message: error.message 
    });
  }
});

// Add comment to post
router.post('/posts/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, content } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, content' 
      });
    }

    // In a real app, this would save to Firestore
    const comment = {
      id: `comment_${Date.now()}`,
      postId: id,
      userId,
      content,
      timestamp: new Date()
    };

    res.status(201).json({
      success: true,
      comment,
      message: 'Comment added successfully'
    });
  } catch (error) {
    console.error('Comment creation error:', error);
    res.status(500).json({ 
      error: 'Failed to add comment',
      message: error.message 
    });
  }
});

// Get post comments
router.get('/posts/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 20 } = req.query;

    // Mock comments data
    const comments = [
      {
        id: 'comment1',
        postId: id,
        userId: 'user2',
        userName: 'Mike Chen',
        userAvatar: 'MC',
        content: 'Great job! I\'m inspired to try this challenge too.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      {
        id: 'comment2',
        postId: id,
        userId: 'user3',
        userName: 'Emma Wilson',
        userAvatar: 'EW',
        content: 'Amazing work! Every tree makes a difference.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ];

    res.json({
      success: true,
      comments: comments.slice(0, parseInt(limit))
    });
  } catch (error) {
    console.error('Comments fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch comments',
      message: error.message 
    });
  }
});

// Get community statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      totalPosts: 156,
      totalLikes: 1240,
      totalComments: 389,
      activeUsers: 45,
      achievementsShared: 89,
      tipsShared: 67,
      weeklyActivity: {
        posts: 23,
        likes: 187,
        comments: 45
      },
      monthlyActivity: {
        posts: 89,
        likes: 756,
        comments: 234
      }
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Community stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch community statistics',
      message: error.message 
    });
  }
});

// Get trending topics
router.get('/trending', async (req, res) => {
  try {
    const trending = [
      {
        topic: '#EcoWarrior',
        posts: 23,
        engagement: 156
      },
      {
        topic: '#TreePlanting',
        posts: 18,
        engagement: 134
      },
      {
        topic: '#ZeroWaste',
        posts: 15,
        engagement: 98
      },
      {
        topic: '#RenewableEnergy',
        posts: 12,
        engagement: 87
      },
      {
        topic: '#ClimateAction',
        posts: 10,
        engagement: 76
      }
    ];

    res.json({
      success: true,
      trending
    });
  } catch (error) {
    console.error('Trending topics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch trending topics',
      message: error.message 
    });
  }
});

// Report post
router.post('/posts/:id/report', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, reason, description } = req.body;

    if (!userId || !reason) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, reason' 
      });
    }

    // In a real app, this would save report to Firestore
    const report = {
      id: `report_${Date.now()}`,
      postId: id,
      userId,
      reason,
      description,
      status: 'pending',
      createdAt: new Date()
    };

    res.json({
      success: true,
      report,
      message: 'Report submitted successfully'
    });
  } catch (error) {
    console.error('Post report error:', error);
    res.status(500).json({ 
      error: 'Failed to submit report',
      message: error.message 
    });
  }
});

module.exports = router;
