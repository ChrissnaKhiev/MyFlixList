// components/SearchResults.js
import React from 'react';

const SearchResults = ({ movies }) => {
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
