import { useState, useEffect } from 'react';

const useSystemTheme = () => {
  const getSystemTheme = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const [isDarkMode, setIsDarkMode] = useState(getSystemTheme);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Escuchar los cambios en el tema del sistema
    const handleChange = () => setIsDarkMode(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleChange);

    // Cleanup: Eliminar el listener al desmontar
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDarkMode;
};

export default useSystemTheme;