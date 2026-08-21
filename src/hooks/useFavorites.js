import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'veltrix_favorites';

/**
 * Read the raw favorites array from localStorage.
 * Exported as a plain function so ComponentsPage can call it
 * during its render cycle without needing a hook.
 */
export function getFavoriteSlugs() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    // localStorage can throw in private/incognito mode or when storage is full
    return [];
  }
}

/**
 * Custom hook that manages the favorite state for a single component.
 *
 * @param {string} slug - The slug of the component to track.
 * @returns {{ isFavorite: boolean, toggleFavorite: () => void }}
 */
export function useFavorites(slug) {
  const [isFavorite, setIsFavorite] = useState(() => getFavoriteSlugs().includes(slug));

  // Re-sync if slug changes (e.g., user navigates between detail pages)
  useEffect(() => {
    setIsFavorite(getFavoriteSlugs().includes(slug));
  }, [slug]);

  const toggleFavorite = () => {
    const favs = getFavoriteSlugs();
    const newFavs = isFavorite
      ? favs.filter(f => f !== slug)
      : [...favs, slug];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavs));
    setIsFavorite(prev => !prev);
  };

  return { isFavorite, toggleFavorite };
}
