# Diagrama de Classes - Sistema de Adoção Responsável

```mermaid
classDiagram
    class Usuario {
        +int id
        +string nome
        +string email
        +string senha
        +string telefone
        +string tipo_usuario
        +string endereco
        +string cidade
        +string estado
        +string cep
        +decimal latitude
        +decimal longitude
        +string tipo_moradia
        +string tamanho_moradia
        +boolean tem_quintal
        +string experiencia_pets
        +string tempo_disponivel
        +decimal renda_familiar
        +text motivacao_adocao
        +jsonb preferencias_animal
        +boolean ativo
        +boolean verificado
        +datetime created_at
        +datetime updated_at
        +login()
        +register()
        +updateProfile()
        +verificarCompatibilidade()
    }

    class ONG {
        +int id
        +int usuario_id
        +string nome_fantasia
        +string razao_social
        +string cnpj
        +text descricao
        +string site
        +string instagram
        +string facebook
        +string telefone_principal
        +string telefone_secundario
        +string email_contato
        +text endereco
        +string cidade
        +string estado
        +string cep
        +int capacidade_maxima
        +int animais_atuais
        +int total_adocoes
        +boolean verificada
        +boolean ativa
        +datetime created_at
        +datetime updated_at
        +cadastrarAnimal()
        +gerenciarProcessos()
        +avaliarAdotante()
    }

    class Animal {
        +int id
        +string nome
        +string especie
        +string raca
        +int idade
        +string sexo
        +string porte
        +decimal peso
        +string cor
        +text descricao
        +text personalidade
        +string nivel_energia
        +string sociabilidade
        +string temperamento
        +boolean cuidados_especiais
        +text necessidades_especiais
        +boolean castrado
        +boolean vacinado
        +boolean vermifugado
        +boolean microchip
        +text observacoes_medicas
        +int ong_id
        +int adotante_id
        +jsonb fotos
        +jsonb videos
        +string status
        +date data_entrada
        +date data_adocao
        +datetime created_at
        +datetime updated_at
        +calcularCompatibilidade()
        +atualizarStatus()
    }

    class ProcessoAdocao {
        +int id
        +int animal_id
        +int adotante_id
        +int ong_id
        +string status
        +date data_inicio
        +date data_finalizacao
        +text observacoes
        +text motivo_reprovacao
        +jsonb documentos_enviados
        +boolean documentos_aprovados
        +datetime data_entrevista
        +datetime data_visita
        +int score_compatibilidade
        +text avaliacao_ong
        +text mensagem
        +datetime created_at
        +datetime updated_at
        +iniciarProcesso()
        +atualizarStatus()
        +agendarEntrevista()
        +agendarVisita()
        +finalizar()
    }

    class Favorito {
        +int id
        +int usuario_id
        +int animal_id
        +datetime created_at
        +adicionar()
        +remover()
        +listar()
    }

    class HistoricoMedico {
        +int id
        +int animal_id
        +int veterinario_id
        +string tipo_procedimento
        +date data_procedimento
        +string veterinario
        +string clinica
        +text observacoes
        +text medicamentos
        +date proximo_agendamento
        +jsonb receitas
        +jsonb exames
        +datetime created_at
        +adicionarProcedimento()
        +atualizarHistorico()
    }

    class Mensagem {
        +int id
        +int remetente_id
        +int destinatario_id
        +int processo_adocao_id
        +text conteudo
        +string tipo_mensagem
        +string arquivo_url
        +boolean lida
        +datetime data_leitura
        +datetime created_at
        +enviar()
        +marcarComoLida()
    }

    class Avaliacao {
        +int id
        +int processo_adocao_id
        +int avaliador_id
        +int avaliado_id
        +int nota
        +text comentario
        +text aspectos_positivos
        +text aspectos_negativos
        +boolean recomendaria
        +datetime created_at
        +avaliar()
        +calcularMediaAvaliacoes()
    }

    class Evento {
        +int id
        +string titulo
        +text descricao
        +string tipo_evento
        +int organizador_id
        +jsonb participantes
        +datetime data_inicio
        +datetime data_fim
        +string local
        +text endereco
        +string status
        +datetime created_at
        +datetime updated_at
        +agendar()
        +cancelar()
        +reagendar()
    }

    class Doacao {
        +int id
        +int doador_id
        +int ong_id
        +string tipo_doacao
        +decimal valor
        +text descricao
        +string status
        +date data_doacao
        +string forma_pagamento
        +string comprovante_url
        +datetime created_at
        +processar()
        +confirmar()
    }

    class Acompanhamento {
        +int id
        +int processo_adocao_id
        +int animal_id
        +int adotante_id
        +int ong_id
        +string tipo_acompanhamento
        +date data_acompanhamento
        +text observacoes
        +boolean animal_adaptado
        +text problemas_reportados
        +boolean necessita_intervencao
        +jsonb fotos
        +jsonb videos
        +datetime created_at
        +registrar()
        +avaliarBemEstar()
    }

    %% Relacionamentos
    Usuario ||--o{ ONG : "pode ser"
    Usuario ||--o{ Animal : "adota"
    Usuario ||--o{ ProcessoAdocao : "participa"
    Usuario ||--o{ Favorito : "tem"
    Usuario ||--o{ Mensagem : "envia/recebe"
    Usuario ||--o{ Avaliacao : "avalia/é avaliado"
    Usuario ||--o{ Evento : "organiza/participa"
    Usuario ||--o{ Doacao : "faz"
    Usuario ||--o{ Acompanhamento : "participa"

    ONG ||--o{ Animal : "cuida"
    ONG ||--o{ ProcessoAdocao : "gerencia"
    ONG ||--o{ Doacao : "recebe"

    Animal ||--o{ ProcessoAdocao : "está em"
    Animal ||--o{ Favorito : "é favoritado"
    Animal ||--o{ HistoricoMedico : "tem"
    Animal ||--o{ Acompanhamento : "é acompanhado"

    ProcessoAdocao ||--o{ Mensagem : "gera"
    ProcessoAdocao ||--o{ Avaliacao : "resulta em"
    ProcessoAdocao ||--o{ Acompanhamento : "gera"

    Usuario ||--o{ HistoricoMedico : "veterinário registra"
```