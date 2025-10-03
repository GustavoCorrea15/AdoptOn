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

    // Simulação para memoryDB - em produção usar pool.query com prepared statements
    const newAnimal = {
      id: memoryDB.animals.length + 1,
      ...animalData,
      fotos: Array.isArray(fotos) ? fotos : [fotos],
      status: 'disponivel',
      created_at: new Date(),
      updated_at: new Date()
    };
    memoryDB.animals.push(newAnimal);
    return newAnimal;
  }

  static async findById(id) {
    return memoryDB.animals.find(animal => animal.id === parseInt(id));
  }

  static async findAvailable(filters = {}) {
    const animals = [];
    const limit = filters.limit ? parseInt(filters.limit) : memoryDB.animals.length;
    
    for (const animal of memoryDB.animals) {
      if (animals.length >= limit) break;
      
      if (animal.status !== 'disponivel') continue;
      if (filters.especie && animal.especie !== filters.especie) continue;
      if (filters.porte && animal.porte !== filters.porte) continue;
      if (filters.sexo && animal.sexo !== filters.sexo) continue;
      if (filters.cidade && !animal.ong_cidade.toLowerCase().includes(filters.cidade.toLowerCase())) continue;
      
      animals.push(animal);
    }
    
    return animals;
  }

  static async findByOng(ongId, status = null) {
    const ongIdNum = parseInt(ongId);
    const animals = [];
    
    for (const animal of memoryDB.animals) {
      if (animal.ong_id === ongIdNum && (!status || animal.status === status)) {
        animals.push(animal);
      }
    }
    
    return animals.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  static async updateStatus(id, status, adotante_id = null) {
    const animalId = parseInt(id);
    if (isNaN(animalId)) {
      throw new Error('ID do animal inválido');
    }
    
    const animalIndex = memoryDB.animals.findIndex(a => a.id === animalId);
    if (animalIndex === -1) {
      throw new Error('Animal não encontrado');
    }
    
    memoryDB.animals[animalIndex].status = status;
    if (adotante_id) memoryDB.animals[animalIndex].adotante_id = adotante_id;
    memoryDB.animals[animalIndex].updated_at = new Date();
    
    return memoryDB.animals[animalIndex];
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

    if (!animalId || !recordData) {
      throw new Error('Parâmetros obrigatórios ausentes');
    }
    
    try {
      const newRecord = {
        id: Date.now(),
        animal_id: parseInt(animalId),
        ...recordData,
        created_at: new Date()
      };
      return newRecord;
    } catch (error) {
      throw new Error('Erro ao adicionar registro médico: ' + error.message);
    }
  }

  static async getMedicalHistory(animalId) {
    const query = `
      SELECT * FROM historico_medico 
      WHERE animal_id = $1 
      ORDER BY data_procedimento DESC
    `;
    
    const animalIdNum = parseInt(animalId);
    return []; // Simulação - retorna array vazio
  }

  static async getMatchingAnimals(userId, limit = 10) {
    const userQuery = `
      SELECT tipo_moradia, tamanho_moradia, tem_quintal,
             experiencia_pets, tempo_disponivel, preferencias_animal,
             cidade
      FROM usuarios WHERE id = $1
    `;
    
    const animals = [];
    const maxLimit = Math.min(limit, memoryDB.animals.length);
    
    for (let i = 0; i < memoryDB.animals.length && animals.length < maxLimit; i++) {
      const animal = memoryDB.animals[i];
      if (animal.status === 'disponivel') {
        animals.push(animal);
      }
    }
    
    return animals;
  }
}

module.exports = Animal;