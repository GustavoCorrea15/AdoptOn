# 🚀 Guia de Deploy - AdoptiON v2.0.0

## 📋 Pré-requisitos

### 🐳 **Docker (Recomendado)**
- Docker Desktop 4.0+
- Docker Compose 2.0+
- 4GB RAM disponível
- 10GB espaço em disco

### 🖥️ **Manual**
- Node.js 20+ (frontend)
- Node.js 18+ (backend)
- PostgreSQL 15+
- npm 10+

## 🚀 Deploy Automático

### Windows
```cmd
install.bat
```

### Linux/macOS
```bash
chmod +x install.sh
./install.sh
```

## 🔧 Deploy Manual

### 1. Clonar e Instalar
```bash
git clone <repo-url>
cd AdoptiON
npm run install-all
```

### 2. Configurar Ambiente
```bash
# Backend
cp backend/.env.example backend/.env

# Editar variáveis:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=adoption_db
DB_USER=postgres
DB_PASSWORD=sua_senha_segura
JWT_SECRET=seu_jwt_secret_muito_seguro
SESSION_SECRET=seu_session_secret_muito_seguro
```

### 3. Banco de Dados
```bash
# Inicializar
npm run init-db

# Popular dados
npm run populate
npm run populate-chat
```

### 4. Executar
```bash
# Desenvolvimento
npm run dev

# Produção
npm run start
```

## 🐳 Deploy com Docker

### Desenvolvimento
```bash
docker-compose up --build
```

### Produção
```bash
# Configurar .env para produção
NODE_ENV=production

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 🌐 Acessos

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3002
- **PostgreSQL**: localhost:5432

## 👤 Usuários Padrão

```
Adotante: joao@email.com / 123456
ONG: ong@email.com / 123456
Admin: admin@email.com / 123456
```

## 🔒 Configurações de Segurança

### Produção Obrigatório
```env
NODE_ENV=production
JWT_SECRET=<64-char-random-string>
SESSION_SECRET=<64-char-random-string>
DB_PASSWORD=<senha-forte>
```

### SSL/HTTPS
```bash
# Nginx proxy reverso recomendado
# Certificado Let's Encrypt
```

## 📊 Monitoramento

### Health Check
```bash
curl http://localhost:3002/health
```

### Logs
```bash
# Docker
docker-compose logs -f

# Manual
npm run logs
```

## 🛑 Parar Sistema

```bash
# Docker
docker-compose down

# Manual
Ctrl+C nos terminais
```

## 🔄 Atualizações

```bash
# Backup banco
pg_dump adoption_db > backup.sql

# Atualizar código
git pull origin main

# Rebuild
docker-compose up --build -d
```

## 🆘 Troubleshooting

### Porta em Uso
```bash
# Verificar portas
netstat -tulpn | grep :3000
netstat -tulpn | grep :3002

# Matar processo
kill -9 <PID>
```

### Banco não Conecta
```bash
# Verificar PostgreSQL
docker-compose logs postgres

# Reiniciar
docker-compose restart postgres
```

### Frontend não Carrega
```bash
# Verificar Node.js
node --version  # Deve ser 20+

# Limpar cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```