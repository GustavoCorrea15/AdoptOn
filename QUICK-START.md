# ⚡ Quick Start - Sistema de Adoção Responsável

## 🚀 Instalação em 1 Comando

### Windows
```cmd
install.bat
```

### Linux/macOS
```bash
chmod +x install.sh && ./install.sh
```

## 📋 Pré-requisitos Mínimos

- **Docker Desktop** (obrigatório)
- **Node.js 18+** (para app mobile)
- **Git** (para clonar repositório)

## ⚡ Scripts Disponíveis

```bash
# Instalar todas as dependências
npm run install-all

# Iniciar sistema completo
npm run setup

# Apenas iniciar containers
npm run dev

# Parar sistema
npm run stop

# Reset completo (apaga dados)
npm run reset

# App mobile
npm run mobile

# Ver logs
npm run logs
```

## 🌐 Acessos Rápidos

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3002  
- **Banco**: localhost:5432

## 👤 Login Rápido

```
Adotante: joao@email.com / 123456
ONG: ong@email.com / 123456
Admin: admin@email.com / 123456
```

## 🔧 Comandos Úteis

```bash
# Ver status dos containers
docker-compose ps

# Entrar no container backend
docker-compose exec backend bash

# Backup do banco
docker-compose exec postgres pg_dump -U postgres sistema_adocao > backup.sql

# Limpar Docker
npm run clean
```

## 🐛 Problemas Comuns

### Porta ocupada
```bash
# Verificar processos
netstat -tulpn | grep :3000
netstat -tulpn | grep :3002

# Parar containers
docker-compose down
```

### Erro de permissão (Linux/macOS)
```bash
sudo chown -R $USER:$USER .
chmod +x install.sh
```

### Cache do Docker
```bash
docker system prune -a
docker-compose up --build
```

---

**🎉 Em menos de 5 minutos seu sistema estará funcionando!**