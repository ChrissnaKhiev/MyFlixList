import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Search from './components/Search';
import MyList from './components/MyList';
import Login from './components/Login';
import SearchResults from './components/SearchResults';
import Dashboard from './components/Dashboard';

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
    const response = await axios.get(`http://www.omdbapi.com/?apikey=${OMDBKEY}&s=${searchTerm}`);

    if (!response.data || response.data.Error) {
      throw new Error('Unable to fetch movies.');
    }

    setUser(null);
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
      console.log('Logging out...');
      // Add a logout request to the server if needed
      await axios.get('/logout', { withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        } });
      setUser(null);
      console.log(user);
      console.log('Logout successful');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  

  return (
    <div>
    <h1>My Flix List</h1>
    {user ? (
      <div>
        <p>Welcome, {user.username}!</p>
        <button onClick={handleLogout}>Logout</button>
        {/* Show Dashboard component if user is authenticated */}
        <Dashboard />
      </div>
    ) : (
      <Login onLogin={handleLogin} />
    )}

    {/* Rest of your components */}
    <Search onSearch={handleSearch} />
    {error && <p>{error}</p>}
    <MyList movies={movies} searchTerm={searchTerm} />
    <SearchResults movies={movies} />
  </div>
  );
};


export default App;
