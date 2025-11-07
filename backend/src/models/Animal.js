const pool = require('../config/database');

// Dados simulados para desenvolvimento
const memoryDB = {
  animals: [
    {
      id: 1,
      nome: 'Mel',
      especie: 'cao',
      raca: 'SRD',
      idade: 36,
      sexo: 'femea',
      porte: 'medio',
      peso: 15.5,
      cor: 'Caramelo',
      descricao: 'Mel é uma cachorrinha muito carinhosa e brincalhona. Adora crianças e se dá bem com outros animais.',
      personalidade: 'Carinhosa, brincalhona, sociável',
      nivel_energia: 'medio',
      sociabilidade: 'alta',
      temperamento: 'docil',
      castrado: true,
      vacinado: true,
      vermifugado: true,
      microchip: false,
      ong_nome: 'ONG Amigos dos Animais',
      ong_cidade: 'São Paulo',
      ong_telefone: '(11) 1234-5678',
      ong_email: 'contato@amigosanimais.org',
      fotos: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop'],
      compatibility_score: 85,
      observacoes_medicas: 'Animal saudável, sem restrições médicas.',
      status: 'disponivel'
    },
    {
      id: 2,
      nome: 'Tom',
      especie: 'gato',
      raca: 'SRD',
      idade: 24,
      sexo: 'macho',
      porte: 'pequeno',
      peso: 4.2,
      cor: 'Cinza',
      descricao: 'Tom é um gato calmo e independente, perfeito para apartamentos. Muito carinhoso com seus tutores.',
      personalidade: 'Calmo, independente, carinhoso',
      nivel_energia: 'baixo',
      sociabilidade: 'media',
      temperamento: 'calmo',
      castrado: true,
      vacinado: true,
      vermifugado: true,
      microchip: false,
      ong_nome: 'ONG Amigos dos Animais',
      ong_cidade: 'São Paulo',
      ong_telefone: '(11) 1234-5678',
      ong_email: 'contato@amigosanimais.org',
      fotos: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop'],
      compatibility_score: 92,
      observacoes_medicas: 'Animal saudável, sem restrições.',
      status: 'disponivel'
    },
    {
      id: 3,
      nome: 'Luna',
      especie: 'cao',
      raca: 'Labrador',
      idade: 48,
      sexo: 'femea',
      porte: 'grande',
      peso: 25.0,
      cor: 'Dourado',
      descricao: 'Luna é uma cadela adulta, muito tranquila e obediente. Ideal para famílias com experiência.',
      personalidade: 'Tranquila, obediente, leal',
      nivel_energia: 'medio',
      sociabilidade: 'alta',
      temperamento: 'docil',
      castrado: true,
      vacinado: true,
      vermifugado: true,
      microchip: true,
      ong_nome: 'Abrigo Esperança',
      ong_cidade: 'Rio de Janeiro',
      ong_telefone: '(21) 2222-3333',
      ong_email: 'contato@abrigoesperanca.org',
      fotos: ['https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=400&fit=crop'],
      compatibility_score: 78,
      observacoes_medicas: 'Animal saudável, precisa de exercícios regulares.',
      status: 'disponivel'
    },
    {
      id: 4,
      nome: 'Rex',
      especie: 'cao',
      raca: 'Pastor Alemão',
      idade: 60,
      sexo: 'macho',
      porte: 'grande',
      peso: 32.0,
      cor: 'Preto e Marrom',
      descricao: 'Rex é um cão protetor e leal, ideal para casas com quintal.',
      personalidade: 'Protetor, leal, inteligente',
      nivel_energia: 'alto',
      sociabilidade: 'media',
      temperamento: 'protetor',
      castrado: true,
      vacinado: true,
      vermifugado: true,
      microchip: true,
      ong_nome: 'Proteção Animal SP',
      ong_cidade: 'São Paulo',
      ong_telefone: '(11) 4444-5555',
      ong_email: 'contato@protecaosp.org',
      fotos: ['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600&h=400&fit=crop'],
      compatibility_score: 88,
      observacoes_medicas: 'Animal saudável, precisa de espaço para exercitar.',
      status: 'disponivel'
    },
    {
      id: 5,
      nome: 'Mimi',
      especie: 'gato',
      raca: 'Persa',
      idade: 18,
      sexo: 'femea',
      porte: 'pequeno',
      peso: 3.8,
      cor: 'Branco',
      descricao: 'Mimi é uma gatinha muito dócil e carinhosa.',
      personalidade: 'Dócil, carinhosa, tranquila',
      nivel_energia: 'baixo',
      sociabilidade: 'alta',
      temperamento: 'docil',
      castrado: true,
      vacinado: true,
      vermifugado: true,
      microchip: false,
      ong_nome: 'Gatinhos do Bem',
      ong_cidade: 'Rio de Janeiro',
      ong_telefone: '(21) 1111-2222',
      ong_email: 'contato@gatinhos.org',
      fotos: ['https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=400&fit=crop'],
      compatibility_score: 95,
      observacoes_medicas: 'Animal saudável, precisa de escovação regular.',
      status: 'disponivel'
    },
    {
      id: 6,
      nome: 'Bob',
      especie: 'cao',
      raca: 'Bulldog',
      idade: 42,
      sexo: 'macho',
      porte: 'medio',
      peso: 18.5,
      cor: 'Marrom',
      descricao: 'Bob é um cão tranquilo e companheiro.',
      personalidade: 'Tranquilo, companheiro, amoroso',
      nivel_energia: 'baixo',
      sociabilidade: 'alta',
      temperamento: 'docil',
      castrado: true,
      vacinado: true,
      vermifugado: true,
      microchip: true,
      ong_nome: 'Amigos de Quatro Patas',
      ong_cidade: 'Belo Horizonte',
      ong_telefone: '(31) 3333-4444',
      ong_email: 'contato@4patas.org',
      fotos: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop'],
      compatibility_score: 82,
      observacoes_medicas: 'Animal saudável, cuidado com o calor excessivo.',
      status: 'disponivel'
    }
  ]
};

class Animal {
  static async create(animalData) {
    const {
      nome, especie, raca, idade, sexo, porte, peso,
      cor, descricao, personalidade, nivel_energia,
      sociabilidade, cuidados_especiais, castrado,
      vacinado, vermifugado, microchip, observacoes_medicas,
      ong_id, fotos, temperamento, necessidades_especiais
    } = animalData;

    const query = `
      INSERT INTO animais (
        nome, especie, raca, idade, sexo, porte, peso,
        cor, descricao, personalidade, nivel_energia,
        sociabilidade, cuidados_especiais, castrado,
        vacinado, vermifugado, microchip, observacoes_medicas,
        ong_id, fotos, temperamento, necessidades_especiais,
        status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, 'disponivel', NOW(), NOW())
      RETURNING *
    `;

    const values = [
      nome, especie, raca, idade, sexo, porte, peso,
      cor, descricao, personalidade, nivel_energia,
      sociabilidade, cuidados_especiais, castrado,
      vacinado, vermifugado, microchip, observacoes_medicas,
      ong_id, JSON.stringify(fotos), temperamento, necessidades_especiais
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM animais WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findAvailable(filters = {}) {
    let query = 'SELECT * FROM animais WHERE status = $1';
    const values = ['disponivel'];
    let paramCount = 2;
    
    if (filters.especie) {
      query += ` AND especie = $${paramCount}`;
      values.push(filters.especie);
      paramCount++;
    }
    
    if (filters.porte) {
      query += ` AND porte = $${paramCount}`;
      values.push(filters.porte);
      paramCount++;
    }
    
    if (filters.sexo) {
      query += ` AND sexo = $${paramCount}`;
      values.push(filters.sexo);
      paramCount++;
    }
    
    query += ' ORDER BY created_at DESC';
    
    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(parseInt(filters.limit));
    }
    
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findByOng(ongId, status = null) {
    let query = 'SELECT * FROM animais WHERE ong_id = $1';
    const values = [ongId];
    
    if (status) {
      query += ' AND status = $2';
      values.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async updateStatus(id, status, adotante_id = null) {
    let query = 'UPDATE animais SET status = $1, updated_at = NOW()';
    const values = [status];
    let paramCount = 2;
    
    if (adotante_id) {
      query += `, adotante_id = $${paramCount}`;
      values.push(adotante_id);
      paramCount++;
    }
    
    query += ` WHERE id = $${paramCount} RETURNING *`;
    values.push(id);
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async addMedicalRecord(animalId, recordData) {
    const {
      tipo_procedimento, data_procedimento, veterinario,
      observacoes, proximo_agendamento
    } = recordData;

    const query = `
      INSERT INTO historico_medico (
        animal_id, tipo_procedimento, data_procedimento,
        veterinario, observacoes, proximo_agendamento,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;

    const values = [
      animalId, tipo_procedimento, data_procedimento,
      veterinario, observacoes, proximo_agendamento
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getMedicalHistory(animalId) {
    const query = `
      SELECT * FROM historico_medico 
      WHERE animal_id = $1 
      ORDER BY data_procedimento DESC
    `;
    
    const result = await pool.query(query, [animalId]);
    return result.rows;
  }

  static async getMatchingAnimals(userId, limit = 10) {
    const query = `
      SELECT * FROM animais 
      WHERE status = 'disponivel' 
      ORDER BY created_at DESC 
      LIMIT $1
    `;
    
    const result = await pool.query(query, [limit]);
    return result.rows;
  }
}

module.exports = Animal;