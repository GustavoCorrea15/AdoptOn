const adminAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      error: 'Acesso negado. Token não fornecido.' 
    });
  }

  if (req.user.tipo_usuario !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      error: 'Acesso negado. Privilégios de administrador necessários.' 
    });
  }

  next();
};

module.exports = adminAuth;