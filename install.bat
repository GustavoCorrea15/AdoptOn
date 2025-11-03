@echo off
REM Script de instalação automática - AdoptiON (Windows)
echo 🐕❤️ Instalando AdoptiON...

REM Verificar se Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker não encontrado. Instale Docker Desktop primeiro.
    echo 📥 Download: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo ✅ Docker encontrado

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js encontrado
    
) else (
    echo ⚠️ Node.js não encontrado.
    echo 📥 Para desenvolvimento local, instale Node.js: https://nodejs.org/
)

REM Construir e iniciar sistema
echo 🚀 Construindo e iniciando sistema...
docker-compose up --build -d

REM Aguardar serviços iniciarem
echo ⏳ Aguardando serviços iniciarem...
timeout /t 15 /nobreak >nul

REM Inicializar banco de dados
echo 🗄️ Inicializando banco de dados...
docker-compose exec backend npm run init-db

REM Popular com dados de exemplo
echo 📊 Populando com dados de exemplo...
docker-compose exec backend node populate-db.js

REM Popular chat de exemplo
echo 💬 Criando conversas de exemplo...
docker-compose exec backend npm run populate-chat

echo.
echo 🎉 Instalação concluída com sucesso!
echo.
echo 🌐 Acessos:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3002
echo    Banco:    localhost:5432
echo.
echo 👤 Usuários de teste:
echo    Adotante: joao@email.com / 123456
echo    ONG:      ong@email.com / 123456
echo    Admin:    admin@email.com / 123456
echo.

echo 🛑 Para parar o sistema:
echo    docker-compose down
echo.
pause