-- Sistema de Adoção Responsável de Animais
-- Schema do Banco de Dados PostgreSQL

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários (adotantes, ONGs, veterinários)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    tipo_usuario VARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('adotante', 'ong', 'admin')),
    
    -- Dados de endereço
    endereco TEXT,
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Perfil do adotante
    tipo_moradia VARCHAR(20) CHECK (tipo_moradia IN ('casa', 'apartamento', 'chacara', 'outro')),
    tamanho_moradia VARCHAR(20) CHECK (tamanho_moradia IN ('pequeno', 'medio', 'grande')),
    tem_quintal BOOLEAN DEFAULT FALSE,
    experiencia_pets VARCHAR(20) CHECK (experiencia_pets IN ('nenhuma', 'pouca', 'media', 'muita')),
    tempo_disponivel VARCHAR(20) CHECK (tempo_disponivel IN ('pouco', 'medio', 'muito')),
    renda_familiar DECIMAL(10, 2),
    motivacao_adocao TEXT,
    preferencias_animal JSONB,
    
    -- Status e controle
    ativo BOOLEAN DEFAULT TRUE,
    verificado BOOLEAN DEFAULT FALSE,
    mfa_habilitado BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de ONGs
CREATE TABLE ongs (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    nome_fantasia VARCHAR(255) NOT NULL,
    razao_social VARCHAR(255),
    cnpj VARCHAR(18) UNIQUE,
    descricao TEXT,
    site VARCHAR(255),
    instagram VARCHAR(100),
    facebook VARCHAR(100),
    
    -- Dados de contato
    telefone_principal VARCHAR(20),
    telefone_secundario VARCHAR(20),
    email_contato VARCHAR(255),
    
    -- Endereço
    endereco TEXT,
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(10),
    
    -- Capacidade e estatísticas
    capacidade_maxima INTEGER,
    animais_atuais INTEGER DEFAULT 0,
    total_adocoes INTEGER DEFAULT 0,
    
    -- Status
    verificada BOOLEAN DEFAULT FALSE,
    ativa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de animais
CREATE TABLE animais (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    especie VARCHAR(50) NOT NULL CHECK (especie IN ('cao', 'gato', 'outro')),
    raca VARCHAR(100),
    idade INTEGER, -- em meses
    sexo VARCHAR(10) CHECK (sexo IN ('macho', 'femea')),
    porte VARCHAR(20) CHECK (porte IN ('pequeno', 'medio', 'grande', 'gigante')),
    peso DECIMAL(5, 2),
    cor VARCHAR(100),
    
    -- Características comportamentais
    descricao TEXT,
    personalidade TEXT,
    nivel_energia VARCHAR(20) CHECK (nivel_energia IN ('baixo', 'medio', 'alto', 'muito_alto')),
    sociabilidade VARCHAR(20) CHECK (sociabilidade IN ('baixa', 'media', 'alta')),
    temperamento VARCHAR(50),
    
    -- Cuidados e saúde
    cuidados_especiais BOOLEAN DEFAULT FALSE,
    necessidades_especiais TEXT,
    castrado BOOLEAN DEFAULT FALSE,
    vacinado BOOLEAN DEFAULT FALSE,
    vermifugado BOOLEAN DEFAULT FALSE,
    microchip BOOLEAN DEFAULT FALSE,
    observacoes_medicas TEXT,
    
    -- Relacionamentos
    ong_id INTEGER REFERENCES ongs(id) ON DELETE CASCADE,
    adotante_id INTEGER REFERENCES usuarios(id),
    
    -- Mídia
    fotos JSONB, -- Array de URLs das fotos
    videos JSONB, -- Array de URLs dos vídeos
    
    -- Status e controle
    status VARCHAR(20) DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'em_processo', 'adotado', 'indisponivel')),
    data_entrada DATE DEFAULT CURRENT_DATE,
    data_adocao DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de favoritos
CREATE TABLE favoritos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    animal_id INTEGER REFERENCES animais(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Evitar duplicatas
    UNIQUE(usuario_id, animal_id)
);

-- Tabela de processos de adoção
CREATE TABLE processos_adocao (
    id SERIAL PRIMARY KEY,
    animal_id INTEGER REFERENCES animais(id) ON DELETE CASCADE,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    mensagem TEXT,
    
    -- Status do processo
    status VARCHAR(30) DEFAULT 'iniciado' CHECK (status IN (
        'iniciado', 'documentacao_pendente', 'entrevista_agendada', 
        'entrevista_realizada', 'visita_agendada', 'visita_realizada',
        'aprovado', 'reprovado', 'finalizado', 'cancelado'
    )),
    
    -- Dados do processo
    data_inicio DATE DEFAULT CURRENT_DATE,
    data_finalizacao DATE,
    observacoes TEXT,
    motivo_reprovacao TEXT,
    
    -- Documentação
    documentos_enviados JSONB,
    documentos_aprovados BOOLEAN DEFAULT FALSE,
    
    -- Agendamentos
    data_entrevista TIMESTAMP,
    data_visita TIMESTAMP,
    
    -- Avaliação
    score_compatibilidade INTEGER,
    avaliacao_ong TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de acompanhamento pós-adoção
CREATE TABLE acompanhamentos (
    id SERIAL PRIMARY KEY,
    processo_adocao_id INTEGER REFERENCES processos_adocao(id) ON DELETE CASCADE,
    animal_id INTEGER REFERENCES animais(id),
    adotante_id INTEGER REFERENCES usuarios(id),
    ong_id INTEGER REFERENCES ongs(id),
    
    -- Dados do acompanhamento
    tipo_acompanhamento VARCHAR(30) CHECK (tipo_acompanhamento IN (
        'ligacao', 'visita', 'questionario', 'foto', 'video'
    )),
    data_acompanhamento DATE DEFAULT CURRENT_DATE,
    observacoes TEXT,
    
    -- Avaliação do bem-estar
    animal_adaptado BOOLEAN,
    problemas_reportados TEXT,
    necessita_intervencao BOOLEAN DEFAULT FALSE,
    
    -- Mídia
    fotos JSONB,
    videos JSONB,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de histórico médico
CREATE TABLE historico_medico (
    id SERIAL PRIMARY KEY,
    animal_id INTEGER REFERENCES animais(id) ON DELETE CASCADE,
    veterinario_id INTEGER REFERENCES usuarios(id),
    
    -- Dados do procedimento
    tipo_procedimento VARCHAR(50) NOT NULL,
    data_procedimento DATE NOT NULL,
    veterinario VARCHAR(255),
    clinica VARCHAR(255),
    
    -- Detalhes
    observacoes TEXT,
    medicamentos TEXT,
    proximo_agendamento DATE,
    
    -- Documentos
    receitas JSONB,
    exames JSONB,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de mensagens/chat
CREATE TABLE mensagens (
    id SERIAL PRIMARY KEY,
    remetente_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    destinatario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    animal_id INTEGER REFERENCES animais(id) ON DELETE CASCADE,
    processo_adocao_id INTEGER REFERENCES processos_adocao(id),
    
    -- Conteúdo
    conteudo TEXT NOT NULL,
    tipo_mensagem VARCHAR(20) DEFAULT 'texto' CHECK (tipo_mensagem IN ('texto', 'imagem', 'arquivo')),
    arquivo_url VARCHAR(500),
    
    -- Status
    lida BOOLEAN DEFAULT FALSE,
    data_leitura TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de avaliações e feedback
CREATE TABLE avaliacoes (
    id SERIAL PRIMARY KEY,
    processo_adocao_id INTEGER REFERENCES processos_adocao(id) ON DELETE CASCADE,
    avaliador_id INTEGER REFERENCES usuarios(id),
    avaliado_id INTEGER REFERENCES usuarios(id),
    
    -- Avaliação
    nota INTEGER CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    aspectos_positivos TEXT,
    aspectos_negativos TEXT,
    recomendaria BOOLEAN,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de eventos e agendamentos
CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    tipo_evento VARCHAR(30) CHECK (tipo_evento IN (
        'entrevista', 'visita', 'consulta_veterinaria', 
        'acompanhamento', 'evento_ong', 'feira_adocao'
    )),
    
    -- Participantes
    organizador_id INTEGER REFERENCES usuarios(id),
    participantes JSONB, -- Array de IDs dos participantes
    
    -- Data e local
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP,
    local VARCHAR(255),
    endereco TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'agendado' CHECK (status IN (
        'agendado', 'confirmado', 'realizado', 'cancelado', 'reagendado'
    )),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de doações
CREATE TABLE doacoes (
    id SERIAL PRIMARY KEY,
    doador_id INTEGER REFERENCES usuarios(id),
    ong_id INTEGER REFERENCES ongs(id) ON DELETE CASCADE,
    
    -- Dados da doação
    tipo_doacao VARCHAR(20) CHECK (tipo_doacao IN ('dinheiro', 'racao', 'medicamento', 'outro')),
    valor DECIMAL(10, 2),
    descricao TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmada', 'cancelada')),
    data_doacao DATE DEFAULT CURRENT_DATE,
    
    -- Pagamento
    forma_pagamento VARCHAR(30),
    comprovante_url VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para otimização
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX idx_usuarios_cidade ON usuarios(cidade);
CREATE INDEX idx_animais_status ON animais(status);
CREATE INDEX idx_animais_especie ON animais(especie);
CREATE INDEX idx_animais_ong ON animais(ong_id);
CREATE INDEX idx_processos_status ON processos_adocao(status);
CREATE INDEX idx_mensagens_conversa ON mensagens(remetente_id, destinatario_id);
CREATE INDEX idx_eventos_data ON eventos(data_inicio);
CREATE INDEX idx_favoritos_usuario ON favoritos(usuario_id);
CREATE INDEX idx_processos_usuario ON processos_adocao(usuario_id);

-- Triggers para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ongs_updated_at BEFORE UPDATE ON ongs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_animais_updated_at BEFORE UPDATE ON animais
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_processos_updated_at BEFORE UPDATE ON processos_adocao
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para calcular distância entre coordenadas
CREATE OR REPLACE FUNCTION calcular_distancia(lat1 DECIMAL, lon1 DECIMAL, lat2 DECIMAL, lon2 DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
    RETURN (
        6371 * acos(
            cos(radians(lat1)) * cos(radians(lat2)) * 
            cos(radians(lon2) - radians(lon1)) + 
            sin(radians(lat1)) * sin(radians(lat2))
        )
    );
END;
$$ LANGUAGE plpgsql;