import React, { useState } from 'react';
import { json, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Avatar } from '@mui/material';
import axios from 'axios';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to the login endpoint
      const response = await axios.post('http://localhost:8080/account/login', {
        username,
        password,
      });
      console.log(response)
      // Assuming the response contains a success flag or token upon successful login
      if (response.status === 200) {
        const now = new Date();
        const token = {
            value: response.headers.authorization,
            expired:now.getTime()+28800
        }
        localStorage.setItem('HRtoken', JSON.stringify(token) )
        // Redirect to '/manajemen-karyawan' upon successful login
        navigate('/manajemen-karyawan');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.log(error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: '2rem' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 120, height: 120 }}>
          <img src="https://placekitten.com/200/200" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Avatar> */}
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
      </Box>
      <form onSubmit={handleLogin}>
      <TextField
          id="username"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <TextField
          id="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
        />
        {error && (
          <Typography variant="body1" color="error" sx={{ marginBottom: '1rem' }}>
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" size="large" fullWidth>
          Login
        </Button>
      </form>
    </Container>
  );
}

export default LoginPage;
