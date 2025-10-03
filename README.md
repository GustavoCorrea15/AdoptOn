# 🐕❤️ Sistema de Adoção Responsável de Animais

> **Conectando animais abandonados com famílias amorosas através da tecnologia**

## 🚀 Instalação Rápida

### 🖥️ **Instalação Automática**
```bash
# Windows
install.bat

# Linux/macOS
chmod +x install.sh
./install.sh
```

### ⚡ **Instalação Manual**
```bash
# 1. Clonar repositório
git clone <repo-url>
cd Sistema-de-adocao-responsavel-de-animais

# 2. Instalar todas as dependências
npm run install-all

# 3. Executar sistema completo
npm run setup
```

**📖 [Guia Completo de Instalação](INSTALACAO.md)**

### 🌐 Acesso
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3002
- **PostgreSQL**: localhost:5432

## ✨ Funcionalidades Principais

### 👥 **Gestão de Usuários**
- ✅ Cadastro e autenticação segura
- ✅ Perfis personalizados (Adotantes, ONGs, Admin)
- ✅ Sistema de compatibilidade inteligente
- ✅ Edição completa de perfil

### 🐾 **Catálogo de Animais**
- ✅ Listagem com filtros avançados
- ✅ Fotos e descrições detalhadas
- ✅ Sistema de favoritos
- ✅ Algoritmo de compatibilidade

### 💬 **Chat em Tempo Real**
- ✅ Comunicação direta Adotante ↔ ONG
- ✅ Mensagens instantâneas via WebSocket
- ✅ Histórico de conversas por animal
- ✅ Notificações de mensagens não lidas

### 🏠 **Processo de Adoção**
- ✅ Manifestação de interesse
- ✅ Acompanhamento do processo
- ✅ Integração com chat
- ✅ Dashboard para ONGs

## 💬 Sistema de Chat Avançado

**Comunicação em tempo real entre adotantes e ONGs sobre animais específicos**

### 🎯 **Como Funciona**
```
Adotante vê animal → Clica "💬 Chat" → Conversa iniciada → ONG responde → Adoção facilitada
```

### 🚀 **Formas de Iniciar Chat**
1. **Lista de Animais**: Botão "💬 Chat" para acesso rápido
2. **Detalhes do Animal**: "Conversar com ONG" com contexto
3. **Manifestar Interesse**: Chat automático ao demonstrar interesse

### ✨ **Recursos Técnicos**
- 🔄 **WebSocket**: Mensagens em tempo real
- 🎯 **Contextual**: Cada conversa vinculada a um animal
- 🔔 **Notificações**: Badges de mensagens não lidas
- 📱 **Responsivo**: Interface adaptável
- 💾 **Persistente**: Histórico completo salvo

## 🛠 Stack Tecnológico

### 🖥️ **Backend**
- **Node.js** + **Express**: API RESTful robusta
- **Socket.IO**: Comunicação em tempo real
- **PostgreSQL 15**: Banco relacional com JSONB
- **JWT**: Autenticação segura
- **Bcrypt**: Criptografia de senhas

### 🎨 **Frontend**
- **React 18**: Interface moderna e reativa
- **Material-UI**: Design system consistente
- **Vite**: Build tool otimizado
- **Socket.IO Client**: Chat em tempo real
- **React Router**: Navegação SPA

### 🐳 **DevOps**
- **Docker**: Containerização completa
- **Docker Compose**: Orquestração de serviços
- **PostgreSQL**: Banco em container

## 📁 Estrutura do Projeto

```
Sistema-de-adocao-responsavel-de-animais/
├── 🖥️ backend/                 # API Node.js + Socket.IO
│   ├── src/routes/            # Rotas da API
│   ├── src/models/            # Modelos de dados
│   └── src/config/            # Configurações
├── 🎨 frontend-web/           # Interface React
│   ├── src/pages/             # Páginas da aplicação
│   └── src/components/        # Componentes reutilizáveis
├── 📱 mobile-app/             # App React Native
│   ├── src/screens/           # Telas do app
│   ├── src/context/           # Contextos
│   └── src/components/        # Componentes mobile
├── 🗄️ database/               # Scripts SQL
├── 📚 docs/                   # Documentação técnica
└── 🐳 docker-compose.yml      # Orquestração
```

## 🎯 Casos de Uso

### 👤 **Para Adotantes**
1. **Descobrir**: Navegar catálogo com filtros inteligentes
2. **Compatibilidade**: Ver score de compatibilidade personalizado
3. **Favoritar**: Salvar animais de interesse
4. **Conversar**: Chat direto com ONGs responsáveis
5. **Adotar**: Processo guiado de adoção

### 🏢 **Para ONGs**
1. **Cadastrar**: Adicionar animais com fotos e detalhes
2. **Gerenciar**: Dashboard completo de animais
3. **Comunicar**: Responder interessados via chat
4. **Acompanhar**: Métricas de adoções e engajamento

## 📱 App Mobile

**Versão mobile completa desenvolvida com React Native + Expo**

### 🚀 **Executar App Mobile**
```bash
# Navegar para pasta mobile
cd mobile-app

# Instalar dependências
npm install

# Executar app
npm start

# Android
npm run android

# iOS
npm run ios
```

### ✨ **Funcionalidades Mobile**
- ✅ Autenticação completa
- ✅ Lista e busca de animais
- ✅ Chat em tempo real
- ✅ Sistema de favoritos
- ✅ Detalhes completos dos animais
- ✅ Perfil do usuário

## 🚀 Roadmap

### 📅 **Próximas Funcionalidades**
- [ ] 🔔 Notificações push
- [ ] 📸 Upload de múltiplas fotos
- [ ] 🎥 Videochamadas integradas
- [ ] 🤖 Chatbot para perguntas frequentes
- [ ] 📊 Analytics avançado
- [ ] 🌍 Geolocalização

---

**Desenvolvido com ❤️ para conectar animais e famílias**