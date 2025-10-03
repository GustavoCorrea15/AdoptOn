import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const AnimalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [animal, setAnimal] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchAnimal();
    if (user) {
      checkIfFavorite();
    }
  }, [id, user]);

  const fetchAnimal = async () => {
    try {
      const response = await fetch(`http://localhost:3002/api/animals/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setAnimal(data.data);
      } else {
        setAlert({ type: 'error', message: 'Animal não encontrado' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Erro ao carregar animal' });
    } finally {
      setPageLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`http://localhost:3002/api/favorites/check/${id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
    }
  };

  if (pageLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!animal) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Animal não encontrado</Alert>
      </Container>
    );
  }

  const getCompatibilityColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'info';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const getCompatibilityText = (score) => {
    if (score >= 90) return 'Excelente';
    if (score >= 80) return 'Muito Boa';
    if (score >= 70) return 'Boa';
    return 'Razoável';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>

      <Button
        variant="outlined"
        onClick={() => navigate('/animals')}
        sx={{ mb: 3 }}
      >
        ← Voltar para Animais
      </Button>

      <Grid container spacing={4}>
        {/* Fotos do Animal */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative' }}>
            <img
              src={animal.fotos?.[0] || `https://via.placeholder.com/600x400?text=${animal.nome}`}
              alt={animal.nome}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
            <Chip
              label={`Compatibilidade: ${getCompatibilityText(animal.compatibility_score)} (${animal.compatibility_score}%)`}
              color={getCompatibilityColor(animal.compatibility_score)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                fontWeight: 'bold'
              }}
            />
          </Box>
        </Grid>

        {/* Informações do Animal */}
        <Grid item xs={12} md={6}>
          <Typography variant="h3" component="h1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            {animal.especie === 'cao' ? '🐕' : '🐱'} {animal.nome} ❤️
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            <Chip label={animal.especie === 'cao' ? 'Cão' : 'Gato'} />
            <Chip label={animal.raca} />
            <Chip label={`${Math.floor(animal.idade / 12)} anos`} />
            <Chip label={animal.sexo === 'macho' ? 'Macho' : 'Fêmea'} />
            <Chip label={`Porte ${animal.porte}`} />
          </Box>

          <Typography variant="body1" paragraph>
            {animal.descricao}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Características
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Peso: {animal.peso} kg
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Cor: {animal.cor}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Energia: {animal.nivel_energia}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Sociabilidade: {animal.sociabilidade}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Cuidados Veterinários
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {animal.castrado && <Chip label="Castrado" color="success" size="small" />}
              {animal.vacinado && <Chip label="Vacinado" color="success" size="small" />}
              {animal.vermifugado && <Chip label="Vermifugado" color="success" size="small" />}
              {animal.microchip && <Chip label="Microchip" color="success" size="small" />}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Button
              variant={isFavorite ? "contained" : "outlined"}
              size="large"
              onClick={handleFavorite}
              disabled={!user}
            >
              {isFavorite ? '💖 Favoritado' : '❤️ Favoritar'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleStartChat}
              disabled={!user}
            >
              💬 Conversar com ONG
            </Button>
            <Button
              variant="contained"
              size="large"
              sx={{ flexGrow: 1 }}
              onClick={() => setOpenDialog(true)}
              disabled={!user}
            >
              Manifestar Interesse
            </Button>
          </Box>

          {!user && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Faça login para favoritar ou manifestar interesse
            </Alert>
          )}
        </Grid>
      </Grid>

      {/* Informações da ONG */}
      <Card sx={{ mt: 4, position: 'relative' }}>

        <CardContent>
          <Typography variant="h6" gutterBottom>
            Informações da ONG
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {animal.ong_nome.charAt(0)}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h6">
                {animal.ong_nome}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <LocationOnIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {animal.ong_cidade}
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                >
                  📞 {animal.ong_telefone}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                >
                  📧 Email
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Observações Médicas */}
      {animal.observacoes_medicas && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Observações Médicas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {animal.observacoes_medicas}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Dialog de Manifestar Interesse */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Manifestar Interesse em Adoção</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Conte um pouco sobre você e por que gostaria de adotar {animal.nome}:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ex: Tenho experiência com animais, moro em casa com quintal..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button 
            onClick={handleAdoptionInterest} 
            variant="contained"
            disabled={loading || !message.trim()}
          >
            {loading ? <CircularProgress size={20} /> : 'Enviar'}
          </Button>
        </DialogActions>
      </Dialog>

      {alert && (
        <Alert 
          severity={alert.type} 
          sx={{ position: 'fixed', top: 80, right: 20, zIndex: 1000 }}
          onClose={() => setAlert(null)}
        >
          {alert.message}
        </Alert>
      )}
    </Container>
  );

  async function handleFavorite() {
    if (!user) return;
    
    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const url = isFavorite 
        ? `http://localhost:3002/api/favorites/${id}`
        : 'http://localhost:3002/api/favorites';
      
      const body = isFavorite ? undefined : JSON.stringify({ animal_id: id });
      
      const headers = {
        'Authorization': `Bearer ${user.token}`
      };
      
      if (!isFavorite) {
        headers['Content-Type'] = 'application/json';
      }
      
      const response = await fetch(url, {
        method,
        headers,
        body
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsFavorite(!isFavorite);
        setAlert({ type: 'success', message: data.message });
        
        // Auto-hide alert after 3 seconds
        setTimeout(() => setAlert(null), 3000);
      } else {
        setAlert({ type: 'error', message: data.error });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Erro ao processar favorito' });
    }
  }
  
  async function handleStartChat() {
    if (!user) return;
    
    try {
      const response = await fetch('http://localhost:3002/api/chat/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          animal_id: id,
          mensagem: `Olá! Tenho interesse em conhecer mais sobre ${animal.nome}. Podemos conversar?`
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAlert({ type: 'success', message: 'Conversa iniciada! Redirecionando para o chat...' });
        setTimeout(() => {
          navigate('/chat');
        }, 1500);
      } else {
        setAlert({ type: 'error', message: data.error });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Erro ao iniciar conversa' });
    }
  }

  async function handleAdoptionInterest() {
    setLoading(true);
    
    try {
      // Manifestar interesse
      const adoptionResponse = await fetch('http://localhost:3002/api/adoptions/interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          animal_id: id,
          mensagem: message
        })
      });
      
      const adoptionData = await adoptionResponse.json();
      
      if (adoptionData.success) {
        // Iniciar conversa no chat
        const chatResponse = await fetch('http://localhost:3002/api/chat/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({
            animal_id: id,
            mensagem: `Olá! Manifestei interesse em adotar ${animal.nome}. ${message}`
          })
        });
        
        setAlert({ type: 'success', message: adoptionData.message + ' Você pode acompanhar a conversa no Chat.' });
        setOpenDialog(false);
        setMessage('');
        
        // Auto-hide alert after 5 seconds
        setTimeout(() => setAlert(null), 5000);
      } else {
        setAlert({ type: 'error', message: adoptionData.error });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Erro ao manifestar interesse' });
    } finally {
      setLoading(false);
    }
  }
};

export default AnimalDetail;