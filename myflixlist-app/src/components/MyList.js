import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyList = ({ watchlist, user, refreshWatchlist }) => {
  const [detailedList, setDetailedList] = useState([]);

  const removeFromWatchlist = async (movieId) => {
    try {
      await axios.post('/remove-from-watchlist', { movieId }, {
        headers: {
          'Authorization': `Bearer ${user.token}`, // Adjust according to your auth setup
        },
      });

      // Refresh the watchlist to reflect the change
      refreshWatchlist();
    } catch (error) {
      console.error('Error removing movie from watchlist:', error);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      const detailedData = await Promise.all(
        watchlist.map(async (movie) => {
          const omdbResponse = await axios.get(
            `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDBKEY}&t=${movie.title}`
          );
          const omdbData = omdbResponse.data;
          return {
            title: omdbData.Title,
            year: omdbData.Year,
            genre: omdbData.Genre,
            poster: omdbData.Poster,
          };
        })
      );
      setDetailedList(detailedData);
    };

    if (watchlist.length > 0) {
      fetchDetails();
    }
  }, [watchlist]);

  return (
    <div>
      <h1>MyList</h1>
        <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', overflowX: 'auto' }}>
          {watchlist.map((movie, index) => (
            <li key={index} style={{ marginRight: '20px' }}>
              <img src={movie.poster} alt={movie.title} style={{ width: '150px', height: '225px' }} />
              <p>{movie.title} ({movie.year}) - Genre: {movie.genre}</p>
              <button onClick={() => removeFromWatchlist(movie._id)}>Remove from Watchlist</button>
            </li>
          ))}
        </ul>
    </div>
  );
};

export default MyList;