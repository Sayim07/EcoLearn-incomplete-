// Main App component with routing
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DemoAuthProvider } from './contexts/DemoAuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Quizzes from './pages/Quizzes';
import Challenges from './pages/Challenges';
import Community from './pages/Community';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <DemoAuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/quizzes" 
                element={
                  <ProtectedRoute>
                    <Quizzes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/challenges" 
                element={
                  <ProtectedRoute>
                    <Challenges />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/community" 
                element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </DemoAuthProvider>
  );
}

export default App;
