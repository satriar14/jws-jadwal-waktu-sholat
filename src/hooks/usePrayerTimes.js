import { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { prayerService } from '../services/prayerService';
import { calculateMinutesSince, getNextPrayer } from '../utils/prayerTimeUtils';
import { PRAYER_ORDER } from '../constants';

export const usePrayerTimes = (refreshFlag) => {
  const [prayerSchedule, setPrayerSchedule] = useState(null);
  const [minutesSince, setMinutesSince] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const updatePrayerTimes = useCallback(async () => {
    try {
      const date = moment().format('YYYY-MM-DD');
      const response = await prayerService.getPrayerSchedule(date);
      
      // New API structure: response.status === true, response.data.jadwal
      if (response && response.status === true && response.data && response.data.jadwal) {
        const jadwal = response.data.jadwal;
        setPrayerSchedule(jadwal);

        // Calculate minutes since each prayer time
        // API returns date in YYYY-MM-DD format, convert to MM/DD/YYYY for calculation
        const jadwalDate = jadwal.date || moment().format('YYYY-MM-DD');
        const dateForCalculation = moment(jadwalDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
        const newMinutesSince = {};
        
        PRAYER_ORDER.forEach((prayer) => {
          if (jadwal[prayer]) {
            newMinutesSince[prayer] = calculateMinutesSince(jadwal[prayer], dateForCalculation);
          }
        });

        setMinutesSince(newMinutesSince);
        setError(null);
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (err) {
      console.error('Error fetching prayer times:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    updatePrayerTimes();
  }, [refreshFlag, updatePrayerTimes]);

  // Update minutes every minute
  useEffect(() => {
    if (!prayerSchedule) return;

    const interval = setInterval(() => {
      // Use the date from jadwal or current date
      const jadwalDate = prayerSchedule.date || moment().format('YYYY-MM-DD');
      const dateForCalculation = moment(jadwalDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
      const newMinutesSince = {};
      
      PRAYER_ORDER.forEach((prayer) => {
        if (prayerSchedule[prayer]) {
          newMinutesSince[prayer] = calculateMinutesSince(
            prayerSchedule[prayer],
            dateForCalculation
          );
        }
      });

      setMinutesSince(newMinutesSince);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [prayerSchedule]);

  const nextPrayer = getNextPrayer(prayerSchedule || {}, minutesSince);

  return {
    prayerSchedule,
    minutesSince,
    nextPrayer,
    loading,
    error,
    refresh: updatePrayerTimes,
  };
};

