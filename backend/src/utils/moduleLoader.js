// Lazy loading otimizado para módulos
const moduleCache = new Map();

const lazyLoad = (modulePath) => {
  if (moduleCache.has(modulePath)) {
    return moduleCache.get(modulePath);
  }
  
  const module = require(modulePath);
  moduleCache.set(modulePath, module);
  return module;
};

module.exports = { lazyLoad };