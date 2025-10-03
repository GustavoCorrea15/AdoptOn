import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Typography, Box } from '@mui/material';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        Carregando...
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.tipo_usuario !== 'admin') {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" color="error" align="center">
          🚫 Acesso Negado
        </Typography>
        <Typography variant="body1" align="center" sx={{ mt: 2 }}>
          Apenas administradores podem acessar esta página.
        </Typography>
      </Container>
    );
  }

  return children;
};

export default AdminRoute;