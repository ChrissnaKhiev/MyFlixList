import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Card } from 'react-bootstrap';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password
      }, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      const userData = response.data;

      onLogin(userData);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <Card className="mx-auto mt-1 border-danger" style={{ maxWidth: '600px' }}>
            <Card.Body>
                <Card.Title>Login</Card.Title>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>

                    <Button variant="danger" type="button" onClick={handleLogin}>Login</Button>
                </Form>
            </Card.Body>
        </Card>
  );
};

export default Login;
