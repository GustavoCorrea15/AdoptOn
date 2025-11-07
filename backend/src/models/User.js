const pool = require('../config/database');
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
    
    const query = `
      INSERT INTO usuarios (
        nome, email, senha, telefone, tipo_usuario,
        endereco, cidade, estado, cep,
        tipo_moradia, tamanho_moradia, tem_quintal,
        experiencia_pets, tempo_disponivel, renda_familiar,
        motivacao_adocao, preferencias_animal
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING id, nome, email, tipo_usuario, created_at
    `;
    
    const values = [
      nome, email, hashedPassword, telefone, tipo_usuario,
      endereco, cidade, estado, cep,
      tipo_moradia, tamanho_moradia, tem_quintal,
      experiencia_pets, tempo_disponivel, renda_familiar,
      motivacao_adocao, JSON.stringify(preferencias_animal)
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, nome, email, telefone, tipo_usuario, endereco, cidade, estado, cep, tipo_moradia, tamanho_moradia, tem_quintal, experiencia_pets, tempo_disponivel, renda_familiar, motivacao_adocao, preferencias_animal, ativo, verificado, created_at, updated_at FROM usuarios WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateProfile(id, updateData) {
    const allowedFields = ['nome', 'telefone', 'endereco', 'cidade', 'estado', 'cep', 'tipo_moradia', 'tamanho_moradia', 'tem_quintal', 'experiencia_pets', 'tempo_disponivel', 'renda_familiar', 'motivacao_adocao', 'preferencias_animal'];
    
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && allowedFields.includes(key)) {
        fields.push(`${key} = $${paramCount}`);
        values.push(key === 'preferencias_animal' ? JSON.stringify(updateData[key]) : updateData[key]);
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

    const userResult = await pool.query(userQuery, [userId]);
    const animalResult = await pool.query(animalQuery, [animalId]);

    if (!userResult.rows[0] || !animalResult.rows[0]) {
      return 0;
    }

    const userData = userResult.rows[0];
    const animalData = animalResult.rows[0];
    
    let score = 0;
    let maxScore = 0;

    // Compatibilidade de moradia
    maxScore += 25;
    if (userData.tipo_moradia === 'casa' && userData.tem_quintal && animalData.porte === 'grande') {
      score += 25;
    } else if (userData.tipo_moradia === 'apartamento' && animalData.porte === 'pequeno') {
      score += 20;
    } else if (userData.tamanho_moradia === 'grande' && animalData.porte === 'medio') {
      score += 15;
    }

    // Compatibilidade de energia
    maxScore += 20;
    if (userData.tempo_disponivel === 'muito' && animalData.nivel_energia === 'alto') {
      score += 20;
    } else if (userData.tempo_disponivel === 'pouco' && animalData.nivel_energia === 'baixo') {
      score += 20;
    } else if (userData.tempo_disponivel === 'medio' && animalData.nivel_energia === 'medio') {
      score += 15;
    }

    // Experiência com pets
    maxScore += 15;
    if (userData.experiencia_pets === 'muita' || animalData.cuidados_especiais === false) {
      score += 15;
    } else if (userData.experiencia_pets === 'pouca' && animalData.cuidados_especiais === true) {
      score += 5;
    }

    return Math.round((score / maxScore) * 100);
  }
}

module.exports = User;