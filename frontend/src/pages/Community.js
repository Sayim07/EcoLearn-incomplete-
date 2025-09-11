// Community page for sharing achievements
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/DemoAuthContext';
import { collection, query, orderBy, limit, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Trophy, 
  Award,
  Leaf,
  Target,
  BookOpen,
  Plus,
  Send,
  Filter,
  Search
} from 'lucide-react';

const Community = () => {
  const { userData } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock community posts data
  const mockPosts = [
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
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
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
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
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
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      liked: false
    },
    {
      id: '4',
      userId: 'user4',
      userName: 'Alex Rodriguez',
      userSchool: 'Green Tech Institute',
      userPoints: 1560,
      userAvatar: 'AR',
      content: 'Completed 5 daily challenges this week! The energy-saving tips are really making a difference in my home.',
      type: 'achievement',
      achievement: {
        title: 'Weekly Challenge Streak',
        points: 50,
        icon: 'Target'
      },
      likes: 15,
      comments: 4,
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      liked: true
    }
  ];

  const filters = [
    { id: 'all', name: 'All Posts', icon: Users },
    { id: 'achievement', name: 'Achievements', icon: Trophy },
    { id: 'quiz', name: 'Quiz Results', icon: BookOpen },
    { id: 'tip', name: 'Tips & Tricks', icon: Leaf }
  ];

  useEffect(() => {
    // Simulate loading and set mock data
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLike = (postId) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const handleShare = (postId) => {
    // In a real app, this would open a share dialog
    alert('Post shared!');
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post = {
      userId: userData.uid,
      userName: userData.name,
      userSchool: userData.school,
      userPoints: userData.points,
      userAvatar: userData.name.split(' ').map(n => n[0]).join(''),
      content: newPost,
      type: 'tip',
      achievement: null,
      likes: 0,
      comments: 0,
      timestamp: new Date(),
      liked: false
    };

    try {
      // In a real app, this would save to Firestore
      // await addDoc(collection(db, 'community_posts'), post);
      
      setPosts(prev => [post, ...prev]);
      setNewPost('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const getAchievementIcon = (iconName) => {
    switch (iconName) {
      case 'TreePine':
        return <Leaf className="h-5 w-5 text-green-600" />;
      case 'Target':
        return <Target className="h-5 w-5 text-blue-600" />;
      case 'BookOpen':
        return <BookOpen className="h-5 w-5 text-purple-600" />;
      default:
        return <Award className="h-5 w-5 text-yellow-600" />;
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesFilter = selectedFilter === 'all' || post.type === selectedFilter;
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.userName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Eco Community
          </h1>
          <p className="text-gray-600">
            Share your achievements, learn from others, and celebrate environmental wins together!
          </p>
        </div>

        {/* Create Post */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <form onSubmit={handleSubmitPost}>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                {userData?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </div>
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your eco-achievement or tip with the community..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {userData?.points || 0} points
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={!newPost.trim()}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Post</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            {filters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedFilter === filter.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{filter.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm p-6">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {post.userAvatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {post.userName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {post.userSchool} • {post.userPoints} points
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {getTimeAgo(post.timestamp)}
                </span>
              </div>

              {/* Achievement Badge */}
              {post.achievement && (
                <div className="mb-4 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
                  <div className="flex items-center space-x-3">
                    {getAchievementIcon(post.achievement.icon)}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {post.achievement.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        +{post.achievement.points} points
                        {post.achievement.score && ` • ${post.achievement.score} score`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Post Content */}
              <p className="text-gray-900 mb-4">
                {post.content}
              </p>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 transition-colors ${
                      post.liked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${post.liked ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">
                      {post.likes}
                    </span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      {post.comments}
                    </span>
                  </button>
                  <button
                    onClick={() => handleShare(post.id)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Stats */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Community Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {posts.length}
              </div>
              <div className="text-gray-600">Total Posts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-600 mb-2">
                {posts.reduce((sum, post) => sum + post.likes, 0)}
              </div>
              <div className="text-gray-600">Total Likes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {posts.filter(post => post.type === 'achievement').length}
              </div>
              <div className="text-gray-600">Achievements Shared</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {posts.filter(post => post.type === 'tip').length}
              </div>
              <div className="text-gray-600">Tips Shared</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
