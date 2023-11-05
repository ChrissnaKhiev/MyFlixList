import React, { useState, useEffect } from 'react';

const UserProfile = ({ token }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:3001/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`, // Comment this line for testing without the token
          },
        });
    
        if (!response.ok) {
          throw new Error('Error fetching user profile');
        }
    
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    

    fetchUserProfile();
  }, [token]);

  return (
    <div>
      <h1>User Profile</h1>
      {profile && (
        <div>
          <p>Username: {profile.username}</p>
          <p>Email: {profile.email}</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
