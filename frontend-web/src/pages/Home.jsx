import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h1" 
            fontWeight="bold" 
            sx={{ 
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            AdoptiON
            <br />
            Encontre seu melhor amigo
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4, 
              opacity: 0.9,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Conectamos você com animais que precisam de um lar amoroso.
            Adote com responsabilidade e mude duas vidas para sempre.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              sx={{ 
                bgcolor: 'white', 
                color: '#6366f1',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': { bgcolor: '#f1f5f9' }
              }}
              onClick={() => navigate('/animals')}
            >
              Buscar Pets
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': { 
                  borderColor: 'white', 
                  bgcolor: 'rgba(255,255,255,0.1)' 
                }
              }}
              onClick={() => navigate('/register')}
            >
              Cadastrar-se
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            fontWeight="bold" 
            sx={{ mb: 2, color: '#1e293b' }}
          >
            Como funciona
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ maxWidth: '600px', mx: 'auto' }}
          >
            Um processo simples e seguro para conectar pets com suas famílias ideais
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                textAlign: 'center', 
                p: 3,
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <CardContent>
                <Avatar 
                  sx={{ 
                    bgcolor: '#6366f1', 
                    width: 64, 
                    height: 64, 
                    mx: 'auto', 
                    mb: 2 
                  }}
                >
                  <SearchIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h5" component="h3" fontWeight="bold" sx={{ mb: 2 }}>
                  Busque
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Navegue por centenas de pets disponíveis para adoção com filtros personalizados
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                textAlign: 'center', 
                p: 3,
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <CardContent>
                <Avatar 
                  sx={{ 
                    bgcolor: '#f59e0b', 
                    width: 64, 
                    height: 64, 
                    mx: 'auto', 
                    mb: 2 
                  }}
                >
                  <FavoriteIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h5" component="h3" fontWeight="bold" sx={{ mb: 2 }}>
                  Conecte
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Entre em contato direto com ONGs e protetores através do nosso chat
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                textAlign: 'center', 
                p: 3,
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <CardContent>
                <Avatar 
                  sx={{ 
                    bgcolor: '#10b981', 
                    width: 64, 
                    height: 64, 
                    mx: 'auto', 
                    mb: 2 
                  }}
                >
                  <HomeIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h5" component="h3" fontWeight="bold" sx={{ mb: 2 }}>
                  Adote
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Complete o processo de adoção e dê um novo lar para seu novo amigo
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: '#1e293b', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            fontWeight="bold" 
            textAlign="center" 
            sx={{ mb: 6 }}
          >
            Nosso impacto
          </Typography>
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={12} sm={4}>
              <Typography variant="h2" component="div" fontWeight="bold" sx={{ mb: 1 }}>
                1.500+
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.8 }}>
                Pets adotados
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h2" component="div" fontWeight="bold" sx={{ mb: 1 }}>
                95%
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.8 }}>
                Taxa de sucesso
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h2" component="div" fontWeight="bold" sx={{ mb: 1 }}>
                200+
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.8 }}>
                ONGs parceiras
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h2" 
          fontWeight="bold" 
          sx={{ mb: 2, color: '#1e293b' }}
        >
          Pronto para adotar?
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ mb: 4, maxWidth: '500px', mx: 'auto' }}
        >
          Milhares de pets estão esperando por uma família. Comece sua jornada hoje.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<PetsIcon />}
          sx={{
            bgcolor: '#6366f1',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            '&:hover': { bgcolor: '#5b5bd6' }
          }}
          onClick={() => navigate('/animals')}
        >
          Ver Pets Disponíveis
        </Button>
      </Container>
    </Box>
  );
};

export default Home;