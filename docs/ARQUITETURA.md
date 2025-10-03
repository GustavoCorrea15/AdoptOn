# 🏗️ Arquitetura do Sistema

## 📊 Visão Geral

```mermaid
graph TB
    subgraph "Frontend (React)"
        A[Interface Web] --> B[Socket.IO Client]
        A --> C[HTTP Client]
    end
    
    subgraph "Backend (Node.js)"
        D[Express API] --> E[Socket.IO Server]
        D --> F[Middleware Auth]
        D --> G[Routes]
    end
    
    subgraph "Database"
        H[(PostgreSQL)]
    end
    
    B <--> E
    C <--> D
    G --> H
    
    subgraph "Docker"
        I[Frontend Container]
        J[Backend Container]
        K[PostgreSQL Container]
    end
```

## 🔧 Componentes Principais

### 🎨 Frontend (React)
- **Framework**: React 18 com Hooks
- **UI Library**: Material-UI (MUI)
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: Context API + useState/useEffect
- **Real-time**: Socket.IO Client

### 🖥️ Backend (Node.js)
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Real-time**: Socket.IO Server
- **Authentication**: JWT + Bcrypt
- **Database ORM**: Raw SQL com pg (PostgreSQL)
- **Validation**: Joi

### 🗄️ Database (PostgreSQL)
- **Version**: PostgreSQL 15
- **Features**: JSONB, Triggers, Functions
- **Connection**: Pool de conexões
- **Migrations**: Scripts SQL manuais

## 🔄 Fluxo de Dados

### 1. Autenticação
```
Cliente → POST /api/auth/login → JWT Token → Headers Authorization
```

### 2. Chat em Tempo Real
```
Cliente A → Socket.IO → Servidor → Socket.IO → Cliente B
         ↓
    PostgreSQL (persistência)
```

### 3. API RESTful
```
Frontend → HTTP Request → Express Routes → PostgreSQL → Response → Frontend
```

## 📁 Estrutura de Pastas

```
backend/src/
├── config/
│   └── database.js          # Configuração PostgreSQL
├── middleware/
│   └── auth.js              # Middleware JWT
├── models/
│   ├── User.js              # Modelo de usuário
│   └── Animal.js            # Modelo de animal
├── routes/
│   ├── auth.js              # Autenticação
│   ├── users.js             # Usuários
│   ├── animals.js           # Animais
│   ├── chat.js              # Chat/Mensagens
│   ├── favorites.js         # Favoritos
│   └── adoptions.js         # Adoções
└── server.js                # Servidor principal

frontend-web/src/
├── components/
│   ├── Navbar.jsx           # Navegação
│   └── ProtectedRoute.jsx   # Rotas protegidas
├── context/
│   └── AuthContext.jsx      # Context de autenticação
├── hooks/
│   └── useFavorites.js      # Hook de favoritos
├── pages/
│   ├── Home.jsx             # Página inicial
│   ├── Animals.jsx          # Lista de animais
│   ├── AnimalDetail.jsx     # Detalhes do animal
│   ├── Chat.jsx             # Interface de chat
│   ├── Login.jsx            # Login
│   ├── Register.jsx         # Cadastro
│   └── Profile.jsx          # Perfil
└── App.jsx                  # Componente principal
```

## 🔐 Segurança

### Autenticação
- **JWT Tokens** com expiração
- **Bcrypt** para hash de senhas
- **Middleware** de autenticação em rotas protegidas

### Autorização
- **Role-based**: adotante, ong, admin
- **Resource-based**: usuário só acessa seus próprios dados
- **Chat**: validação de participantes

### Validação
- **Input sanitization** em todas as rotas
- **Joi schemas** para validação de dados
- **SQL injection** prevenção com prepared statements

## 🚀 Performance

### Frontend
- **Code splitting** com React.lazy
- **Memoization** com React.memo
- **Debounce** em filtros de busca
- **Image optimization** com lazy loading

### Backend
- **Connection pooling** PostgreSQL
- **Caching** de queries frequentes
- **Compression** middleware
- **Rate limiting** para APIs

### Database
- **Índices** otimizados
- **JSONB** para dados flexíveis
- **Triggers** para atualizações automáticas
- **Partitioning** para tabelas grandes (futuro)

## 🔄 Real-time (Socket.IO)

### Configuração
```javascript
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});
```

### Eventos
- **connection**: Usuário conecta
- **join_chat**: Entrar em sala de chat
- **send_message**: Enviar mensagem
- **receive_message**: Receber mensagem
- **disconnect**: Usuário desconecta

### Salas (Rooms)
```javascript
const roomId = `chat_${userId1}_${userId2}_${animalId}`;
socket.join(roomId);
```

## 🐳 Docker

### Containers
1. **frontend**: React app (porta 3000)
2. **backend**: Node.js API (porta 3002)
3. **postgres**: PostgreSQL DB (porta 5432)

### Volumes
- **postgres_data**: Persistência do banco
- **node_modules**: Cache de dependências

### Networks
- **app-network**: Comunicação entre containers

## 📊 Monitoramento

### Logs
- **Winston** para logs estruturados
- **Morgan** para logs HTTP
- **Console.log** para desenvolvimento

### Métricas
- **Docker stats** para recursos
- **PostgreSQL logs** para queries
- **Socket.IO debug** para conexões

## 🔧 Configuração

### Variáveis de Ambiente
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/db
DB_HOST=postgres
DB_PORT=5432
DB_NAME=adocao_db
DB_USER=postgres
DB_PASS=postgres

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Server
PORT=3002
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Optional
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=email@gmail.com
SMTP_PASS=password
```

## 🚀 Deploy

### Desenvolvimento
```bash
docker-compose up --build
```

### Produção
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### CI/CD (Futuro)
- **GitHub Actions** para testes
- **Docker Hub** para imagens
- **AWS/Heroku** para deploy
- **Nginx** como proxy reverso

## 🧪 Testes

### Estrutura (Planejada)
```
tests/
├── unit/
│   ├── models/
│   └── utils/
├── integration/
│   └── api/
└── e2e/
    └── cypress/
```

### Ferramentas
- **Jest** para testes unitários
- **Supertest** para testes de API
- **Cypress** para testes E2E
- **Testing Library** para componentes React

## 📈 Escalabilidade

### Horizontal
- **Load balancer** (Nginx)
- **Multiple instances** do backend
- **Redis** para sessões compartilhadas
- **CDN** para assets estáticos

### Vertical
- **Database optimization**
- **Caching layers** (Redis)
- **Connection pooling**
- **Query optimization**

## 🔮 Futuras Melhorias

### Técnicas
- [ ] **Microservices** architecture
- [ ] **GraphQL** API
- [ ] **Redis** caching
- [ ] **Elasticsearch** para busca
- [ ] **Message queues** (RabbitMQ)
- [ ] **Kubernetes** orchestration

### Funcionalidades
- [ ] **PWA** (Progressive Web App)
- [ ] **Mobile app** (React Native)
- [ ] **Push notifications**
- [ ] **Video calls** integration
- [ ] **AI/ML** recommendations
- [ ] **Blockchain** for transparency

---

**Arquitetura projetada para escalabilidade, performance e manutenibilidade**