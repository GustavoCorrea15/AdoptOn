# 📋 Changelog - AdoptiON

## [v2.0.0] - 2024-10-03

### 🔒 **Segurança**
- ✅ Corrigidas todas as vulnerabilidades críticas e altas
- ✅ Implementado sistema CSRF com tokens
- ✅ Rate limiting para prevenir ataques de força bruta
- ✅ Sanitização de entrada contra XSS e SQL injection
- ✅ Headers de segurança com Helmet.js
- ✅ Cookies seguros com configuração condicional
- ✅ Validação rigorosa de entrada de dados

### 🛠️ **Correções Técnicas**
- ✅ Corrigido import bcrypt → bcryptjs no AuthController
- ✅ Criado AnimalController que estava faltando
- ✅ Atualizado Node.js para v20 no frontend
- ✅ Downgrade Vite para versão compatível (4.5.0)
- ✅ Corrigidas variáveis duplicadas no User.js
- ✅ Otimizações de performance nos modelos

### 🐳 **Docker & Deploy**
- ✅ Containers funcionando corretamente
- ✅ PostgreSQL 15 configurado e healthy
- ✅ Backend rodando na porta 3002
- ✅ Frontend rodando na porta 3000
- ✅ Volumes persistentes para dados

### 📦 **Dependências**
- ✅ Atualizadas dependências de segurança
- ✅ Removidas vulnerabilidades de pacotes
- ✅ Configurado .npmrc para auditoria
- ✅ Legacy peer deps para compatibilidade

### 🎯 **Funcionalidades**
- ✅ Sistema de chat em tempo real funcionando
- ✅ Autenticação JWT segura
- ✅ CRUD completo de animais
- ✅ Sistema de favoritos
- ✅ Algoritmo de compatibilidade
- ✅ Dashboard administrativo

## [v1.0.0] - 2024-09-XX

### 🚀 **Lançamento Inicial**
- Sistema básico de adoção
- Interface React com Material-UI
- Backend Node.js + Express
- Banco PostgreSQL
- App mobile React Native