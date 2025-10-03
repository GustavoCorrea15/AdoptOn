const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../config/database');

// Adicionar aos favoritos
router.post('/', auth, async (req, res) => {
  try {
    const { animal_id } = req.body;
    const user_id = req.user.id;

    // Verificar se já está nos favoritos
    const existing = await pool.query(
      'SELECT * FROM favoritos WHERE usuario_id = $1 AND animal_id = $2',
      [user_id, animal_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Animal já está nos favoritos'
      });
    }

    // Adicionar aos favoritos
    await pool.query(
      'INSERT INTO favoritos (usuario_id, animal_id) VALUES ($1, $2)',
      [user_id, animal_id]
    );

    res.json({
      success: true,
      message: 'Animal adicionado aos favoritos'
    });
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Remover dos favoritos
router.delete('/:animal_id', auth, async (req, res) => {
  try {
    const { animal_id } = req.params;
    const user_id = req.user.id;

    await pool.query(
      'DELETE FROM favoritos WHERE usuario_id = $1 AND animal_id = $2',
      [user_id, animal_id]
    );

    res.json({
      success: true,
      message: 'Animal removido dos favoritos'
    });
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Listar favoritos do usuário
router.get('/', auth, async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(`
      SELECT a.*, f.created_at as favorited_at
      FROM animais a
      JOIN favoritos f ON a.id = f.animal_id
      WHERE f.usuario_id = $1
      ORDER BY f.created_at DESC
    `, [user_id]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Verificar se animal é favorito
router.get('/check/:animal_id', auth, async (req, res) => {
  try {
    const { animal_id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      'SELECT * FROM favoritos WHERE usuario_id = $1 AND animal_id = $2',
      [user_id, animal_id]
    );

    res.json({
      success: true,
      isFavorite: result.rows.length > 0
    });
  } catch (error) {
    console.error('Erro ao verificar favorito:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;