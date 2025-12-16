import { createContext, useContext, useState, useEffect } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('hasLoaded');
    if (hasLoaded) {
      setIsFirstLoad(false);
    } else {
      const timer = setTimeout(() => {
        setIsFirstLoad(false);
        sessionStorage.setItem('hasLoaded', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <LoadingContext.Provider value={{ isFirstLoad }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};