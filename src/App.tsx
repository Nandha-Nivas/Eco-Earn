import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Dashboard from '@/pages/Dashboard';
import Marketplace from '@/pages/Marketplace';
import MyPlants from '@/pages/MyPlants';
import Leaderboard from '@/pages/Leaderboard';
import Profile from '@/pages/Profile';
import CheckIn from '@/pages/CheckIn';
import PlantDetail from '@/pages/PlantDetail';
import Login from '@/pages/Login';
import { getFromStorage } from '@/lib/mock-data';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = getFromStorage('user');
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = getFromStorage('user');
    setIsLoggedIn(!!user);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-background">
        {isLoggedIn && <Header />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/marketplace" element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          } />
          <Route path="/my-plants" element={
            <ProtectedRoute>
              <MyPlants />
            </ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/check-in/:plantId" element={
            <ProtectedRoute>
              <CheckIn />
            </ProtectedRoute>
          } />
          <Route path="/plant/:plantId" element={
            <ProtectedRoute>
              <PlantDetail />
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}
