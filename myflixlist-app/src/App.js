import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Search from './components/Search';
import MyList from './components/MyList';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import SearchResults from './components/SearchResults';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);

  // Check authentication status when the component mounts
  useEffect(() => {
    axios.get('/user', { withCredentials: true })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error('Error checking authentication status:', error);
      });
  }, []);

  const fetchMovies = async (searchTerm) => {
  try {
    const OMDBKEY = process.env.REACT_APP_OMDBKEY;
    const response = await axios.get(`http://www.omdbapi.com/?s=${searchTerm}&apikey=${OMDBKEY}`);

    if (!response.data || response.data.Error) {
      throw new Error('Unable to fetch movies.');
    }

    setMovies(response.data.Search);
    setError(null);
  } catch (error) {
    setMovies([]);
    setError(error.message);
  }
};


  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchMovies(term);
  };

  const handleLogin = async (userData) => {
    try {
      // Check if the login response contains a user object
      if (userData && userData.username) {
        setUser(userData);
      } else {
        // Handle unsuccessful login (optional)
        console.error('Login failed. Invalid user data received.');
        // You can display an error message or perform other actions as needed
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // Add a logout request to the server if needed
      await axios.get('/logout', { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div>
      <h1>Movie Search App</h1>
      {user ? (
        <div>
          <p>Welcome, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}

      <Search onSearch={handleSearch} />
      {error && <p>{error}</p>}
      <SearchResults movies={movies} /> {/* Include the SearchResults component */}
      <MyList movies={movies} searchTerm={searchTerm} />
      <UserProfile />
    </div>
  );
};


export default App;
