import React, { useState } from 'react';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    tipo_usuario: 'adotante',
    cidade: '',
    tipo_moradia: '',
    experiencia_pets: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    try {
      const response = await fetch('http://localhost:3002/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        const userData = data.data.user;
        const token = data.data.token;
        localStorage.setItem('token', token);
        login(userData, token);
        navigate('/');
      } else {
        setError(data.error || 'Erro ao criar conta');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, position: 'relative' }}>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            🎆 Criar Conta 🐾
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Cadastre-se para adotar um animal
          </Typography>
        </Box>

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
                label="Senha"
                name="senha"
                type="password"
                value={formData.senha}
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
                <InputLabel>Tipo de Usuário</InputLabel>
                <Select
                  name="tipo_usuario"
                  value={formData.tipo_usuario}
                  label="Tipo de Usuário"
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="adotante">Adotante</MenuItem>
                  <MenuItem value="ong">ONG</MenuItem>
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 4 }}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
          

        </form>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2">
            Já tem uma conta?{' '}
            <Button
              variant="text"
              onClick={() => navigate('/login')}
            >
              Faça login
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;