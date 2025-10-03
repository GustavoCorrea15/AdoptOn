const validator = require('validator');

// Validação de entrada para prevenir XSS e injection
const validateInput = (req, res, next) => {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    
    // Remove scripts maliciosos
    str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove tags HTML perigosas
    str = str.replace(/<(iframe|object|embed|link|meta|style)[^>]*>/gi, '');
    
    // Escapa caracteres especiais SQL
    str = str.replace(/['";\\]/g, '\\$&');
    
    return str.trim();
  };

  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeString(obj[key]);
      } else if (typeof obj[key] === 'object') {
        sanitizeObject(obj[key]);
      }
    }
    return obj;
  };

  // Sanitizar body, query e params
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);

  next();
};

// Validação específica para email
const validateEmail = (email) => {
  return validator.isEmail(email) && email.length <= 255;
};

// Validação de senha forte
const validatePassword = (password) => {
  return password && 
         password.length >= 6 && 
         password.length <= 128 &&
         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
};

// Validação de telefone
const validatePhone = (phone) => {
  return validator.isMobilePhone(phone, 'pt-BR');
};

module.exports = {
  validateInput,
  validateEmail,
  validatePassword,
  validatePhone
};