import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Dashboard from '@/pages/Dashboard';
import Marketplace from '@/pages/Marketplace';
import MyPlants from '@/pages/MyPlants';
import Leaderboard from '@/pages/Leaderboard';
import Profile from '@/pages/Profile';
import CheckIn from '@/pages/CheckIn';
import PlantDetail from '@/pages/PlantDetail';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/my-plants" element={<MyPlants />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/check-in/:plantId" element={<CheckIn />} />
          <Route path="/plant/:plantId" element={<PlantDetail />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}
