import { useState, useEffect, useCallback } from 'react';
import { prayerService } from '../services/prayerService';

export const useHadith = () => {
  const [hadith, setHadith] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRandomHadith = useCallback(async () => {
    try {
      setLoading(true);
      const sources = await prayerService.getHadithSources();
      
      if (sources && sources.length > 0) {
        // Pick a random book
        const randomIndex = Math.floor(Math.random() * sources.length);
        const selectedBook = sources[randomIndex];
        
        // Pick a random hadith number within the available range
        const randomNumber = Math.floor(Math.random() * selectedBook.available) + 1;
        
        // Fetch the hadith
        const hadith = await prayerService.getHadith(
          selectedBook.id,
          randomNumber
        );
        
        if (hadith) {
          setHadith(hadith);
          setError(null);
        }
      }
    } catch (err) {
      console.error('Error fetching hadith:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  console.log('fetching hadith second', new Date().getSeconds());
  useEffect(() => {
    fetchRandomHadith();
    
    // Refresh hadith every minute at :00 seconds
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getSeconds() === 30 || now.getSeconds() === 0) {
        fetchRandomHadith();
        console.log('fetching hadith', now.getSeconds());
      }
    }, 1000);


    return () => clearInterval(interval);
  }, [fetchRandomHadith]);

  return { hadith, loading, error, refresh: fetchRandomHadith };
};

