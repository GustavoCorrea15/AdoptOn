import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    tipo_moradia: '',
    experiencia_pets: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`http://localhost:3002/api/users/profile/${user.id}`);
          const data = await response.json();
          if (data.success) {
            setFormData({
              nome: data.data.nome || '',
              email: data.data.email || '',
              telefone: data.data.telefone || '',
              cidade: data.data.cidade || '',
              tipo_moradia: data.data.tipo_moradia || '',
              experiencia_pets: data.data.experiencia_pets || ''
            });
          }
        } catch (error) {
          console.error('Erro ao carregar perfil:', error);
        }
      }
    };
    loadProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:3002/api/users/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Perfil atualizado com sucesso!');
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        setError(data.error || 'Erro ao atualizar perfil');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{ 
              width: 60, 
              height: 60, 
              bgcolor: 'primary.main',
              fontSize: 24,
              mr: 3
            }}
          >
            {formData.nome.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1">
              ✏️ Editar Perfil
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Atualize suas informações pessoais
            </Typography>
          </Box>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome Completo"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Moradia</InputLabel>
                <Select
                  name="tipo_moradia"
                  value={formData.tipo_moradia}
                  label="Tipo de Moradia"
                  onChange={handleChange}
                >
                  <MenuItem value="casa">Casa</MenuItem>
                  <MenuItem value="apartamento">Apartamento</MenuItem>
                  <MenuItem value="chacara">Chácara</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Experiência com Pets</InputLabel>
                <Select
                  name="experiencia_pets"
                  value={formData.experiencia_pets}
                  label="Experiência com Pets"
                  onChange={handleChange}
                >
                  <MenuItem value="nenhuma">Nenhuma - Nunca tive pets</MenuItem>
                  <MenuItem value="pouca">Pouca - Tive pets na infância ou por pouco tempo</MenuItem>
                  <MenuItem value="media">Média - Já cuidei de pets por alguns anos</MenuItem>
                  <MenuItem value="muita">Muita - Tenho/tive pets por mais de 5 anos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/profile')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ flexGrow: 1 }}
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EditProfile;