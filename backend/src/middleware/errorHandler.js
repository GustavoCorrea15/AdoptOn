// Middleware de tratamento de erros centralizado
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Erro de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: err.message
    });
  }

  // Erro de autenticação
  if (err.name === 'UnauthorizedError' || err.status === 401) {
    return res.status(401).json({
      error: 'Não autorizado'
    });
  }

  // Erro de permissão
  if (err.status === 403) {
    return res.status(403).json({
      error: 'Acesso negado'
    });
  }

  // Erro não encontrado
  if (err.status === 404) {
    return res.status(404).json({
      error: 'Recurso não encontrado'
    });
  }

  // Erro interno do servidor
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorHandler;