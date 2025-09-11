// Demo authentication context for testing without Firebase
import React, { createContext, useContext, useState, useEffect } from 'react';

const DemoAuthContext = createContext();

export const useAuth = () => {
  const context = useContext(DemoAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const DemoAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (demo mode)
    const savedUser = localStorage.getItem('demoUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setUserData({
        uid: user.uid,
        name: user.displayName || 'Demo User',
        email: user.email,
        points: 150,
        level: 2,
        school: 'Demo School',
        quizzesCompleted: 3,
        challengesCompleted: 2,
        role: 'student'
      });
    }
    setLoading(false);
  }, []);

  const signUp = async (email, password, additionalData) => {
    // Demo sign up - create a fake user
    const demoUser = {
      uid: 'demo-' + Date.now(),
      email: email,
      displayName: additionalData?.name || 'Demo User',
      emailVerified: true
    };
    
    const demoUserData = {
      uid: demoUser.uid,
      name: additionalData?.name || 'Demo User',
      email: email,
      points: 0,
      level: 1,
      school: additionalData?.school || 'Demo School',
      quizzesCompleted: 0,
      challengesCompleted: 0,
      role: 'student'
    };

    localStorage.setItem('demoUser', JSON.stringify(demoUser));
    setCurrentUser(demoUser);
    setUserData(demoUserData);
    
    return { success: true };
  };

  const signIn = async (email, password) => {
    // Demo sign in - create a fake user
    const demoUser = {
      uid: 'demo-' + Date.now(),
      email: email,
      displayName: 'Demo User',
      emailVerified: true
    };
    
    const demoUserData = {
      uid: demoUser.uid,
      name: 'Demo User',
      email: email,
      points: 150,
      level: 2,
      school: 'Demo School',
      quizzesCompleted: 3,
      challengesCompleted: 2,
      role: 'student'
    };

    localStorage.setItem('demoUser', JSON.stringify(demoUser));
    setCurrentUser(demoUser);
    setUserData(demoUserData);
    
    return { success: true };
  };

  const signOut = async () => {
    localStorage.removeItem('demoUser');
    setCurrentUser(null);
    setUserData(null);
    return { success: true };
  };

  const value = {
    currentUser,
    userData,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <DemoAuthContext.Provider value={value}>
      {children}
    </DemoAuthContext.Provider>
  );
};


