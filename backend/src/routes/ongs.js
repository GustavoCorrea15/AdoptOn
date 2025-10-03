const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Listar ONGs
router.get('/', async (req, res) => {
  try {
    // Simulação de dados para demo
    const ongs = [
      {
        id: 1,
        nome: 'ONG Amigos dos Animais',
        cidade: 'São Paulo',
        telefone: '(11) 1234-5678',
        email: 'contato@amigosanimais.org',
        animais_disponiveis: 25
      },
      {
        id: 2,
        nome: 'Abrigo Esperança',
        cidade: 'Rio de Janeiro',
        telefone: '(21) 9876-5432',
        email: 'info@abrigoesperanca.org',
        animais_disponiveis: 18
      }
    ];

    res.json({
      success: true,
      data: ongs
    });
  } catch (error) {
    console.error('Erro ao buscar ONGs:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;