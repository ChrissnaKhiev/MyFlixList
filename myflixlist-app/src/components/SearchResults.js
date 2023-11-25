// components/SearchResults.js
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
        genre: movie.Genre
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      });
      
      console.log(response.data);
    } catch (error) {
      console.error('Error adding movie to watchlist:', error);
    }
    refreshWatchlist();
  };

  return (
    <div>
      <h1>Search Results</h1>
      {movies.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', overflowX: 'auto' }}>
          {movies.map((movie) => (
            <li key={movie.imdbID} style={{ marginRight: '20px' }}>
              <img src={movie.Poster} alt={movie.Title} style={{ width: '150px', height: '225px' }} />
              <p>Title: {movie.Title}</p>
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
