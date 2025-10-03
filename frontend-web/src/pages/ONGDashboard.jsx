import React, { useState, useEffect } from 'react';
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
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Badge,
  Paper,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Pets as PetsIcon,
  TrendingUp as TrendingUpIcon,
  Favorite as FavoriteIcon,
  Schedule as ScheduleIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ONGDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [newAnimal, setNewAnimal] = useState({
    nome: '',
    especie: '',
    raca: '',
    idade: '',
    sexo: '',
    porte: '',
    peso: '',
    cor: '',
    descricao: '',
    personalidade: '',
    castrado: false,
    vacinado: false,
    vermifugado: false,
    microchip: false,
    cuidados_especiais: false,
    necessidades_especiais: ''
  });

  // Dados simulados para métricas
  const [metrics, setMetrics] = useState({
    totalAnimais: 24,
    disponiveis: 18,
    emProcesso: 4,
    adotados: 2,
    visitasSemanais: 156,
    favoritosSemanais: 89,
    adocoesUltimoMes: 8
  });

  // Dados para gráficos
  const pieData = [
    { name: 'Disponíveis', value: metrics.disponiveis, color: '#4CAF50' },
    { name: 'Em Processo', value: metrics.emProcesso, color: '#FF9800' },
    { name: 'Adotados', value: metrics.adotados, color: '#2196F3' }
  ];

  const barData = [
    { mes: 'Jan', adocoes: 5 },
    { mes: 'Fev', adocoes: 8 },
    { mes: 'Mar', adocoes: 12 },
    { mes: 'Abr', adocoes: 7 },
    { mes: 'Mai', adocoes: 15 },
    { mes: 'Jun', adocoes: 10 }
  ];

  const lineData = [
    { dia: 'Seg', visitas: 45 },
    { dia: 'Ter', visitas: 52 },
    { dia: 'Qua', visitas: 38 },
    { dia: 'Qui', visitas: 61 },
    { dia: 'Sex', visitas: 73 },
    { dia: 'Sab', visitas: 89 },
    { dia: 'Dom', visitas: 67 }
  ];

  useEffect(() => {
    // Dados simulados dos animais da ONG
    setAnimals([
      {
        id: 1,
        nome: 'Mel',
        especie: 'cao',
        raca: 'SRD',
        idade: 36,
        sexo: 'femea',
        porte: 'medio',
        status: 'disponivel',
        fotos: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop'],
        visitas: 23,
        favoritos: 12,
        dataEntrada: '2024-01-15'
      },
      {
        id: 2,
        nome: 'Tom', 
        especie: 'gato',
        raca: 'SRD',
        idade: 24,
        sexo: 'macho',
        porte: 'pequeno',
        status: 'em_processo',
        fotos: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=200&fit=crop'],
        visitas: 18,
        favoritos: 8,
        dataEntrada: '2024-02-01'
      },
      {
        id: 3,
        nome: 'Luna',
        especie: 'cao',
        raca: 'Labrador',
        idade: 48,
        sexo: 'femea',
        porte: 'grande',
        status: 'disponivel',
        fotos: ['https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=300&h=200&fit=crop'],
        visitas: 31,
        favoritos: 15,
        dataEntrada: '2024-01-20'
      }
    ]);
  }, []);

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    const photoUrls = files.map(file => URL.createObjectURL(file));
    setSelectedPhotos([...selectedPhotos, ...photoUrls]);
  };

  const removePhoto = (index) => {
    setSelectedPhotos(selectedPhotos.filter((_, i) => i !== index));
  };

  const handleAddAnimal = () => {
    const animal = {
      id: Date.now(),
      ...newAnimal,
      status: 'disponivel',
      fotos: selectedPhotos.length > 0 ? selectedPhotos : ['https://via.placeholder.com/300x200?text=' + newAnimal.nome],
      visitas: 0,
      favoritos: 0,
      dataEntrada: new Date().toISOString().split('T')[0]
    };
    setAnimals([...animals, animal]);
    setNewAnimal({
      nome: '',
      especie: '',
      raca: '',
      idade: '',
      sexo: '',
      porte: '',
      peso: '',
      cor: '',
      descricao: '',
      personalidade: '',
      castrado: false,
      vacinado: false,
      vermifugado: false,
      microchip: false,
      cuidados_especiais: false,
      necessidades_especiais: ''
    });
    setSelectedPhotos([]);
    setOpenDialog(false);
  };

  const updateAnimalStatus = (id, newStatus) => {
    setAnimals(animals.map(animal => 
      animal.id === id ? { ...animal, status: newStatus } : animal
    ));
  };

  const deleteAnimal = (id) => {
    setAnimals(animals.filter(animal => animal.id !== id));
  };

  const filteredAnimals = animals.filter(animal => {
    if (tabValue === 0) return animal.status === 'disponivel';
    if (tabValue === 1) return animal.status === 'em_processo';
    return true;
  });

  if (user?.tipo_usuario !== 'ong') {
    return (
      <Container>
        <Typography variant="h4" color="error">
          Acesso negado. Apenas ONGs podem acessar esta página.
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          p: 3,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 3,
          backdropFilter: 'blur(10px)'
        }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#333' }}>
              🏠 Dashboard ONG
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#666' }}>
              Gerencie seus animais e acompanhe métricas
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              borderRadius: 3,
              px: 3,
              py: 1.5
            }}
          >
            Cadastrar Animal
          </Button>
        </Box>

        {/* Métricas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(45deg, #4CAF50, #45a049)',
              color: 'white',
              borderRadius: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {metrics.totalAnimais}
                    </Typography>
                    <Typography variant="body2">
                      Total de Animais
                    </Typography>
                  </Box>
                  <PetsIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(45deg, #2196F3, #1976D2)',
              color: 'white',
              borderRadius: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {metrics.visitasSemanais}
                    </Typography>
                    <Typography variant="body2">
                      Visitas esta Semana
                    </Typography>
                  </Box>
                  <VisibilityIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(45deg, #FF9800, #F57C00)',
              color: 'white',
              borderRadius: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {metrics.favoritosSemanais}
                    </Typography>
                    <Typography variant="body2">
                      Favoritos esta Semana
                    </Typography>
                  </Box>
                  <FavoriteIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(45deg, #9C27B0, #7B1FA2)',
              color: 'white',
              borderRadius: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {metrics.adocoesUltimoMes}
                    </Typography>
                    <Typography variant="body2">
                      Adoções no Mês
                    </Typography>
                  </Box>
                  <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Gráficos */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.95)' }}>
              <Typography variant="h6" gutterBottom>Status dos Animais</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.95)' }}>
              <Typography variant="h6" gutterBottom>Adoções por Mês</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="adocoes" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.95)' }}>
              <Typography variant="h6" gutterBottom>Visitas da Semana</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visitas" stroke="#2196F3" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Tabs para Animais */}
        <Paper sx={{ borderRadius: 3, background: 'rgba(255,255,255,0.95)', overflow: 'hidden' }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              label={
                <Badge badgeContent={animals.filter(a => a.status === 'disponivel').length} color="success">
                  Disponíveis
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={animals.filter(a => a.status === 'em_processo').length} color="warning">
                  Em Processo
                </Badge>
              } 
            />
          </Tabs>

          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {filteredAnimals.map((animal) => (
                <Grid item xs={12} sm={6} md={4} key={animal.id}>
                  <Card sx={{ 
                    borderRadius: 3,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
                    }
                  }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={animal.fotos[0]}
                      alt={animal.nome}
                    />
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6">{animal.nome}</Typography>
                        <Chip 
                          label={animal.status === 'disponivel' ? 'Disponível' : 'Em Processo'}
                          color={animal.status === 'disponivel' ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {animal.especie === 'cao' ? 'Cão' : 'Gato'} • {animal.raca} • {Math.floor(animal.idade / 12)} anos
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <VisibilityIcon fontSize="small" color="action" />
                          <Typography variant="caption">{animal.visitas}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <FavoriteIcon fontSize="small" color="error" />
                          <Typography variant="caption">{animal.favoritos}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    
                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                      <Box>
                        <IconButton size="small" color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => deleteAnimal(animal.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <Box>
                        {animal.status === 'disponivel' ? (
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={() => updateAnimalStatus(animal.id, 'em_processo')}
                          >
                            Marcar Processo
                          </Button>
                        ) : (
                          <Button 
                            size="small" 
                            variant="contained"
                            onClick={() => updateAnimalStatus(animal.id, 'adotado')}
                          >
                            Finalizar Adoção
                          </Button>
                        )}
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>

        {/* Dialog para cadastrar animal */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)', color: 'white' }}>
            🐾 Cadastrar Novo Animal
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome"
                  value={newAnimal.nome}
                  onChange={(e) => setNewAnimal({...newAnimal, nome: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Espécie</InputLabel>
                  <Select
                    value={newAnimal.especie}
                    label="Espécie"
                    onChange={(e) => setNewAnimal({...newAnimal, especie: e.target.value})}
                  >
                    <MenuItem value="cao">🐕 Cão</MenuItem>
                    <MenuItem value="gato">🐱 Gato</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Raça"
                  value={newAnimal.raca}
                  onChange={(e) => setNewAnimal({...newAnimal, raca: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Idade (meses)"
                  type="number"
                  value={newAnimal.idade}
                  onChange={(e) => setNewAnimal({...newAnimal, idade: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Sexo</InputLabel>
                  <Select
                    value={newAnimal.sexo}
                    label="Sexo"
                    onChange={(e) => setNewAnimal({...newAnimal, sexo: e.target.value})}
                  >
                    <MenuItem value="macho">Macho</MenuItem>
                    <MenuItem value="femea">Fêmea</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Porte</InputLabel>
                  <Select
                    value={newAnimal.porte}
                    label="Porte"
                    onChange={(e) => setNewAnimal({...newAnimal, porte: e.target.value})}
                  >
                    <MenuItem value="pequeno">Pequeno</MenuItem>
                    <MenuItem value="medio">Médio</MenuItem>
                    <MenuItem value="grande">Grande</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Peso (kg)"
                  type="number"
                  value={newAnimal.peso}
                  onChange={(e) => setNewAnimal({...newAnimal, peso: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cor"
                  value={newAnimal.cor}
                  onChange={(e) => setNewAnimal({...newAnimal, cor: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição"
                  multiline
                  rows={3}
                  value={newAnimal.descricao}
                  onChange={(e) => setNewAnimal({...newAnimal, descricao: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Personalidade"
                  multiline
                  rows={2}
                  value={newAnimal.personalidade}
                  onChange={(e) => setNewAnimal({...newAnimal, personalidade: e.target.value})}
                />
              </Grid>
              
              {/* Upload de fotos */}
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<PhotoCameraIcon />}
                    sx={{ mb: 2 }}
                  >
                    Adicionar Fotos
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </Button>
                </Box>
                
                {selectedPhotos.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedPhotos.map((photo, index) => (
                      <Box key={index} sx={{ position: 'relative' }}>
                        <img 
                          src={photo} 
                          alt={`Preview ${index}`}
                          style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                        />
                        <IconButton
                          size="small"
                          sx={{ 
                            position: 'absolute', 
                            top: -8, 
                            right: -8, 
                            background: 'red', 
                            color: 'white',
                            '&:hover': { background: 'darkred' }
                          }}
                          onClick={() => removePhoto(index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button 
              onClick={handleAddAnimal} 
              variant="contained"
              sx={{ background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)' }}
            >
              Cadastrar Animal
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ONGDashboard;