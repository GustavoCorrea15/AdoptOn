const crypto = require('crypto');

const csrfTokens = new Map();

const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const csrfProtection = (req, res, next) => {
  if (req.method === 'GET') {
    const token = generateCSRFToken();
    csrfTokens.set(req.sessionID || req.ip, token);
    res.locals.csrfToken = token;
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionId = req.sessionID || req.ip;
  const storedToken = csrfTokens.get(sessionId);

  if (!token || !storedToken || token !== storedToken) {
    return res.status(403).json({ error: 'Token CSRF inválido' });
  }

  csrfTokens.delete(sessionId);
  next();
};

module.exports = { csrfProtection, generateCSRFToken };