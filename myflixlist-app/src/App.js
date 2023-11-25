import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Search from './components/Search';
import MyList from './components/MyList';
import Login from './components/Login';
import SearchResults from './components/SearchResults';
import Dashboard from './components/Dashboard';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    axios.get('/user', { withCredentials: true })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error('Error checking authentication status:', error);
      });
  }, []);

  const refreshWatchlist = useCallback(async () => {
    if (!user) {
      console.log("User is not logged in.");
      return;
    }

    try {
      const response = await axios.get('/watchlist', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      console.log(response.data);
      setWatchlist(response.data);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshWatchlist();
    } else {
      setWatchlist([]);
    }
  }, [user, refreshWatchlist]);

  useEffect(() => {
    console.log(watchlist);
  }, [watchlist]);
  

  const fetchMovies = async (searchTerm) => {
  try {
    const OMDBKEY = process.env.REACT_APP_OMDBKEY;
    const response = await axios.get(`http://www.omdbapi.com/?apikey=${OMDBKEY}&s=${searchTerm}`);

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
    fetchMovies(term);
  };

  const handleLogin = async (userData) => {
    try {
      if (userData && userData.username) {
        setUser(userData);
      } else {
        // Handle unsuccessful login (optional) dunno why
        window.location.reload();
        // console.error('Login failed. Invalid user data received.');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      await axios.get('/logout', { withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        } });
      setUser(null);
      console.log(user);
      console.log('Logout successful');
      window.location.reload();
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
        <Dashboard />
        <MyList watchlist={watchlist} user={user} refreshWatchlist={refreshWatchlist} />
      </div>
    ) : (
      <Login onLogin={handleLogin} />
    )}

    <Search onSearch={handleSearch} />
    {error && <p>{error}</p>}
    <SearchResults movies={movies} user={user} refreshWatchlist={refreshWatchlist} />
  </div>
  );
};


export default App;
