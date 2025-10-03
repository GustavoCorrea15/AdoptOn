import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../context/AuthContext';
import { sortAnimalsByCompatibility } from '../utils/matchingAlgorithm';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Box,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  Zoom,
  Grow,
  Slide,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PetsIcon from '@mui/icons-material/Pets';
import { useNavigate } from 'react-router-dom';

// Sons para interações
const playSound = (type) => {
  const audio = new Audio();
  switch(type) {
    case 'click':
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
      break;
    case 'favorite':
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
      break;
    default:
      return;
  }
  audio.volume = 0.3;
  audio.play().catch(() => {});
};

const Animals = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allAnimals, setAllAnimals] = useState([]);
  const [compatibleAnimals, setCompatibleAnimals] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [showSection, setShowSection] = useState('all');
  const [availableCities, setAvailableCities] = useState([]);
  const [filters, setFilters] = useState({
    especie: '',
    porte: '',
    cidade: ''
  });
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const loadAnimals = async () => {
      try {
        // Buscar animais do backend
        const response = await fetch('http://localhost:3002/api/animals');
        const data = await response.json();
        
        let mockAnimals = [];
        if (data.success) {
          mockAnimals = data.data;
        } else {
          console.error('Erro ao carregar animais do backend');
        }

        if (user?.id) {
          try {
            const profileResponse = await fetch(`http://localhost:3002/api/users/profile/${user.id}`);
            const profileData = await profileResponse.json();
            if (profileData.success) {
              setUserProfile(profileData.data);
              const sortedAnimals = sortAnimalsByCompatibility(mockAnimals, profileData.data);
              const compatible = sortedAnimals.filter(a => a.compatibility_score >= 70);
              setCompatibleAnimals(compatible);
              setAllAnimals(sortedAnimals);
              if (compatible.length > 0) {
                setShowSection('compatible');
              }
            } else {
              setAllAnimals(mockAnimals);
              setCompatibleAnimals([]);
            }
          } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            setAllAnimals(mockAnimals);
            setCompatibleAnimals([]);
          }
        } else {
          setAllAnimals(mockAnimals);
          setCompatibleAnimals([]);
        }
        
        // Extrair cidades únicas dos animais
        const cities = [...new Set(mockAnimals.map(animal => animal.ong_cidade))].sort();
        setAvailableCities(cities);
      } catch (error) {
        console.error('Erro ao carregar animais:', error);
      }
    };
    
    loadAnimals();
  }, [user]);

  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const currentAnimals = showSection === 'compatible' ? compatibleAnimals : allAnimals;
  
  const filteredAnimals = useMemo(() => {
    return currentAnimals.filter(animal => {
      return (
        (!filters.especie || animal.especie === filters.especie) &&
        (!filters.porte || animal.porte === filters.porte) &&
        (!filters.cidade || animal.ong_cidade.toLowerCase().includes(filters.cidade.toLowerCase()))
      );
    });
  }, [currentAnimals, filters]);

  const getCompatibilityColor = useCallback((score) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'info';
    if (score >= 70) return 'warning';
    return 'error';
  }, []);

  const getCompatibilityText = useCallback((score) => {
    if (score >= 90) return 'Excelente';
    if (score >= 80) return 'Muito Boa';
    if (score >= 70) return 'Boa';
    return 'Razoável';
  }, []);

  const handleQuickChat = async (animal) => {
    if (!user) return;
    
    try {
      // Obter token CSRF
      const csrfResponse = await fetch('http://localhost:3002/api/csrf-token', {
        credentials: 'include'
      });
      const csrfData = await csrfResponse.json();
      
      const response = await fetch('http://localhost:3002/api/chat/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
          'X-CSRF-Token': csrfData.csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({
          animal_id: animal.id,
          mensagem: `Olá! Tenho interesse em conhecer mais sobre ${animal.nome}. Podemos conversar?`
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        playSound('click');
        navigate('/chat');
      } else {
        console.error('Erro ao iniciar chat:', data.error);
      }
    } catch (error) {
      console.error('Erro ao iniciar conversa:', error);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Elementos decorativos flutuantes */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        fontSize: '60px',
        opacity: 0.1,
        animation: 'float 6s ease-in-out infinite',
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      }}>🐕</Box>
      <Box sx={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        fontSize: '40px',
        opacity: 0.1,
        animation: 'float 4s ease-in-out infinite 2s'
      }}>🐱</Box>
      <Box sx={{
        position: 'absolute',
        bottom: '15%',
        left: '15%',
        fontSize: '50px',
        opacity: 0.1,
        animation: 'float 5s ease-in-out infinite 1s'
      }}>🦴</Box>
      
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
      <Grow in timeout={1000}>
        <Box sx={{ 
          textAlign: 'center', 
          mb: 4,
          p: 3,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 4,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          <Box 
            onClick={() => playSound('click')}
            sx={{ 
              fontSize: '60px', 
              cursor: 'pointer',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'scale(1.2) rotate(10deg)' }
            }}
          >🐕</Box>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Adote um Amigo
          </Typography>
          <Box 
            onClick={() => playSound('click')}
            sx={{ 
              fontSize: '60px', 
              cursor: 'pointer',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'scale(1.2) rotate(-10deg)' }
            }}
          >🐱</Box>
        </Box>
        <Typography variant="h6" sx={{ color: '#666', fontStyle: 'italic' }}>
          ✨ Encontre seu companheiro perfeito ✨
        </Typography>
        
        {user && userProfile && compatibleAnimals.length > 0 && (
          <Box sx={{ mt: 2, mb: 3 }}>
            <Button
              variant={showSection === 'compatible' ? 'contained' : 'outlined'}
              onClick={() => setShowSection('compatible')}
              sx={{ mr: 2 }}
            >
              🎯 Compatíveis ({compatibleAnimals.length})
            </Button>
            <Button
              variant={showSection === 'all' ? 'contained' : 'outlined'}
              onClick={() => setShowSection('all')}
            >
              📋 Todos ({allAnimals.length})
            </Button>
          </Box>
        )}
        </Box>
      </Grow>
      
      <Slide direction="up" in timeout={1500}>
        <Box sx={{ 
          mb: 4, 
          p: 3, 
          background: 'rgba(255,255,255,0.9)', 
          borderRadius: 3,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <PetsIcon sx={{ color: '#FF6B6B', fontSize: 30 }} />
          <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold' }}>
            🔍 Filtros de Busca
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Espécie</InputLabel>
              <Select
                value={filters.especie}
                label="Espécie"
                onChange={(e) => handleFilterChange('especie', e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="cao">Cão</MenuItem>
                <MenuItem value="gato">Gato</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Porte</InputLabel>
              <Select
                value={filters.porte}
                label="Porte"
                onChange={(e) => handleFilterChange('porte', e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="pequeno">Pequeno</MenuItem>
                <MenuItem value="medio">Médio</MenuItem>
                <MenuItem value="grande">Grande</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Cidade</InputLabel>
              <Select
                value={filters.cidade}
                label="Cidade"
                onChange={(e) => handleFilterChange('cidade', e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {availableCities.map(city => (
                  <MenuItem key={city} value={city}>{city}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        </Box>
      </Slide>

      <Grid container spacing={3} sx={{ position: 'relative' }}>
        {filteredAnimals.map((animal) => (
          <Grid item xs={12} sm={6} md={4} key={animal.id}>
            <Zoom in timeout={500 + (animal.id * 100)}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-12px) scale(1.02)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                '& .pet-emoji': {
                  transform: 'scale(1.3) rotate(15deg)'
                },
                '& .card-media': {
                  transform: 'scale(1.05)'
                }
              }
            }}>
              <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={animal.fotos[0]}
                  alt={animal.nome}
                  className="card-media"
                  sx={{ transition: 'transform 0.4s' }}
                />
                <Box 
                  className="pet-emoji"
                  sx={{ 
                    position: 'absolute', 
                    top: 10, 
                    right: 10,
                    fontSize: 35,
                    background: 'rgba(255,255,255,0.9)',
                    borderRadius: '50%',
                    p: 1,
                    transition: 'transform 0.3s',
                    cursor: 'pointer'
                  }}
                  onClick={() => playSound('click')}
                >
                  {animal.especie === 'cao' ? '🐕' : '🐱'}
                </Box>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="h2">
                    {animal.nome}
                  </Typography>
                  <Chip
                    label={`${getCompatibilityText(animal.compatibility_score)} (${animal.compatibility_score}%)`}
                    color={getCompatibilityColor(animal.compatibility_score)}
                    size="small"
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={animal.especie === 'cao' ? 'Cão' : 'Gato'} size="small" />
                  <Chip label={animal.porte} size="small" />
                  <Chip label={`${Math.floor(animal.idade / 12)} anos`} size="small" />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {animal.descricao.substring(0, 100)}...
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {animal.ong_nome} - {animal.ong_cidade}
                  </Typography>
                </Box>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  size="small"
                  variant={isFavorite(animal.id) ? 'contained' : 'outlined'}
                  onClick={() => {
                    playSound('favorite');
                    toggleFavorite(animal.id);
                  }}
                  color={isFavorite(animal.id) ? 'error' : 'primary'}
                  startIcon={<FavoriteIcon />}
                  sx={{
                    borderRadius: 3,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 15px rgba(255,107,107,0.4)'
                    }
                  }}
                >
                  {isFavorite(animal.id) ? 'Favorito' : 'Favoritar'}
                </Button>
                {user && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleQuickChat(animal)}
                    sx={{
                      borderRadius: 3,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 15px rgba(0,150,136,0.4)'
                      }
                    }}
                  >
                    💬 Chat
                  </Button>
                )}
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => {
                    playSound('click');
                    navigate(`/animals/${animal.id}`);
                  }}
                  sx={{
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 15px rgba(102,126,234,0.4)'
                    }
                  }}
                >
                  Ver Detalhes
                </Button>
              </CardActions>
            </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      {filteredAnimals.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Box sx={{ mb: 2, fontSize: 80 }}>
            🐶
          </Box>
          <Typography variant="h6" color="text.secondary">
            Nenhum animal encontrado
          </Typography>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => setFilters({ especie: '', porte: '', cidade: '' })}
          >
            Limpar Filtros
          </Button>
        </Box>
      )}
    </Container>
    
    {/* Botão flutuante decorativo */}
    <Fab 
      sx={{
        position: 'fixed',
        bottom: 30,
        right: 30,
        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
        fontSize: '30px',
        '&:hover': {
          transform: 'scale(1.1) rotate(10deg)',
          boxShadow: '0 8px 25px rgba(255,107,107,0.4)'
        },
        transition: 'all 0.3s'
      }}
      onClick={() => {
        playSound('click');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    >
      🐾
    </Fab>
    </Box>
  );
};

export default Animals;