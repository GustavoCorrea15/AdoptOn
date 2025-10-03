import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/favorites', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setFavorites(data.data);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Erro ao carregar favoritos');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (animalId) => {
    try {
      const response = await fetch(`http://localhost:3002/api/favorites/${animalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setFavorites(favorites.filter(fav => fav.id !== animalId));
      }
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        ❤️ Meus Favoritos
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {favorites.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Você ainda não tem animais favoritos
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/animals')}
            sx={{ mt: 2 }}
          >
            Ver Animais Disponíveis
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((animal) => (
            <Grid item xs={12} md={6} lg={4} key={animal.id}>
              <Card sx={{ height: '100%', position: 'relative' }}>
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(255,255,255,0.8)',
                    zIndex: 1
                  }}
                  onClick={() => removeFavorite(animal.id)}
                >
                  <FavoriteIcon color="error" />
                </IconButton>
                
                <CardMedia
                  component="img"
                  height="200"
                  image={animal.fotos?.[0] || 'https://via.placeholder.com/300x200?text=Sem+Foto'}
                  alt={animal.nome}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {animal.nome}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {animal.especie === 'cao' ? 'Cão' : 'Gato'} • {animal.raca}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {Math.floor(animal.idade / 12)} anos • {animal.sexo === 'macho' ? 'Macho' : 'Fêmea'}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Favoritado em: {new Date(animal.favorited_at).toLocaleDateString('pt-BR')}
                  </Typography>

                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => navigate(`/animals/${animal.id}`)}
                      sx={{ flexGrow: 1 }}
                    >
                      Ver Detalhes
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Favorites;