import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PetsIcon from '@mui/icons-material/Pets';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <AppBar 
        position="static" 
        sx={{ 
          bgcolor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ px: 0 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#1e293b' }}>
              AdoptiON
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    );
  }

  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e2e8f0'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: 0 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              mr: 4
            }}
            onClick={() => navigate('/')}
          >
            <PetsIcon sx={{ color: '#6366f1', mr: 1, fontSize: 28 }} />
            <Typography
              variant="h5"
              component="div"
              sx={{ 
                fontWeight: 'bold',
                color: '#1e293b'
              }}
            >
              AdoptiON
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button 
              sx={{ 
                color: '#64748b',
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': { 
                  bgcolor: '#f1f5f9',
                  color: '#1e293b'
                }
              }} 
              onClick={() => navigate('/')}
            >
              Início
            </Button>
            <Button 
              sx={{ 
                color: '#64748b',
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': { 
                  bgcolor: '#f1f5f9',
                  color: '#1e293b'
                }
              }} 
              onClick={() => navigate('/animals')}
            >
              Pets
            </Button>
            
            {user ? (
              <>
                {user.tipo_usuario === 'admin' && (
                  <Button 
                    sx={{ 
                      color: '#64748b',
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': { 
                        bgcolor: '#f1f5f9',
                        color: '#1e293b'
                      }
                    }} 
                    onClick={() => navigate('/admin')}
                  >
                    Admin
                  </Button>
                )}
                {user.tipo_usuario === 'ong' && (
                  <>
                    <Button 
                      sx={{ 
                        color: '#64748b',
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': { 
                          bgcolor: '#f1f5f9',
                          color: '#1e293b'
                        }
                      }} 
                      onClick={() => navigate('/ong-dashboard')}
                    >
                      Dashboard
                    </Button>
                    <Button 
                      sx={{ 
                        color: '#64748b',
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': { 
                          bgcolor: '#f1f5f9',
                          color: '#1e293b'
                        }
                      }} 
                      onClick={() => navigate('/chat')}
                    >
                      Chat
                    </Button>
                  </>
                )}
                {user.tipo_usuario === 'adotante' && (
                  <>
                    <Button 
                      sx={{ 
                        color: '#64748b',
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': { 
                          bgcolor: '#f1f5f9',
                          color: '#1e293b'
                        }
                      }} 
                      onClick={() => navigate('/favorites')}
                    >
                      Favoritos
                    </Button>
                    <Button 
                      sx={{ 
                        color: '#64748b',
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': { 
                          bgcolor: '#f1f5f9',
                          color: '#1e293b'
                        }
                      }} 
                      onClick={() => navigate('/chat')}
                    >
                      Chat
                    </Button>
                  </>
                )}
                <Button 
                  sx={{ 
                    color: '#64748b',
                    textTransform: 'none',
                    fontSize: '1rem',
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    '&:hover': { 
                      bgcolor: '#f1f5f9',
                      color: '#1e293b'
                    }
                  }}
                  onClick={() => navigate('/profile')}
                >
                  <Avatar sx={{ width: 24, height: 24, bgcolor: '#6366f1', fontSize: '0.8rem' }}>
                    {user.nome?.charAt(0) || 'U'}
                  </Avatar>
                  Perfil
                </Button>
                <Button 
                  sx={{ 
                    color: '#64748b',
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': { 
                      bgcolor: '#f1f5f9',
                      color: '#1e293b'
                    }
                  }} 
                  onClick={logout}
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button 
                  sx={{ 
                    color: '#64748b',
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': { 
                      bgcolor: '#f1f5f9',
                      color: '#1e293b'
                    }
                  }} 
                  onClick={() => navigate('/login')}
                >
                  Entrar
                </Button>
                <Button 
                  variant="contained"
                  sx={{
                    bgcolor: '#6366f1',
                    textTransform: 'none',
                    fontSize: '1rem',
                    px: 3,
                    '&:hover': { bgcolor: '#5b5bd6' }
                  }}
                  onClick={() => navigate('/register')}
                >
                  Cadastrar
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;