import { useState, useEffect, useCallback, useRef } from 'react';
import { prayerService } from '../services/prayerService';

export const useHadith = () => {
  const [hadith, setHadith] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastFetchedAtRef = useRef(null);

  const fetchRandomHadith = useCallback(async () => {
    try {
      setLoading(true);
      const sources = await prayerService.getHadithSources();
      
      if (sources && Array.isArray(sources) && sources.length > 0) {
        const randomIndex = Math.floor(Math.random() * sources.length);
        const selectedBook = sources[randomIndex];
        if (!selectedBook || typeof selectedBook.available !== 'number') return;
        
        const randomNumber = Math.min(
          Math.floor(Math.random() * selectedBook.available) + 1,
          selectedBook.available
        );
        const id = selectedBook.id ?? selectedBook.name;
        if (id == null) return;
        
        const result = await prayerService.getHadith(id, randomNumber);
        if (result) {
          setHadith(result);
          setError(null);
        }
      }
    } catch (err) {
      setError(err?.message ?? 'Gagal memuat hadith');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRandomHadith();
    const interval = setInterval(() => {
      const now = new Date();
      const key = now.getMinutes() * 60 + now.getSeconds();
      const isTrigger = (key === 0 || key === 30);
      const alreadyFetched = lastFetchedAtRef.current === key;
      if (isTrigger && !alreadyFetched) {
        lastFetchedAtRef.current = key;
        fetchRandomHadith();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [fetchRandomHadith]);

  return { hadith, loading, error, refresh: fetchRandomHadith };
};

