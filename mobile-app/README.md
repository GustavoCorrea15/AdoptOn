# 📱 App Mobile - Sistema de Adoção Responsável

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+
- Expo CLI
- Android Studio (para Android) ou Xcode (para iOS)

### Instalação
```bash
# Instalar dependências
npm install

# Instalar Expo CLI globalmente (se não tiver)
npm install -g @expo/cli
```

### Execução
```bash
# Iniciar o servidor de desenvolvimento
npm start

# Executar no Android
npm run android

# Executar no iOS
npm run ios

# Executar no navegador
npm run web
```

## 📱 Funcionalidades

### ✅ Implementadas
- **Autenticação**: Login e cadastro
- **Lista de Animais**: Visualização de pets disponíveis
- **Busca**: Filtrar animais por nome, raça ou ONG
- **Detalhes**: Informações completas do animal
- **Chat**: Conversa em tempo real com ONGs
- **Favoritos**: Salvar animais de interesse
- **Perfil**: Visualizar dados do usuário

### 🔄 Em Desenvolvimento
- [ ] Edição de perfil
- [ ] Notificações push
- [ ] Upload de fotos
- [ ] Geolocalização
- [ ] Compartilhamento
- [ ] Modo offline

## 🏗️ Arquitetura

### Estrutura de Pastas
```
src/
├── context/
│   └── AuthContext.js      # Contexto de autenticação
├── screens/
│   ├── LoginScreen.js      # Tela de login
│   ├── RegisterScreen.js   # Tela de cadastro
│   ├── HomeScreen.js       # Tela inicial
│   ├── SearchScreen.js     # Tela de busca
│   ├── AnimalDetailScreen.js # Detalhes do animal
│   ├── ChatScreen.js       # Chat em tempo real
│   ├── FavoritesScreen.js  # Favoritos
│   └── ProfileScreen.js    # Perfil do usuário
├── components/             # Componentes reutilizáveis
├── services/              # Serviços de API
└── theme.js               # Tema do app
```

### Tecnologias
- **React Native**: Framework mobile
- **Expo**: Plataforma de desenvolvimento
- **React Native Paper**: UI Library
- **React Navigation**: Navegação
- **Socket.IO**: Chat em tempo real
- **Axios**: Cliente HTTP
- **AsyncStorage**: Armazenamento local

## 🔧 Configuração

### API Backend
O app se conecta ao backend em:
- **Desenvolvimento**: `http://10.0.2.2:3002` (Android Emulator)
- **iOS Simulator**: `http://localhost:3002`
- **Dispositivo físico**: Alterar para IP da máquina

### Alterar URL da API
Edite os arquivos de tela e altere:
```javascript
const API_URL = 'http://SEU_IP:3002/api';
const SOCKET_URL = 'http://SEU_IP:3002';
```

## 📱 Testando

### Emulador Android
1. Abrir Android Studio
2. Iniciar AVD (Android Virtual Device)
3. Executar `npm run android`

### Simulador iOS (macOS)
1. Abrir Xcode
2. Executar `npm run ios`

### Dispositivo Físico
1. Instalar Expo Go no dispositivo
2. Escanear QR code do terminal
3. Certificar que dispositivo e computador estão na mesma rede

## 🔐 Usuários de Teste

```
Adotante:
- Email: joao@email.com
- Senha: 123456

ONG:
- Email: ong@email.com
- Senha: 123456
```

## 🐛 Troubleshooting

### Erro de Conexão
- Verificar se backend está rodando
- Confirmar URL da API
- Verificar conectividade de rede

### Metro Bundler
```bash
# Limpar cache
npx expo start --clear

# Reset completo
rm -rf node_modules
npm install
```

### Android
```bash
# Limpar build
cd android
./gradlew clean
cd ..
```

## 📦 Build para Produção

### Android APK
```bash
# Build local
npx expo build:android

# EAS Build (recomendado)
npm install -g @expo/eas-cli
eas build --platform android
```

### iOS
```bash
# EAS Build
eas build --platform ios
```

## 🚀 Deploy

### Google Play Store
1. Gerar APK/AAB
2. Criar conta de desenvolvedor
3. Upload na Play Console

### Apple App Store
1. Gerar IPA
2. Upload via App Store Connect
3. Submeter para revisão

## 📊 Métricas

### Performance
- **Startup time**: < 3s
- **Navigation**: < 500ms
- **API calls**: < 2s

### Compatibilidade
- **Android**: 6.0+ (API 23+)
- **iOS**: 11.0+
- **Expo SDK**: 49.x

---

**📱 App desenvolvido com React Native + Expo para conectar animais e famílias!**