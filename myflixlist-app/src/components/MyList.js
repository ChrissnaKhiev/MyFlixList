import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyList = ({ watchlist, user, refreshWatchlist }) => {
  const [detailedList, setDetailedList] = useState([]);

  const removeFromWatchlist = async (movieId) => {
    try {
      await axios.post('/remove-from-watchlist', { movieId }, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      refreshWatchlist();
    } catch (error) {
      console.error('Error removing movie from watchlist:', error);
    }
  };
  

  useEffect(() => {
    if (watchlist && watchlist.length > 0) {
      const fetchDetails = async () => {
        const detailedData = await Promise.all(
          watchlist.map(async (movie) => {
            const omdbResponse = await axios.get(
              `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDBKEY}&t=${movie.title}`
            );
            const omdbData = omdbResponse.data;
            return {
              ...movie,
              title: omdbData.Title,
              year: omdbData.Year,
              genre: omdbData.Genre,
              poster: omdbData.Poster,
              imdbID: omdbData.imdbID,
            };
          })
        );
        setDetailedList(detailedData);
      };

      fetchDetails();
    }
  }, [watchlist]);

  return (
    <div>
      <h1>My List</h1>
      {detailedList && detailedList.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', overflowX: 'auto' }}>
          {detailedList.map((movie, index) => {
            return (
              <li key={index} style={{ marginRight: '20px' }}>
                <Link to={`/movie-detail/${movie.imdbID}`}>
                  <img src={movie.poster} alt={movie.title} style={{ width: '150px', height: '225px' }} />
                  <p>{movie.title} ({movie.year})</p>
                </Link>
                <button onClick={() => removeFromWatchlist(movie._id)}>Remove from Watchlist</button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No movies in watchlist.</p>
      )}
    </div>
  );
};

export default MyList;