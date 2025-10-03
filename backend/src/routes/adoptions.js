const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../config/database');

// Manifestar interesse em adoção
router.post('/interest', auth, async (req, res) => {
  try {
    const { animal_id, mensagem } = req.body;
    const user_id = req.user.id;
    
    // Verificar se já manifestou interesse
    const existing = await pool.query(
      'SELECT * FROM processos_adocao WHERE adotante_id = $1 AND animal_id = $2',
      [user_id, animal_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Você já manifestou interesse neste animal'
      });
    }

    // Inserir processo de adoção
    const result = await pool.query(`
      INSERT INTO processos_adocao (adotante_id, animal_id, mensagem)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [user_id, animal_id, mensagem]);

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Interesse manifestado com sucesso! A ONG entrará em contato em breve.'
    });
  } catch (error) {
    console.error('Erro ao manifestar interesse:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Listar processos de adoção do usuário
router.get('/my-processes', auth, async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(`
      SELECT p.*, a.nome as animal_nome, a.fotos as animal_fotos, 
             o.nome_fantasia as ong_nome, o.telefone_principal as ong_telefone
      FROM processos_adocao p
      JOIN animais a ON p.animal_id = a.id
      JOIN ongs o ON a.ong_id = o.id
      WHERE p.adotante_id = $1
      ORDER BY p.data_inicio DESC
    `, [user_id]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erro ao buscar processos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Verificar se já manifestou interesse
router.get('/check-interest/:animal_id', auth, async (req, res) => {
  try {
    const { animal_id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      'SELECT * FROM processos_adocao WHERE adotante_id = $1 AND animal_id = $2',
      [user_id, animal_id]
    );

    res.json({
      success: true,
      hasInterest: result.rows.length > 0
    });
  } catch (error) {
    console.error('Erro ao verificar interesse:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;