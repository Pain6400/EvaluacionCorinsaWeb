import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/menu/Sidebar';
import Header from './components/menu/Header';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './assets/theme.js';

//Pages
import Login from './pages/account/login';
import Dashboard from './pages/Dashboard';
import Solicitudes from './pages/supervisor/Solicitudes.jsx';

//
import { UserProvider, UserContext } from './context/UserContext';
import { LoadingProvider, LoadingContext } from './context/LoadingContext';
import Loading from './components/Loading';
import { jwtDecode } from 'jwt-decode';
import api from './components/axiosConfig';
import GlobalAlert from './components/GlobalAlert';

const PrivateRoute = ({ children }) => {
  const { user  } = useContext(UserContext);
  return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { user, setUser } = useContext(UserContext);
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          // Token expired
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
        } else {
          // Token valid
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }
      } catch (error) {
        // Invalid token
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        GlobalAlert.showError('Error', error);
      }
    } else {
      setUser(null);
    }
  }, [setUser]);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token); // Guarda el token aquí
    setUser(userData);
  };

  const handleLogout = async() => {
    try {
      setIsLoading(true);

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);

    } catch (err) {
      let response = err.response?.data ?? null;
      if (response) {
        GlobalAlert.showError('Error logging out:', response.data.message);
      } else {
        GlobalAlert.showError('Error logging out:', err.message || err.toString());
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Router>
      {user ? (
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <div style={{ flexGrow: 1 }}>
            <Header user={user} onLogout={handleLogout} />
            <div style={{ padding: '16px' }}>
              <Routes>
                <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/Solicitudes" element={<PrivateRoute><Solicitudes /></PrivateRoute>} />       
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
      {isLoading && <Loading />}
    </Router>
  );
};

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <LoadingProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </LoadingProvider>
  </ThemeProvider>
);

export default App;