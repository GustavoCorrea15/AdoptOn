# 🛠️ Guia do Administrador

## 🚀 Funcionalidades Implementadas

### ✅ **Painel Administrativo Completo**
- Dashboard com estatísticas em tempo real
- Gestão completa de usuários
- Sistema de aprovação de ONGs
- Relatórios de adoções

### 📊 **Estatísticas Disponíveis**
- Total de usuários ativos
- Animais cadastrados no sistema
- ONGs ativas e verificadas
- Adoções realizadas

### 👥 **Gestão de Usuários**
- Listar todos os usuários
- Ativar/desativar contas
- Filtrar por tipo (adotante, ONG, admin)
- Visualizar dados completos

### 🏢 **Aprovação de ONGs**
- Lista de ONGs pendentes
- Revisar informações completas
- Aprovar ou rejeitar cadastros
- Notificações automáticas

## 🔐 **Acesso Admin**

### **Credenciais Padrão**
```
Email: admin@sistema.com
Senha: admin123
```

### **Criar Admin Manualmente**
```sql
INSERT INTO usuarios (nome, email, senha, tipo_usuario, ativo, verificado)
VALUES ('Admin', 'admin@email.com', '$2a$10$hash...', 'admin', true, true);
```

## 🛠️ **Como Usar**

### **1. Executar Sistema**
```bash
# Iniciar sistema completo
npm run setup

# Ou apenas containers
docker-compose up -d
```

### **2. Criar Dados de Teste**
```bash
# No diretório backend
npm run test-admin
```

### **3. Acessar Painel**
- URL: http://localhost:3000/admin
- Login com credenciais admin
- Navegar pelas funcionalidades

## 📋 **Funcionalidades Detalhadas**

### **Dashboard Principal**
- **Estatísticas**: Métricas em tempo real do sistema
- **Ações Rápidas**: Links diretos para funcionalidades principais
- **Navegação**: Tabs para diferentes seções

### **Gestão de Usuários**
- **Listar**: Todos os usuários com paginação
- **Filtrar**: Por tipo de usuário
- **Status**: Ativar/desativar contas
- **Detalhes**: Visualizar informações completas

### **Aprovação de ONGs**
- **Pendentes**: Lista de ONGs aguardando aprovação
- **Revisar**: Dados completos da ONG
- **Aprovar/Rejeitar**: Com um clique
- **Histórico**: Acompanhar aprovações

### **Relatórios**
- **Adoções**: Por período e região
- **Usuários**: Crescimento e engajamento
- **ONGs**: Performance e estatísticas

## 🔧 **APIs Disponíveis**

### **Estatísticas**
```
GET /api/admin/stats
```

### **Usuários**
```
GET /api/admin/users
PATCH /api/admin/users/:id/status
```

### **ONGs**
```
GET /api/admin/ongs/pending
PATCH /api/admin/ongs/:id/verify
```

### **Relatórios**
```
GET /api/admin/reports/adoptions
```

## 🛡️ **Segurança**

### **Controle de Acesso**
- Middleware de autenticação JWT
- Verificação de tipo de usuário
- Proteção de rotas sensíveis

### **Validações**
- Todas as ações são validadas
- Logs de atividades admin
- Prevenção de ações maliciosas

## 🚨 **Troubleshooting**

### **Erro 403 - Acesso Negado**
- Verificar se usuário é tipo 'admin'
- Confirmar token JWT válido
- Checar permissões no banco

### **Dados não Carregam**
- Verificar conexão com banco
- Confirmar APIs rodando na porta 3002
- Checar logs do backend

### **ONGs não Aparecem**
- Verificar se existem ONGs pendentes
- Confirmar campo 'verificada = false'
- Executar script de teste

## 📞 **Suporte**

Para problemas ou dúvidas:
1. Verificar logs do sistema
2. Consultar documentação da API
3. Executar scripts de teste
4. Verificar configurações do banco

---

**🎯 Sistema Admin 100% Funcional e Operacional!**