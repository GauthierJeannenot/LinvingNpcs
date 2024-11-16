import { useEffect, useState } from 'react';

export const useIsSmallScreen = () => {
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 768);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isSmallScreen;
};
