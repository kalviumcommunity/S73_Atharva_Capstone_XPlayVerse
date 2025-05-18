import { BrowserRouter , Routes, Route } from 'react-router-dom';
import Signup from '../src/pages/Signup/Signup';
import Login from '../src/pages/Login/Login';
import Homepage from '../src/pages/Home/Home';
import Leaderboard from './pages/Leaderboard/Leaderboard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
