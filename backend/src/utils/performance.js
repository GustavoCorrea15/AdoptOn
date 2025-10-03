// Utilitários de performance
const performanceCache = new Map();

const memoize = (fn, keyGenerator = (...args) => JSON.stringify(args)) => {
  return (...args) => {
    const key = keyGenerator(...args);
    if (performanceCache.has(key)) {
      return performanceCache.get(key);
    }
    const result = fn(...args);
    performanceCache.set(key, result);
    return result;
  };
};

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

module.exports = { memoize, debounce };