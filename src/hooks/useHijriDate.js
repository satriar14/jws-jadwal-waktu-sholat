import { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { prayerService } from '../services/prayerService';

export const useHijriDate = (refreshFlag) => {
  const [hijriDate, setHijriDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHijriDate = useCallback(async () => {
    try {
      const date = moment().format('DD-MM-YYYY');
      const response = await prayerService.convertToHijri(date);
      
      // New API structure: response.code === 200, response.data.hijri, response.data.gregorian
      if (response && response.code === 200 && response.status === 'OK' && response.data) {
        const hijri = response.data.hijri;
        const masehi = response.data.gregorian;
        
        setHijriDate({
          hari: masehi.weekday.en,
          tanggal_masehi: masehi.day,
          bulan_masehi: masehi.month.en,
          tahun_masehi: masehi.year,
          tanggal_hijriyah: hijri.day,
          bulan_hijriyah: hijri.month.en,
          tahun_hijriyah: hijri.year,
        });
        setError(null);
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (err) {
      console.error('Error fetching Hijri date:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHijriDate();
  }, [refreshFlag, fetchHijriDate]);

  return { hijriDate, loading, error, refresh: fetchHijriDate };
};

