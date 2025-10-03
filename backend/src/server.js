const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIo = require('socket.io');
const session = require('express-session');
require('dotenv').config();

// Middlewares de segurança
const { apiLimiter } = require('./middleware/rateLimiter');
const { validateInput } = require('./middleware/inputValidation');
const { generateCSRFToken, sanitizeInput } = require('./middleware/security');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const animalRoutes = require('./routes/animals');
const ongRoutes = require('./routes/ongs');
const adoptionRoutes = require('./routes/adoptions');
const matchingRoutes = require('./routes/matching');
const chatRoutes = require('./routes/chat');
const favoriteRoutes = require('./routes/favorites');
const adminRoutes = require('./routes/admin');
const csrfRoutes = require('./routes/csrf');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middlewares de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

const crypto = require('crypto');
const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

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

// Aplicar rate limiting
app.use('/api/', apiLimiter);

// Aplicar validação de entrada
app.use(validateInput);
app.use(sanitizeInput);
app.use(generateCSRFToken);

// Socket.io para chat em tempo real
io.on('connection', (socket) => {
  try {
    console.log('Usuário conectado:', socket.id);
  
  // Entrar em sala de chat
  socket.on('join_chat', (data) => {
    if (!data || !data.userId || !data.participantId || !data.animalId) return;
    
    const { userId, participantId, animalId } = data;
    const roomId = `chat_${Math.min(userId, participantId)}_${Math.max(userId, participantId)}_${animalId}`;
    socket.join(roomId);
    socket.userId = userId;
    socket.roomId = roomId;
    console.log(`Usuário ${userId} entrou na sala ${roomId}`);
  });
  
  // Enviar mensagem
  socket.on('send_message', (data) => {
    try {
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
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  });
  
  // Marcar como digitando
  socket.on('typing', (data) => {
    try {
      if (socket.roomId && socket.userId) {
        socket.to(socket.roomId).emit('user_typing', {
          userId: socket.userId,
          isTyping: data.isTyping
        });
      }
    } catch (error) {
      console.error('Erro ao processar typing:', error);
    }
  });
  
    socket.on('disconnect', () => {
      console.log('Usuário desconectado:', socket.id);
    });
  } catch (error) {
    console.error('Erro na conexão Socket.IO:', error);
  }
});

// Disponibilizar io para as rotas
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rotas
app.use('/api', csrfRoutes);
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
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});