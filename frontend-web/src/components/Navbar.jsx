import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Adoção ❤️
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          🐾
        </Box>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1 }}
          onClick={() => navigate('/')}
        >
          Sistema de Adoção ❤️
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button color="inherit" onClick={() => navigate('/')}>
            Início
          </Button>
          <Button color="inherit" onClick={() => navigate('/animals')}>
            Animais
          </Button>
          
          {user ? (
            <>
              {user.tipo_usuario === 'admin' && (
                <Button color="inherit" onClick={() => navigate('/admin')}>
                  Admin
                </Button>
              )}
              {user.tipo_usuario === 'ong' && (
                <>
                  <Button color="inherit" onClick={() => navigate('/ong-dashboard')}>
                    Meus Animais
                  </Button>
                  <Button color="inherit" onClick={() => navigate('/chat')}>
                    💬 Chat
                  </Button>
                </>
              )}
              {user.tipo_usuario === 'adotante' && (
                <>
                  <Button color="inherit" onClick={() => navigate('/favorites')}>
                    ❤️ Favoritos
                  </Button>
                  <Button color="inherit" onClick={() => navigate('/my-adoptions')}>
                    🏠 Minhas Adoções
                  </Button>
                  <Button color="inherit" onClick={() => navigate('/chat')}>
                    💬 Chat
                  </Button>
                </>
              )}
              <Button 
                color="inherit" 
                onClick={() => navigate('/profile')}
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Avatar sx={{ width: 24, height: 24, bgcolor: 'white', color: 'primary.main' }}>
                  {user.nome?.charAt(0) || 'U'}
                </Avatar>
                {user.tipo_usuario === 'admin' ? 'Admin' : 
                 user.tipo_usuario === 'ong' ? 'ONG' : 'Perfil'}
              </Button>
              <Button color="inherit" onClick={logout}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Entrar
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                onClick={() => navigate('/register')}
                sx={{ borderColor: 'white' }}
              >
                Cadastrar
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;