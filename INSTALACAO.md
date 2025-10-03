# 🚀 Guia de Instalação - Sistema de Adoção Responsável

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Docker** (versão 20.10+)
- **Docker Compose** (versão 2.0+)
- **Git** (para clonar o repositório)

### Verificar Instalação
```bash
docker --version
docker-compose --version
git --version
```

## 🔧 Instalação Completa

### 1. **Clonar o Repositório**
```bash
git clone <repo-url>
cd Sistema-de-adocao-responsavel-de-animais
```

### 2. **Configurar Variáveis de Ambiente**
```bash
# Copiar arquivo de exemplo
cp backend/.env.example backend/.env

# Editar configurações (opcional - valores padrão funcionam)
# nano backend/.env
```

### 3. **Executar o Sistema**
```bash
# Construir e iniciar todos os serviços
docker-compose up --build

# Aguardar até ver as mensagens:
# ✅ Backend rodando na porta 3002
# ✅ Frontend rodando na porta 3000
# ✅ PostgreSQL pronto na porta 5432
```

### 4. **Inicializar Banco de Dados**
```bash
# Em outro terminal, executar:
docker-compose exec backend npm run init-db

# Aguardar mensagem: ✅ Banco inicializado com sucesso!
```

### 5. **Popular com Dados de Exemplo**
```bash
# Popular animais e usuários
docker-compose exec backend node populate-db.js

# Popular conversas de chat
docker-compose exec backend npm run populate-chat
```

## 🌐 Acessar o Sistema

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3002
- **Banco PostgreSQL**: localhost:5432

### Usuários de Teste
```
Adotante:
- Email: joao@email.com
- Senha: 123456

ONG:
- Email: ong@email.com  
- Senha: 123456

Admin:
- Email: admin@email.com
- Senha: 123456
```

## 🔄 Comandos Úteis

### Gerenciar Serviços
```bash
# Parar todos os serviços
docker-compose down

# Parar e limpar volumes (reset completo)
docker-compose down -v

# Ver logs em tempo real
docker-compose logs -f

# Executar apenas o banco
docker-compose up postgres

# Rebuild específico
docker-compose up --build backend
docker-compose up --build frontend
```

### Desenvolvimento
```bash
# Entrar no container do backend
docker-compose exec backend bash

# Entrar no container do frontend
docker-compose exec frontend bash

# Ver logs específicos
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### Banco de Dados
```bash
# Conectar ao PostgreSQL
docker-compose exec postgres psql -U postgres -d adocao_db

# Backup do banco
docker-compose exec postgres pg_dump -U postgres adocao_db > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U postgres adocao_db < backup.sql
```

## 🐛 Solução de Problemas

### Erro: "Port already in use"
```bash
# Verificar processos usando as portas
netstat -tulpn | grep :3000
netstat -tulpn | grep :3002
netstat -tulpn | grep :5432

# Parar processos ou alterar portas no docker-compose.yml
```

### Erro: "Database connection failed"
```bash
# Aguardar o PostgreSQL inicializar completamente
docker-compose logs postgres

# Reiniciar apenas o backend
docker-compose restart backend
```

### Erro: "Permission denied"
```bash
# No Linux/Mac, ajustar permissões
sudo chown -R $USER:$USER .
chmod +x backend/init-db.js
```

### Frontend não carrega
```bash
# Limpar cache do Docker
docker system prune -a

# Rebuild completo
docker-compose down -v
docker-compose up --build
```

## 📱 Testando o Sistema

### 1. **Cadastro e Login**
- Acesse http://localhost:3000
- Clique em "Cadastrar" 
- Crie uma conta como "Adotante"
- Faça login

### 2. **Explorar Animais**
- Navegue para "Animais"
- Veja a lista de pets disponíveis
- Clique em "Ver Detalhes" de um animal

### 3. **Testar Chat**
- Na página do animal, clique "Conversar com ONG"
- Digite uma mensagem
- Acesse o menu "💬 Chat" para ver a conversa

### 4. **Funcionalidades Adicionais**
- Favoritar animais (❤️)
- Manifestar interesse em adoção
- Editar perfil
- Ver compatibilidade com animais

## 🔧 Configurações Avançadas

### Alterar Portas
Edite `docker-compose.yml`:
```yaml
services:
  frontend:
    ports:
      - "3001:3000"  # Alterar porta do frontend
  backend:
    ports:
      - "3003:3002"  # Alterar porta do backend
```

### Configurar Email (Opcional)
Edite `backend/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
```

### Configurar AWS S3 (Opcional)
```env
AWS_ACCESS_KEY_ID=sua-access-key
AWS_SECRET_ACCESS_KEY=sua-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=seu-bucket
```

## 📊 Monitoramento

### Verificar Status dos Serviços
```bash
# Status dos containers
docker-compose ps

# Uso de recursos
docker stats

# Logs de erro
docker-compose logs --tail=50 backend | grep ERROR
```

### Métricas do Sistema
- **Animais cadastrados**: Visível no dashboard admin
- **Usuários ativos**: Logs do backend
- **Conversas de chat**: Banco de dados
- **Performance**: Docker stats

## 🔄 Atualizações

### Atualizar o Sistema
```bash
# Baixar atualizações
git pull origin main

# Rebuild com novas mudanças
docker-compose down
docker-compose up --build

# Aplicar migrações do banco (se houver)
docker-compose exec backend npm run migrate
```

### Backup Antes de Atualizar
```bash
# Backup completo
docker-compose exec postgres pg_dump -U postgres adocao_db > backup-$(date +%Y%m%d).sql

# Backup dos volumes
docker run --rm -v sistema-de-adocao-responsavel-de-animais_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/volumes-backup.tar.gz /data
```

## 🆘 Suporte

### Logs Importantes
```bash
# Logs completos
docker-compose logs > logs-completos.txt

# Logs específicos por erro
docker-compose logs backend | grep -i error
docker-compose logs frontend | grep -i error
```

### Reset Completo
```bash
# ⚠️ ATENÇÃO: Apaga todos os dados!
docker-compose down -v
docker system prune -a
docker-compose up --build
```

---

**🎉 Parabéns! Seu sistema está funcionando!**

Acesse http://localhost:3000 e comece a conectar animais com famílias amorosas! 🐕❤️🐱