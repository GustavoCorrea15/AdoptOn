const express = require('express');
const router = express.Router();

// Rota para obter token CSRF
router.get('/csrf-token', (req, res) => {
  res.json({ 
    csrfToken: req.session.csrfToken || 'dev-token' 
  });
});

module.exports = router;