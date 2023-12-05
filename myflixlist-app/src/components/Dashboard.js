import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyList from './MyList';
import { Container, Card, Alert } from 'react-bootstrap';

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
    <Container className="my-4">
      <h1 className="text-center mb-4" style={{ marginTop: '100px' }}>Dashboard</h1>
      {profile ? (
        <Card>
          <Card.Header>Welcome, {profile.username}!</Card.Header>
          <Card.Body>
            {user ? <MyList watchlist={watchlist} user={user} refreshWatchlist={refreshWatchlist} /> : <Alert variant="info">Loading...</Alert>}
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="warning">User profile is not available.</Alert>
      )}
    </Container>
  );
};

export default Dashboard;
