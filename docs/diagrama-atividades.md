# Diagramas de Atividades - Sistema de Adoção Responsável

## 1. Fluxo de Adoção Completo

```mermaid
flowchart TD
    A[Início] --> B[Usuário acessa sistema]
    B --> C{Usuário logado?}
    C -->|Não| D[Fazer login/registro]
    C -->|Sim| E[Navegar pelos animais]
    D --> E
    
    E --> F[Visualizar detalhes do animal]
    F --> G{Interessado?}
    G -->|Não| E
    G -->|Sim| H[Manifestar interesse]
    
    H --> I[Preencher formulário]
    I --> J[Enviar solicitação]
    J --> K[ONG recebe notificação]
    
    K --> L{ONG analisa perfil}
    L -->|Reprovado| M[Notificar reprovação]
    L -->|Aprovado| N[Agendar entrevista]
    
    N --> O[Realizar entrevista]
    O --> P{Entrevista aprovada?}
    P -->|Não| M
    P -->|Sim| Q[Agendar visita]
    
    Q --> R[Realizar visita]
    R --> S{Visita aprovada?}
    S -->|Não| M
    S -->|Sim| T[Finalizar adoção]
    
    T --> U[Iniciar acompanhamento]
    U --> V[Fim]
    M --> V
```

## 2. Processo de Cadastro de Animal

```mermaid
flowchart TD
    A[ONG acessa painel] --> B[Clicar 'Cadastrar Animal']
    B --> C[Preencher dados básicos]
    C --> D[Nome, espécie, raça, idade]
    D --> E[Características físicas]
    E --> F[Peso, cor, porte]
    F --> G[Informações comportamentais]
    G --> H[Energia, sociabilidade, temperamento]
    H --> I[Cuidados médicos]
    I --> J[Vacinado, castrado, vermifugado]
    J --> K[Upload de fotos]
    K --> L{Fotos válidas?}
    L -->|Não| M[Mostrar erro]
    M --> K
    L -->|Sim| N[Adicionar descrição]
    N --> O[Revisar informações]
    O --> P{Dados corretos?}
    P -->|Não| C
    P -->|Sim| Q[Salvar animal]
    Q --> R[Sistema calcula compatibilidade]
    R --> S[Animal disponível para adoção]
    S --> T[Fim]
```

## 3. Sistema de Matching/Compatibilidade

```mermaid
flowchart TD
    A[Usuário visualiza animal] --> B[Sistema coleta dados do usuário]
    B --> C[Tipo de moradia]
    C --> D[Experiência com pets]
    D --> E[Tempo disponível]
    E --> F[Preferências declaradas]
    F --> G[Sistema coleta dados do animal]
    G --> H[Nível de energia]
    H --> I[Sociabilidade]
    I --> J[Necessidades especiais]
    J --> K[Porte e espaço necessário]
    K --> L[Calcular score de compatibilidade]
    
    L --> M{Moradia compatível?}
    M -->|Casa com quintal + cão grande| N[+20 pontos]
    M -->|Apartamento + gato| O[+15 pontos]
    M -->|Incompatível| P[-10 pontos]
    
    N --> Q{Experiência compatível?}
    O --> Q
    P --> Q
    Q -->|Muita experiência + animal especial| R[+15 pontos]
    Q -->|Pouca experiência + animal dócil| S[+10 pontos]
    Q -->|Incompatível| T[-5 pontos]
    
    R --> U[Somar pontuações]
    S --> U
    T --> U
    U --> V{Score >= 70?}
    V -->|Sim| W[Compatibilidade Alta]
    V -->|50-69| X[Compatibilidade Média]
    V -->|< 50| Y[Compatibilidade Baixa]
    
    W --> Z[Exibir resultado]
    X --> Z
    Y --> Z
    Z --> AA[Fim]
```

## 4. Processo de Verificação de Documentos

```mermaid
flowchart TD
    A[Usuário envia documentos] --> B[Sistema recebe arquivos]
    B --> C{Formato válido?}
    C -->|Não| D[Rejeitar - formato inválido]
    C -->|Sim| E[Armazenar temporariamente]
    E --> F[Notificar administrador]
    F --> G[Admin acessa painel]
    G --> H[Visualizar documentos]
    H --> I{Documentos válidos?}
    I -->|Não| J[Marcar como rejeitado]
    I -->|Sim| K[Marcar como aprovado]
    J --> L[Notificar usuário - rejeitado]
    K --> M[Notificar usuário - aprovado]
    L --> N[Usuário pode reenviar]
    M --> O[Conta verificada]
    N --> A
    O --> P[Fim]
    D --> Q[Usuário corrige formato]
    Q --> A
```

## 5. Fluxo de Doação

```mermaid
flowchart TD
    A[Usuário acessa página de doação] --> B[Escolher tipo de doação]
    B --> C{Tipo de doação}
    C -->|Dinheiro| D[Inserir valor]
    C -->|Ração/Medicamento| E[Descrever item]
    C -->|Outro| F[Descrever doação]
    
    D --> G[Escolher forma de pagamento]
    E --> H[Agendar entrega]
    F --> H
    
    G --> I{Forma de pagamento}
    I -->|PIX| J[Gerar QR Code]
    I -->|Cartão| K[Processar pagamento]
    I -->|Boleto| L[Gerar boleto]
    
    J --> M[Aguardar confirmação]
    K --> N{Pagamento aprovado?}
    L --> M
    
    N -->|Sim| O[Confirmar doação]
    N -->|Não| P[Notificar erro]
    M --> Q{Comprovante enviado?}
    Q -->|Sim| O
    Q -->|Não| R[Aguardar comprovante]
    
    H --> S[ONG confirma recebimento]
    S --> O
    O --> T[Registrar doação]
    T --> U[Enviar agradecimento]
    U --> V[Fim]
    P --> W[Tentar novamente]
    W --> G
    R --> X[Lembrete automático]
    X --> Q
```

## 6. Sistema de Notificações

```mermaid
flowchart TD
    A[Evento ocorre no sistema] --> B{Tipo de evento}
    B -->|Nova mensagem| C[Notificação de chat]
    B -->|Status de adoção| D[Notificação de processo]
    B -->|Novo animal| E[Notificação de match]
    B -->|Lembrete| F[Notificação de acompanhamento]
    
    C --> G[Identificar destinatário]
    D --> G
    E --> G
    F --> G
    
    G --> H[Verificar preferências do usuário]
    H --> I{Notificação habilitada?}
    I -->|Não| J[Não enviar]
    I -->|Sim| K{Usuário online?}
    
    K -->|Sim| L[Push notification em tempo real]
    K -->|Não| M[Armazenar para entrega posterior]
    
    L --> N[Marcar como entregue]
    M --> O[Usuário faz login]
    O --> P[Entregar notificações pendentes]
    P --> N
    
    N --> Q[Usuário visualiza]
    Q --> R{Ação requerida?}
    R -->|Sim| S[Redirecionar para ação]
    R -->|Não| T[Marcar como lida]
    
    S --> U[Executar ação]
    U --> T
    T --> V[Fim]
    J --> V
```