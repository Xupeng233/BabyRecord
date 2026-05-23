import { useCallback } from 'react';

export const useAgeCalculator = () => {
  const calculateDaysOld = useCallback((birthDate: string, entryDate: string): number => {
    const birth = new Date(birthDate);
    const entry = new Date(entryDate);
    
    birth.setHours(0, 0, 0, 0);
    entry.setHours(0, 0, 0, 0);
    
    const diffTime = entry.getTime() - birth.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}年${month}月${day}日`;
  }, []);

  const formatDateShort = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  }, []);

  const getTodayString = useCallback((): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  return {
    calculateDaysOld,
    formatDate,
    formatDateShort,
    getTodayString,
  };
};