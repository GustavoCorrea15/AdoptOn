import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyAdoptions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchAdoptions();
    }
  }, [user]);

  const fetchAdoptions = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/adoptions/my-processes', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setAdoptions(data.data);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Erro ao carregar processos de adoção');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aprovado': return 'success';
      case 'em_analise': return 'warning';
      case 'rejeitado': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'aprovado': return 'Aprovado';
      case 'em_analise': return 'Em Análise';
      case 'rejeitado': return 'Rejeitado';
      case 'iniciado': return 'Iniciado';
      default: return status;
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
        🏠 Minhas Adoções
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {adoptions.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Você ainda não manifestou interesse em nenhum animal
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
          {adoptions.map((adoption) => (
            <Grid item xs={12} md={6} lg={4} key={adoption.id}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={adoption.animal_foto || 'https://via.placeholder.com/300x200?text=Sem+Foto'}
                  alt={adoption.animal_nome}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {adoption.animal_nome}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={getStatusText(adoption.status)}
                      color={getStatusColor(adoption.status)}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    ONG: {adoption.ong_nome}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Data: {new Date(adoption.data_inicio).toLocaleDateString('pt-BR')}
                  </Typography>

                  {adoption.compatibility_score && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Compatibilidade: {adoption.compatibility_score}%
                    </Typography>
                  )}

                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/animals/${adoption.animal_id}`)}
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

export default MyAdoptions;