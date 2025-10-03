const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { csrfProtection } = require('../middleware/csrf');

// Aplicar middlewares em todas as rotas
router.use(auth);
router.use(adminAuth);
router.use(csrfProtection);

// Estatísticas gerais
router.get('/stats', async (req, res) => {
  try {
    const [usuarios, animais, ongs, adocoes] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM usuarios WHERE ativo = true'),
      pool.query('SELECT COUNT(*) FROM animais'),
      pool.query('SELECT COUNT(*) FROM ongs WHERE ativa = true'),
      pool.query('SELECT COUNT(*) FROM processos_adocao WHERE status = $1', ['finalizado'])
    ]);

    res.json({
      success: true,
      data: {
        totalUsuarios: parseInt(usuarios.rows[0].count),
        totalAnimais: parseInt(animais.rows[0].count),
        totalONGs: parseInt(ongs.rows[0].count),
        adocoesRealizadas: parseInt(adocoes.rows[0].count)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas'
    });
  }
});

// Listar usuários
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, tipo } = req.query;
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT id, nome, email, tipo_usuario, ativo, verificado, created_at 
      FROM usuarios 
      WHERE ($1::text IS NULL OR tipo_usuario = $1)
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    const params = [tipo || null, parseInt(limit), parseInt(offset)];
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar usuários'
    });
  }
});

// Ativar/desativar usuário
router.patch('/users/:id/status', async (req, res) => {
  try {
    const { ativo } = req.body;
    
    const result = await pool.query(
      'UPDATE usuarios SET ativo = $1, updated_at = NOW() WHERE id = $2 RETURNING id, nome, email, ativo',
      [ativo, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar usuário'
    });
  }
});

// Listar ONGs pendentes
router.get('/ongs/pending', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, u.nome, u.email, u.telefone 
      FROM ongs o 
      JOIN usuarios u ON o.usuario_id = u.id 
      WHERE o.verificada = false AND o.ativa = true
      ORDER BY o.created_at DESC
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar ONGs pendentes'
    });
  }
});

// Aprovar/rejeitar ONG
router.patch('/ongs/:id/verify', async (req, res) => {
  try {
    const { verificada } = req.body;
    
    const result = await pool.query(
      'UPDATE ongs SET verificada = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [verificada, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'ONG não encontrada'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao verificar ONG'
    });
  }
});

// Relatório de adoções
router.get('/reports/adoptions', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = `
      SELECT 
        DATE_TRUNC('month', pa.created_at) as mes,
        COUNT(*) as total_adocoes,
        AVG(pa.score_compatibilidade) as score_medio
      FROM processos_adocao pa 
      WHERE pa.status = 'finalizado'
        AND ($1::date IS NULL OR pa.created_at >= $1)
        AND ($2::date IS NULL OR pa.created_at <= $2)
      GROUP BY DATE_TRUNC('month', pa.created_at) 
      ORDER BY mes DESC
    `;
    
    const params = [startDate || null, endDate || null];
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar relatório'
    });
  }
});

module.exports = router;