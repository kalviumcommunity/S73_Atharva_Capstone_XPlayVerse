import { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import './leaderboard.css';

const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;

const Leaderboard = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(
          `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&ordering=-added&page_size=40`
        );
        setGames(response.data.results);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  return (
    <>
      <Navbar />
      <div className="leaderboard-container">
        <div className="leaderboard-content">
          <h1 className="leaderboard-title">🎮 Trending Games Leaderboard</h1>
          
          {loading ? (
            <p className="loading-text">Loading games...</p>
          ) : (
            <div className="games-grid">
              {games.map((game, index) => (
                <div className="leaderboard-card" key={game.id}>
                  <div className="game-image-container">
                    <img 
                      src={game.background_image} 
                      alt={game.name} 
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x225?text=Game+Image';
                      }}
                    />
                  </div>
                  <div className="leaderboard-info">
                    <h2>{index + 1}. {game.name}</h2>
                    <p>⭐ {game.rating.toFixed(1)}/5</p>
                    <p>Released: {new Date(game.released).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
