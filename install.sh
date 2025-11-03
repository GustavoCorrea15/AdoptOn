#!/bin/bash

# Script de instalação automática - AdoptiON
echo "🐕❤️ Instalando AdoptiON..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Instale Docker Desktop primeiro."
    echo "📥 Download: https://www.docker.com/products/docker-desktop/"
    exit 1
fi

# Verificar se Docker Compose está disponível
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose não encontrado."
    exit 1
fi

echo "✅ Docker encontrado"

# Verificar se Node.js está instalado (para mobile)
if command -v node &> /dev/null; then
    echo "✅ Node.js encontrado: $(node --version)"
    
else
    echo "⚠️ Node.js não encontrado."
    echo "📥 Para desenvolvimento local, instale Node.js: https://nodejs.org/"
fi

# Construir e iniciar sistema
echo "🚀 Construindo e iniciando sistema..."
docker-compose up --build -d

# Aguardar serviços iniciarem
echo "⏳ Aguardando serviços iniciarem..."
sleep 10

# Inicializar banco de dados
echo "🗄️ Inicializando banco de dados..."
docker-compose exec -T backend npm run init-db

# Popular com dados de exemplo
echo "📊 Populando com dados de exemplo..."
docker-compose exec -T backend node populate-db.js

# Popular chat de exemplo
echo "💬 Criando conversas de exemplo..."
docker-compose exec -T backend npm run populate-chat

echo ""
echo "🎉 Instalação concluída com sucesso!"
echo ""
echo "🌐 Acessos:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3002"
echo "   Banco:    localhost:5432"
echo ""
echo "👤 Usuários de teste:"
echo "   Adotante: joao@email.com / 123456"
echo "   ONG:      ong@email.com / 123456"
echo "   Admin:    admin@email.com / 123456"
echo ""

echo "🛑 Para parar o sistema:"
echo "   docker-compose down"