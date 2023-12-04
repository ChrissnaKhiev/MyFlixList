import { Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';

const SearchResults = ({ movies, user, refreshWatchlist }) => {
  const addToWatchlist = async (movie) => {
    if (!user) {
      console.log("User not logged in");
      return;
    }

    try {
      const response = await axios.post('/add-to-watchlist', {
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster,
        genre: movie.Genre,
        imdbID: movie.ImdbID
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      });
    } catch (error) {
      console.error('Error adding movie to watchlist:', error);
    }
    refreshWatchlist();
  };

  return (
    <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '20px' }}>
      <h1>Search Results</h1>
      {movies.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
          {movies.map((movie) => (
            <li key={movie.imdbID} style={{ display: 'inline-block', marginRight: '20px' }}>
              <Link to={`/movie-detail/${movie.imdbID}`}>
                <img src={movie.Poster} alt={movie.Title} style={{ width: '150px', height: '225px' }} />
                <p>Title: {movie.Title}</p>
              </Link>
              <p>Year: {movie.Year}</p>
              <button onClick={() => addToWatchlist(movie)}>Add to Watchlist</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found or search.</p>
      )}
    </div>
  );  
};

export default SearchResults;
