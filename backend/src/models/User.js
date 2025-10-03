const { memoryDB } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const {
      nome, email, senha, telefone, tipo_usuario,
      endereco, cidade, estado, cep,
      tipo_moradia, tamanho_moradia, tem_quintal,
      experiencia_pets, tempo_disponivel, renda_familiar,
      motivacao_adocao, preferencias_animal
    } = userData;

    const hashedPassword = await bcrypt.hash(senha, 10);
    
    const newUser = {
      id: memoryDB.users.length + 1,
      nome, email, senha: hashedPassword, telefone, tipo_usuario,
      endereco, cidade, estado, cep,
      tipo_moradia, tamanho_moradia, tem_quintal,
      experiencia_pets, tempo_disponivel, renda_familiar,
      motivacao_adocao, preferencias_animal,
      ativo: true,
      verificado: false,
      created_at: new Date()
    };
    
    memoryDB.users.push(newUser);
    return {
      id: newUser.id,
      nome: newUser.nome,
      email: newUser.email,
      tipo_usuario: newUser.tipo_usuario,
      created_at: newUser.created_at
    };
  }

  static async findByEmail(email) {
    return memoryDB.users.find(user => user.email === email);
  }

  static async findById(id) {
    const user = memoryDB.users.find(user => user.id === parseInt(id));
    if (user) {
      const { senha, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  static async updateProfile(id, updateData) {
    const allowedFields = ['nome', 'telefone', 'endereco', 'cidade', 'estado', 'cep', 'tipo_moradia', 'tamanho_moradia', 'tem_quintal', 'experiencia_pets', 'tempo_disponivel', 'renda_familiar', 'motivacao_adocao', 'preferencias_animal'];
    
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && allowedFields.includes(key)) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('Nenhum campo válido para atualizar');
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE usuarios 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, nome, email, tipo_usuario, updated_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async getCompatibilityScore(userId, animalId) {
    const userQuery = `
      SELECT tipo_moradia, tamanho_moradia, tem_quintal,
             experiencia_pets, tempo_disponivel, preferencias_animal
      FROM usuarios WHERE id = $1
    `;
    
    const animalQuery = `
      SELECT porte, nivel_energia, sociabilidade, cuidados_especiais,
             idade, temperamento, necessidades_especiais
      FROM animais WHERE id = $1
    `;

    const [userResult, animalResult] = await Promise.all([
      pool.query(userQuery, [userId]),
      pool.query(animalQuery, [animalId])
    ]);

    if (!userResult.rows[0] || !animalResult.rows[0]) {
      return 0;
    }

    const user = userResult.rows[0];
    const animal = animalResult.rows[0];
    
    let score = 0;
    let maxScore = 0;

    // Compatibilidade de moradia
    maxScore += 25;
    if (user.tipo_moradia === 'casa' && user.tem_quintal && animal.porte === 'grande') {
      score += 25;
    } else if (user.tipo_moradia === 'apartamento' && animal.porte === 'pequeno') {
      score += 20;
    } else if (user.tamanho_moradia === 'grande' && animal.porte === 'medio') {
      score += 15;
    }

    // Compatibilidade de energia
    maxScore += 20;
    if (user.tempo_disponivel === 'muito' && animal.nivel_energia === 'alto') {
      score += 20;
    } else if (user.tempo_disponivel === 'pouco' && animal.nivel_energia === 'baixo') {
      score += 20;
    } else if (user.tempo_disponivel === 'medio' && animal.nivel_energia === 'medio') {
      score += 15;
    }

    // Experiência com pets
    maxScore += 15;
    if (user.experiencia_pets === 'muita' || animal.cuidados_especiais === false) {
      score += 15;
    } else if (user.experiencia_pets === 'pouca' && animal.cuidados_especiais === true) {
      score += 5;
    }

    return Math.round((score / maxScore) * 100);
  }
}

module.exports = User;