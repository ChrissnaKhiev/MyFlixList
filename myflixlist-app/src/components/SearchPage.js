import React, { useState } from 'react';
import Search from './Search';
import SearchResults from './SearchResults';
import axios from 'axios';

const SearchPage = ({ user, refreshWatchlist }) => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
  
    const fetchMovies = async (searchTerm) => {
      try {
        const OMDBKEY = process.env.REACT_APP_OMDBKEY;
        const response = await axios.get(`http://www.omdbapi.com/?apikey=${OMDBKEY}&s=${searchTerm}`);
  
        if (!response.data || response.data.Response === "False") {
          throw new Error(response.data.Error || 'Unable to fetch movies.');
        }
  
        setMovies(response.data.Search);
      } catch (error) {
        console.error('Error during search:', error);
        setError(error.message);
        setMovies([]);
      }
    };
  
    const handleSearch = (searchTerm) => {
      fetchMovies(searchTerm);
    };
  
    return (
      <div>
        <Search onSearch={handleSearch} />
        {error && <p>{error}</p>}
        <SearchResults movies={movies} user={user} refreshWatchlist={refreshWatchlist} />
      </div>
    );
  };
  
  export default SearchPage;
  
