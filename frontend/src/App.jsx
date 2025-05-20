import { BrowserRouter , Routes, Route } from 'react-router-dom';
import Signup from '../src/pages/Signup/Signup';
import Login from '../src/pages/Login/Login';
import Homepage from '../src/pages/Home/Home';
import Leaderboard from './pages/Leaderboard/Leaderboard';
import Profile from './pages/Profile/Profile';
import Feeds from './pages/Feed/Feeds';
import SquadRoom from './pages/Squad/Squad';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/feeds" element={<Feeds />} />
        <Route path="/squad" element={<SquadRoom />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
