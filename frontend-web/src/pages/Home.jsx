import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <span style={{ fontSize: 40 }}>🐾</span>,
      title: 'Matching Inteligente',
      description: 'Encontre o animal perfeito para seu perfil com 85% de compatibilidade'
    },
    {
      icon: <span style={{ fontSize: 40 }}>❤️</span>,
      title: 'Adoção Responsável',
      description: 'Processo estruturado que reduz devoluções de 60% para 15%'
    },
    {
      icon: <span style={{ fontSize: 40 }}>🏠</span>,
      title: 'Acompanhamento',
      description: 'Suporte contínuo pós-adoção para garantir o bem-estar'
    }
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          background: 'linear-gradient(135deg, #FF6B35 0%, #4ECDC4 100%)',
          borderRadius: 2,
          color: 'white',
          mb: 6,
          mt: 2
        }}
      >
        <Typography variant="h2" component="h1" fontWeight="bold" textAlign="center" sx={{ mb: 2 }}>
          🐕 Sistema de Adoção Responsável 🐱
        </Typography>
        <Typography variant="h5" component="p" gutterBottom sx={{ mb: 4 }}>
          Conectando animais e famílias através de matching inteligente
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' }
            }}
            onClick={() => navigate('/animals')}
          >
            Ver Animais Disponíveis
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ 
              borderColor: 'white', 
              color: 'white',
              '&:hover': { borderColor: 'grey.300', bgcolor: 'rgba(255,255,255,0.1)' }
            }}
            onClick={() => navigate('/register')}
          >
            Cadastre-se
          </Button>
        </Box>

      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 6, position: 'relative' }}>

        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Como Funciona
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
          Nosso sistema revoluciona o processo de adoção com tecnologia e ciência
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box sx={{ mb: 2, position: 'relative' }}>
                    {feature.icon}

                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Stats Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
          mb: 6
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          Nosso Impacto
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h3" component="div" fontWeight="bold">
              85%
            </Typography>
            <Typography variant="body1">
              Taxa de Compatibilidade
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h3" component="div" fontWeight="bold">
              15%
            </Typography>
            <Typography variant="body1">
              Taxa de Devolução
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h3" component="div" fontWeight="bold">
              1.500+
            </Typography>
            <Typography variant="body1">
              Animais Adotados
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* CTA Section */}
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Pronto para Adotar?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Encontre seu novo melhor amigo hoje mesmo
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/animals')}
        >
          Começar Agora
        </Button>
      </Box>
    </Container>
  );
};

export default Home;