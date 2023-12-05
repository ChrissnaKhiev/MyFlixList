import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Card, Alert } from 'react-bootstrap';

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

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
        setMessage('Registration successful.');
      } else {
        setMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      setMessage(error.response?.data || 'Error during registration');
      console.error(error);
    }
  };

  return (
    <Card className="mx-auto mt-1 border-danger" style={{ maxWidth: '600px' }}>
            <Card.Body>
                <Card.Title>Register</Card.Title>
                <Form onSubmit={handleRegister}>
                    <Form.Group className="mb-3" controlId="registerUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="registerPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </Form.Group>

                    <Button variant="danger" type="submit">Register</Button>
                    {message && <Alert style={{ marginTop: '10px'}} variant="success">{message}</Alert>}

                </Form>
            </Card.Body>
        </Card>
  );
};

export default Register;
