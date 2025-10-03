# Diagramas de Sequência - Sistema de Adoção Responsável

## 1. Processo de Login

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant A as AuthContext

    U->>F: Insere email e senha
    F->>B: POST /api/auth/login
    B->>DB: SELECT * FROM usuarios WHERE email = ?
    DB-->>B: Dados do usuário
    B->>B: Verificar senha (bcrypt)
    B->>B: Gerar JWT token
    B-->>F: {success: true, user, token}
    F->>A: login(userData, token)
    A->>A: setUser({...userData, token})
    A->>A: localStorage.setItem('user', userData)
    F->>F: navigate('/')
    F-->>U: Redirecionamento para home
```

## 2. Processo de Manifestar Interesse

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant N as Notificação

    U->>F: Clica "Manifestar Interesse"
    F->>F: Abrir modal de mensagem
    U->>F: Escreve mensagem e confirma
    F->>B: POST /api/adoptions/interest
    Note over F,B: Headers: Authorization: Bearer {token}
    B->>B: Verificar token JWT
    B->>DB: SELECT * FROM processos_adocao WHERE adotante_id = ? AND animal_id = ?
    DB-->>B: Verificar se já existe interesse
    alt Já manifestou interesse
        B-->>F: {success: false, error: "Já manifestou interesse"}
        F-->>U: Exibir erro
    else Primeiro interesse
        B->>DB: INSERT INTO processos_adocao (adotante_id, animal_id, mensagem)
        DB-->>B: Processo criado
        B->>N: Enviar notificação para ONG
        B-->>F: {success: true, message: "Interesse manifestado"}
        F-->>U: Exibir sucesso
        F->>F: Fechar modal
    end
```

## 3. Processo de Favoritar Animal

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant B as Backend
    participant DB as Database

    U->>F: Clica no ícone de coração
    F->>B: GET /api/favorites/check/{animal_id}
    B->>DB: SELECT * FROM favoritos WHERE usuario_id = ? AND animal_id = ?
    DB-->>B: Status do favorito
    B-->>F: {success: true, isFavorite: boolean}
    
    alt Animal não é favorito
        F->>B: POST /api/favorites
        B->>DB: INSERT INTO favoritos (usuario_id, animal_id)
        DB-->>B: Favorito adicionado
        B-->>F: {success: true, message: "Adicionado aos favoritos"}
        F->>F: setIsFavorite(true)
        F-->>U: Coração preenchido
    else Animal já é favorito
        F->>B: DELETE /api/favorites/{animal_id}
        B->>DB: DELETE FROM favoritos WHERE usuario_id = ? AND animal_id = ?
        DB-->>B: Favorito removido
        B-->>F: {success: true, message: "Removido dos favoritos"}
        F->>F: setIsFavorite(false)
        F-->>U: Coração vazio
    end
```

## 4. Processo de Cadastro de Animal (ONG)

```mermaid
sequenceDiagram
    participant O as ONG
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant S as Storage
    participant AI as Sistema IA

    O->>F: Preenche formulário do animal
    O->>F: Faz upload de fotos
    F->>S: Upload das imagens
    S-->>F: URLs das imagens
    F->>B: POST /api/animals
    B->>B: Verificar permissões da ONG
    B->>DB: INSERT INTO animais (...)
    DB-->>B: Animal cadastrado
    B->>AI: Calcular score de compatibilidade
    AI-->>B: Scores calculados
    B->>DB: UPDATE animais SET compatibility_scores = ?
    B-->>F: {success: true, animal: {...}}
    F-->>O: Animal cadastrado com sucesso
```

## 5. Processo de Aprovação de Adoção

```mermaid
sequenceDiagram
    participant O as ONG
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant A as Adotante
    participant E as Email

    O->>F: Acessa painel de processos
    F->>B: GET /api/adoptions/processes
    B->>DB: SELECT processos WHERE ong_id = ?
    DB-->>B: Lista de processos
    B-->>F: {success: true, processes: [...]}
    F-->>O: Lista de processos pendentes

    O->>F: Clica "Aprovar" em um processo
    F->>B: PUT /api/adoptions/process/{id}/approve
    B->>DB: UPDATE processos_adocao SET status = 'aprovado'
    B->>DB: UPDATE animais SET status = 'adotado', adotante_id = ?
    DB-->>B: Status atualizado
    B->>E: Enviar email de aprovação
    E-->>A: Email de confirmação
    B-->>F: {success: true, message: "Adoção aprovada"}
    F-->>O: Confirmação de aprovação
```

## 6. Sistema de Chat em Tempo Real

```mermaid
sequenceDiagram
    participant A as Adotante
    participant F1 as Frontend A
    participant S as Socket.IO Server
    participant F2 as Frontend ONG
    participant O as ONG
    participant DB as Database

    A->>F1: Escreve mensagem
    F1->>S: socket.emit('send_message', {roomId, message, userId})
    S->>DB: INSERT INTO mensagens (remetente_id, destinatario_id, conteudo)
    S->>F2: socket.to(roomId).emit('receive_message', message)
    F2-->>O: Exibir nova mensagem
    O->>F2: Escreve resposta
    F2->>S: socket.emit('send_message', {roomId, message, userId})
    S->>DB: INSERT INTO mensagens (remetente_id, destinatario_id, conteudo)
    S->>F1: socket.to(roomId).emit('receive_message', message)
    F1-->>A: Exibir resposta da ONG
```

## 7. Processo de Acompanhamento Pós-Adoção

```mermaid
sequenceDiagram
    participant S as Sistema
    participant B as Backend
    participant DB as Database
    participant O as ONG
    participant A as Adotante
    participant E as Email

    S->>S: Cron job diário
    S->>B: Verificar adoções para acompanhamento
    B->>DB: SELECT * FROM processos_adocao WHERE status = 'finalizado' AND data_finalizacao < NOW() - INTERVAL '30 days'
    DB-->>B: Lista de adoções para acompanhar
    
    loop Para cada adoção
        B->>E: Enviar email de acompanhamento
        E-->>A: Email com formulário
        A->>B: Responder formulário de acompanhamento
        B->>DB: INSERT INTO acompanhamentos (...)
        B->>E: Notificar ONG sobre resposta
        E-->>O: Email com dados do acompanhamento
    end
```