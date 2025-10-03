import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`http://localhost:3002/api/users/profile/${user.id}`);
          const data = await response.json();
          if (data.success) {
            setUserProfile({
              ...data.data,
              animais_favoritos: 0,
              adocoes_realizadas: 0
            });
          }
        } catch (error) {
          console.error('Erro ao carregar perfil:', error);
          setUserProfile({
            ...user,
            animais_favoritos: 0,
            adocoes_realizadas: 0
          });
        }
      }
    };
    loadProfile();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!userProfile) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Carregando perfil...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header do Perfil */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: 'primary.main',
              fontSize: 32,
              mr: 3
            }}
          >
            {userProfile.nome.charAt(0)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1">
              {userProfile.nome}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {userProfile.email}
            </Typography>
            <Chip 
              label={userProfile.tipo_usuario === 'adotante' ? 'Adotante' : 'ONG'} 
              color="primary" 
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
          <Box>
            <Button
              variant="outlined"
              onClick={() => navigate('/profile/edit')}
              sx={{ mr: 2 }}
            >
              Editar Perfil
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
            >
              Sair
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Informações Pessoais */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📋 Informações Pessoais
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Telefone
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {userProfile.telefone}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Cidade
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {userProfile.cidade}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Tipo de Moradia
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {userProfile.tipo_moradia === 'apartamento' ? 'Apartamento' : 
                     userProfile.tipo_moradia === 'casa' ? 'Casa' : 'Chácara'}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Experiência com Pets
                  </Typography>
                  <Typography variant="body1">
                    {userProfile.experiencia_pets === 'nenhuma' ? 'Nenhuma - Nunca tive pets' :
                     userProfile.experiencia_pets === 'pouca' ? 'Pouca - Tive pets na infância' :
                     userProfile.experiencia_pets === 'media' ? 'Média - Já cuidei por alguns anos' : 'Muita - Mais de 5 anos de experiência'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📊 Estatísticas
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Animais Favoritos
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      {userProfile.animais_favoritos}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Adoções Realizadas
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {userProfile.adocoes_realizadas}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Membro desde
                    </Typography>
                    <Typography variant="body1">
                      {new Date(userProfile.data_cadastro).toLocaleDateString('pt-BR')}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Ações Rápidas */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            🚀 Ações Rápidas
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/animals')}
              >
                Ver Animais
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/favorites')}
              >
                Meus Favoritos
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/adoptions')}
              >
                Minhas Adoções
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/profile/edit')}
              >
                Editar Perfil
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>

            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;