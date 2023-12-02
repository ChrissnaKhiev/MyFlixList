import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/register', {
        username,
        password,
      });

      if (response.status === 200) {
        onRegister(response.data);
        setUsername('');
        setPassword('');
        setErrorMessage('Successful Registration.');
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data || 'Error during registration');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
