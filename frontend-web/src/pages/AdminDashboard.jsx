import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalAnimais: 0,
    totalONGs: 0,
    adocoesRealizadas: 0
  });
  const [users, setUsers] = useState([]);
  const [pendingOngs, setPendingOngs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDialog, setUserDialog] = useState(false);
  const [ongDialog, setOngDialog] = useState(false);
  const [selectedOng, setSelectedOng] = useState(null);
  const [alert, setAlert] = useState(null);

  const API_URL = 'http://localhost:3002/api';

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const fetchPendingOngs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/ongs/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setPendingOngs(data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar ONGs pendentes:', error);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ativo: !currentStatus })
      });
      const data = await response.json();
      if (data.success) {
        setAlert({ type: 'success', message: 'Status do usuário atualizado!' });
        fetchUsers();
        setUserDialog(false);
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Erro ao atualizar usuário' });
    }
  };

  const verifyOng = async (ongId, verified) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/ongs/${ongId}/verify`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ verificada: verified })
      });
      const data = await response.json();
      if (data.success) {
        setAlert({ 
          type: 'success', 
          message: verified ? 'ONG aprovada!' : 'ONG rejeitada!' 
        });
        fetchPendingOngs();
        setOngDialog(false);
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Erro ao verificar ONG' });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchUsers(), fetchPendingOngs()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (user?.tipo_usuario !== 'admin') {
    return (
      <Container>
        <Typography variant="h4" color="error">
          Acesso negado. Apenas administradores podem acessar esta página.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        🛠️ Painel Administrativo
      </Typography>

      {/* Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total de Usuários
              </Typography>
              <Typography variant="h4" component="div">
                {stats.totalUsuarios}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Animais Cadastrados
              </Typography>
              <Typography variant="h4" component="div">
                {stats.totalAnimais}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                ONGs Ativas
              </Typography>
              <Typography variant="h4" component="div">
                {stats.totalONGs}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Adoções Realizadas
              </Typography>
              <Typography variant="h4" component="div">
                {stats.adocoesRealizadas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {alert && (
        <Alert 
          severity={alert.type} 
          onClose={() => setAlert(null)}
          sx={{ mb: 2 }}
        >
          {alert.message}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Tabs */}
          <Box sx={{ mb: 4 }}>
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
              <Tab label="Usuários" />
              <Tab label={`ONGs Pendentes (${pendingOngs.length})`} />
            </Tabs>
          </Box>

          {/* Conteúdo das Tabs */}
          {tabValue === 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Gerenciar Usuários
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.nome}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Chip 
                              label={user.tipo_usuario} 
                              color={user.tipo_usuario === 'ong' ? 'primary' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={user.ativo ? 'Ativo' : 'Inativo'} 
                              color={user.ativo ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="small" 
                              onClick={() => {
                                setSelectedUser(user);
                                setUserDialog(true);
                              }}
                            >
                              Gerenciar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {tabValue === 1 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ONGs Aguardando Aprovação
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>CNPJ</TableCell>
                        <TableCell>Data</TableCell>
                        <TableCell>Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingOngs.map((ong) => (
                        <TableRow key={ong.id}>
                          <TableCell>{ong.nome_fantasia}</TableCell>
                          <TableCell>{ong.email}</TableCell>
                          <TableCell>{ong.cnpj}</TableCell>
                          <TableCell>
                            {new Date(ong.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="small" 
                              onClick={() => {
                                setSelectedOng(ong);
                                setOngDialog(true);
                              }}
                            >
                              Revisar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Dialog Usuário */}
      <Dialog open={userDialog} onClose={() => setUserDialog(false)}>
        <DialogTitle>Gerenciar Usuário</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Typography><strong>Nome:</strong> {selectedUser.nome}</Typography>
              <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
              <Typography><strong>Tipo:</strong> {selectedUser.tipo_usuario}</Typography>
              <FormControlLabel
                control={
                  <Switch 
                    checked={selectedUser.ativo}
                    onChange={(e) => toggleUserStatus(selectedUser.id, selectedUser.ativo)}
                  />
                }
                label={selectedUser.ativo ? 'Usuário Ativo' : 'Usuário Inativo'}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog ONG */}
      <Dialog open={ongDialog} onClose={() => setOngDialog(false)}>
        <DialogTitle>Revisar ONG</DialogTitle>
        <DialogContent>
          {selectedOng && (
            <Box>
              <Typography><strong>Nome:</strong> {selectedOng.nome_fantasia}</Typography>
              <Typography><strong>Email:</strong> {selectedOng.email}</Typography>
              <Typography><strong>CNPJ:</strong> {selectedOng.cnpj}</Typography>
              <Typography><strong>Descrição:</strong> {selectedOng.descricao}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOngDialog(false)}>Cancelar</Button>
          <Button 
            color="error" 
            onClick={() => verifyOng(selectedOng.id, false)}
          >
            Rejeitar
          </Button>
          <Button 
            variant="contained" 
            onClick={() => verifyOng(selectedOng.id, true)}
          >
            Aprovar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;