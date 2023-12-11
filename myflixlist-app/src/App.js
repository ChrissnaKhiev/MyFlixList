import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import axios from 'axios';
import Search from './components/Search';
import Login from './components/Login';
import Register from './components/Register';
import SearchResults from './components/SearchResults';
import Dashboard from './components/Dashboard';
import MovieDetail from './components/MovieDetail';
import LoginHandler from './components/LoginHandler';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [previousUser, setPreviousUser] = useState(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    axios.get('/user', { withCredentials: true })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error('Error checking authentication status:', error);
      });
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setPreviousUser(user);
  }, [user]);

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
        window.location.reload();
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
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  const handleRegister = (userData) => {
    setUser(userData.user);
    console.log('User registered:', userData);
  };

  const HomePage = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '85vh' }}>
    <div className="text-center">
      <h1>My Flix List</h1>
      <div className="d-flex justify-content-center" style={{ gap: '10px' }}>
        <div style={{ maxWidth: '300px' }}>
          <Register onRegister={handleRegister} />
        </div>
        <div style={{ maxWidth: '300px' }}>
          <Login onLogin={handleLogin} />
        </div>
      </div>
    </div>
  </div>
  );

  const SearchPage = () => (
    <div>
      <Search onSearch={handleSearch} />
      <SearchResults movies={movies} user={user} refreshWatchlist={refreshWatchlist} />
    </div>
  );

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="container" style={{ paddingTop: '20px', paddingBottom: '20px', backgroundColor: '#fff', borderRadius: '5px' }}>
                <Routes>
                    <Route path="/" element={!user ? <HomePage /> : <Dashboard user={user} />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/movie-detail/:imdbID" element={<MovieDetail user={user} />} />
                </Routes>
            </div>
    </Router>
  );
};


export default App;
