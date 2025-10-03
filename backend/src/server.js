const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const animalRoutes = require('./routes/animals');
const ongRoutes = require('./routes/ongs');
const adoptionRoutes = require('./routes/adoptions');
const matchingRoutes = require('./routes/matching');
const chatRoutes = require('./routes/chat');
const favoriteRoutes = require('./routes/favorites');
const adminRoutes = require('./routes/admin');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middlewares
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:19006'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Socket.io para chat em tempo real
io.on('connection', (socket) => {
  console.log('Usuário conectado:', socket.id);
  
  // Entrar em sala de chat
  socket.on('join_chat', (data) => {
    const { userId, participantId, animalId } = data;
    const roomId = `chat_${Math.min(userId, participantId)}_${Math.max(userId, participantId)}_${animalId}`;
    socket.join(roomId);
    socket.userId = userId;
    socket.roomId = roomId;
    console.log(`Usuário ${userId} entrou na sala ${roomId}`);
  });
  
  // Enviar mensagem
  socket.on('send_message', (data) => {
    const { destinatarioId, animalId, conteudo, remetenteId, remetenteName } = data;
    const roomId = `chat_${Math.min(remetenteId, destinatarioId)}_${Math.max(remetenteId, destinatarioId)}_${animalId}`;
    
    const messageData = {
      id: Date.now(),
      remetente_id: remetenteId,
      destinatario_id: destinatarioId,
      animal_id: animalId,
      conteudo,
      sender_name: remetenteName,
      created_at: new Date().toISOString(),
      tipo_mensagem: 'text',
      lida: false
    };
    
    // Enviar para todos na sala exceto o remetente
    socket.to(roomId).emit('receive_message', messageData);
    console.log(`Mensagem enviada na sala ${roomId}`);
  });
  
  // Marcar como digitando
  socket.on('typing', (data) => {
    socket.to(socket.roomId).emit('user_typing', {
      userId: socket.userId,
      isTyping: data.isTyping
    });
  });
  
  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

// Disponibilizar io para as rotas
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/ongs', ongRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Algo deu errado!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});