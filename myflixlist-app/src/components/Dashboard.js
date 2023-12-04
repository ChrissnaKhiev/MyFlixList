import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyList from './MyList';

const Dashboard = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/profile', { withCredentials: true });
        
        if (response.data && response.data.watchlist) {
          setProfile(response.data);
          setWatchlist(response.data.watchlist);
        } else {
          console.error('User profile fetched, but watchlist is missing');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      }
    };
    

    fetchUserProfile();
  }, []);

  const refreshWatchlist = async () => {
    try {
      const response = await axios.get('/watchlist', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
  
      if (response.data && response.data.length > 0) {
        setWatchlist(response.data);
      } else {
        setWatchlist([]);
        if (response.data.length === 0) {
          window.location.href = "/";
        }
      }
    } catch (error) {
      console.error('Error fetching updated watchlist:', error);
    }
  };
  

  return (
    <div>
      <h1>Dashboard</h1>
      {profile && (
        <div>
          <p>Welcome, {profile.username}!</p>
          {user ? <MyList watchlist={watchlist} user={user} refreshWatchlist={refreshWatchlist} /> : <p>Loading...</p>}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
