const validator = require('validator');

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return validator.escape(input.trim());
};

const validateAnimalData = (req, res, next) => {
  const { nome, especie, idade, sexo, porte } = req.body;
  
  const errors = [];
  
  if (!nome || nome.trim().length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  }
  
  if (!['cao', 'gato', 'outro'].includes(especie)) {
    errors.push('Espécie deve ser: cao, gato ou outro');
  }
  
  if (!idade || idade < 0 || idade > 300) {
    errors.push('Idade deve ser um número válido em meses');
  }
  
  if (!['macho', 'femea'].includes(sexo)) {
    errors.push('Sexo deve ser: macho ou femea');
  }
  
  if (!['pequeno', 'medio', 'grande'].includes(porte)) {
    errors.push('Porte deve ser: pequeno, medio ou grande');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }
  
  // Sanitizar dados
  req.body.nome = sanitizeInput(nome);
  req.body.descricao = sanitizeInput(req.body.descricao);
  req.body.personalidade = sanitizeInput(req.body.personalidade);
  
  next();
};

const validateUserData = (req, res, next) => {
  const { nome, email, senha, tipo_usuario } = req.body;
  
  const errors = [];
  
  if (!nome || nome.trim().length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  }
  
  if (!validateEmail(email)) {
    errors.push('Email deve ter um formato válido');
  }
  
  if (!validatePassword(senha)) {
    errors.push('Senha deve ter pelo menos 6 caracteres');
  }
  
  if (!['adotante', 'ong', 'admin'].includes(tipo_usuario)) {
    errors.push('Tipo de usuário inválido');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }
  
  // Sanitizar dados
  req.body.nome = sanitizeInput(nome);
  req.body.email = validator.normalizeEmail(email);
  
  next();
};

const validateId = (req, res, next) => {
  const { id } = req.params;
  
  if (!validator.isInt(id, { min: 1 })) {
    return res.status(400).json({
      success: false,
      error: 'ID deve ser um número inteiro válido'
    });
  }
  
  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  sanitizeInput,
  validateAnimalData,
  validateUserData,
  validateId
};