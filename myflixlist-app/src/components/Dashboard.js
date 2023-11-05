import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Fetch user profile data when the component mounts
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/profile', { withCredentials: true });

        if (!response.data || response.data.error) {
          throw new Error('Error fetching user profile');
        }

        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {profile && (
        <div>
          <p>Username: {profile.username}</p>
          <p>Email: {profile.email}</p>
          {/* Add other profile information as needed */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
