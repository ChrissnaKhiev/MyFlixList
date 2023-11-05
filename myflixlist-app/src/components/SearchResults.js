// components/SearchResults.js
import React from 'react';

const SearchResults = ({ movies }) => {
  return (
    <div>
      <h2>Search Results</h2>
      {movies.length > 0 ? (
        <ul>
          {movies.map((movie) => (
            <li key={movie.imdbID}>
                <img src={movie.Poster} alt={movie.Title} style={{ width: '150px', height: '225px' }} />
                <p>Title: {movie.Title}</p>
                <p>Year: {movie.Year}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
