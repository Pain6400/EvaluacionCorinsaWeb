import React, { useState, useEffect, useContext } from 'react';
import { Button, TextField, Container, Typography, Avatar, CssBaseline, Box, Snackbar, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'
import api from '../axiosConfig';
import { UserContext } from '../../context/UserContext';
import { LoadingContext } from '../../context/LoadingContext';
import GlobalAlert from '../GlobalAlert';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [errors, setErrors] = useState({});
  const { setUser } = useContext(UserContext);
  const { setIsLoading } = useContext(LoadingContext);
  
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!username) {
      validationErrors.username = 'El usuario es obligatorio';
    }
    if (!password) {
      validationErrors.password = 'La contraseña es obligatoria';
    }

    if (!totpCode) {
      validationErrors.totpCode = 'El totpCode es obligatoria';
    }

    if (Object.keys(validationErrors).length === 0) {
      try {
        setIsLoading(true);
        const response = await api.post('/Auth/Login', { email: username, password, totpCode });
        const token = response.data.token;
        localStorage.setItem('token', token);
        
        const decodedToken = jwtDecode(token); 
        const userData = { 
          userId: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
          token  // Agregar el token a userData
        };
        console.log(userData)
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/'); // Redireccionar al dashboard
      } catch (err) {
        console.log(err)
        let response = err.response?.data ?? null;
        if(response) {
          GlobalAlert.showError('Error logging in', response.message);
          console.error('Error logging in:', response.message);
        } else {
          GlobalAlert.showError('Error logging in', err);
          console.error('Error logging in:', err);
        }

      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Iniciar Sesión
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Usuario"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={Boolean(errors.username)}
            helperText={errors.username}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={Boolean(errors.password)}
            helperText={errors.password}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="totpCode"
            label="totpCode"
            name="totpCode"
            autoComplete="totpCode"
            autoFocus
            value={totpCode}
            onChange={(e) => setTotpCode(e.target.value)}
            error={Boolean(errors.totpCode)}
            helperText={errors.totpCode}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Iniciar Sesión
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;
