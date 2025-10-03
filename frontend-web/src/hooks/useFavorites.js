import { useState, useCallback } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(new Set());

  const toggleFavorite = useCallback((animalId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(animalId)) {
        newFavorites.delete(animalId);
      } else {
        newFavorites.add(animalId);
      }
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((animalId) => {
    return favorites.has(animalId);
  }, [favorites]);

  return {
    toggleFavorite,
    isFavorite,
    favorites: Array.from(favorites)
  };
};