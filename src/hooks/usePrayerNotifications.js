import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import useSound from 'use-sound';
import {
  isAdzanTime,
  isIqomahCountdownTime,
  isInIqomahCountdownRange,
  isIqomahTime,
  isPrayerTime,
  isResetTime,
  getCurrentAdzanPrayerInWindow,
  getIqomahDelayMinutes,
} from '../utils/prayerTimeUtils';
import { IQOMAH_COUNTDOWN } from '../constants';
import soundUrl from '../assets/call-to-attention-123107.mp3';

export const usePrayerNotifications = (minutesSince, prayerSchedule) => {
  const [soundAdzan, setSoundAdzan] = useState(false);
  const [soundIqomah, setSoundIqomah] = useState(false);
  const [notifSholat, setNotifSholat] = useState(false);
  const [countDownIqomah, setCountDownIqomah] = useState(false);
  const [countDownAdzan, setCountDownAdzan] = useState(false);
  const [iqomahCountdown, setIqomahCountdown] = useState(IQOMAH_COUNTDOWN);
  const [adzanCountdown, setAdzanCountdown] = useState(3);
  const [currentTime, setCurrentTime] = useState(moment());
  const [countdownDisplay, setCountdownDisplay] = useState(null);
  const [adzanCountdownDisplay, setAdzanCountdownDisplay] = useState(null);
  
  const [playAdzan] = useSound(soundUrl);
  const [playIqomah] = useSound(soundUrl);
  const iqomahCountdownRef = useRef(IQOMAH_COUNTDOWN);

  // Reset all notifications
  const resetAll = () => {
    setSoundAdzan(false);
    setSoundIqomah(false);
    setNotifSholat(false);
    setCountDownIqomah(false);
    setCountDownAdzan(false);
    setCountdownDisplay(null);
    setAdzanCountdownDisplay(null);
    iqomahCountdownRef.current = IQOMAH_COUNTDOWN;
    setIqomahCountdown(IQOMAH_COUNTDOWN);
    setAdzanCountdown(3);
  };

  // Internal function to calculate adzan countdown display
  const getAdzanCountdownDisplayInternal = (now) => {
    if (!countDownAdzan || !prayerSchedule) return null;
    // Use InWindow so countdown stays visible at minute 1 and 2 (not only 0)
    const currentPrayer = getCurrentAdzanPrayerInWindow(minutesSince);
    if (!currentPrayer || !prayerSchedule[currentPrayer]) return null;
    
    // Get the actual adzan time
    const adzanTime = prayerSchedule[currentPrayer];
    const jadwalDate = prayerSchedule.date || moment().format('YYYY-MM-DD');
    const dateForCalculation = moment(jadwalDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
    const adzanDateTime = moment(`${dateForCalculation} ${adzanTime}`, 'MM/DD/YYYY HH:mm');
    
    // Calculate elapsed seconds since adzan time
    const elapsedSeconds = Math.floor((now - adzanDateTime) / 1000);
    const remainingSeconds = Math.max(0, 180 - elapsedSeconds); // 3 minutes = 180 seconds
    
    // If we've passed 3 minutes, return null to transition to iqomah countdown
    if (remainingSeconds <= 0) {
      return null;
    }
    
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Internal function to calculate iqomah countdown display
  const getCountdownDisplayInternal = (now) => {
    if (!countDownIqomah || !prayerSchedule) return null;
    
    // Find which prayer is in iqomah countdown range (Subuh/Dzuhur: 3–14 min, Ashar/Maghrib/Isya: 3–9 min)
    let currentPrayer = null;
    for (const prayer of ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya']) {
      const minutes = minutesSince[prayer];
      const delay = getIqomahDelayMinutes(prayer);
      if (minutes > 2 && minutes < delay) {
        currentPrayer = prayer;
        break;
      }
    }
    
    if (!currentPrayer || !prayerSchedule[currentPrayer]) return null;
    
    // Patokan tetap: Subuh/Dzuhur 3+12=15 min dari adzan; Ashar/Maghrib/Isya 3+7=10 min dari adzan
    const prayerTime = prayerSchedule[currentPrayer];
    const jadwalDate = prayerSchedule.date || moment().format('YYYY-MM-DD');
    const dateForCalculation = moment(jadwalDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
    const prayerDateTime = moment(`${dateForCalculation} ${prayerTime}`, 'MM/DD/YYYY HH:mm');
    const iqomahDelay = getIqomahDelayMinutes(currentPrayer);
    const iqomahDateTime = prayerDateTime.clone().add(iqomahDelay, 'minutes');
    
    // Calculate remaining seconds until iqomah
    const remainingSeconds = Math.max(0, Math.floor((iqomahDateTime - now) / 1000));
    
    if (remainingSeconds <= 0) {
      return null;
    }
    
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Initialize countdown displays when states change
  useEffect(() => {
    const now = moment();
    if (countDownIqomah && prayerSchedule) {
      const display = getCountdownDisplayInternal(now);
      setCountdownDisplay(display);
    } else if (!countDownIqomah) {
      setCountdownDisplay(null);
    }
    
    if (countDownAdzan && prayerSchedule) {
      const display = getAdzanCountdownDisplayInternal(now);
      setAdzanCountdownDisplay(display);
    } else if (!countDownAdzan) {
      setAdzanCountdownDisplay(null);
    }
  }, [countDownIqomah, countDownAdzan, minutesSince, prayerSchedule]); // Initialize when states change

  // Update current time every second to trigger re-render for countdown
  // Always update to ensure accurate countdown calculations
  useEffect(() => {
    const updateCountdowns = () => {
      const now = moment();
      setCurrentTime(now);
      
      // Update countdown displays to trigger re-renders
      if (countDownIqomah && prayerSchedule) {
        const display = getCountdownDisplayInternal(now);
        setCountdownDisplay(display);
      }
      
      if (countDownAdzan && prayerSchedule) {
        const display = getAdzanCountdownDisplayInternal(now);
        setAdzanCountdownDisplay(display);
      }
    };
    
    const interval = setInterval(updateCountdowns, 1000);
    updateCountdowns(); // Initial call
    
    return () => clearInterval(interval);
  }, [countDownIqomah, countDownAdzan, minutesSince, prayerSchedule]); // Include dependencies

  // Check prayer timing states every second
  useEffect(() => {
    const checkTiming = () => {
      // Check for adzan time immediately (no delay)
      if (isAdzanTime(minutesSince)) {
        // Start adzan countdown immediately when adzan time arrives
        if (!countDownAdzan && !countDownIqomah) {
          setSoundIqomah(false);
          setCountDownIqomah(false);
          setCountDownAdzan(true);
          setSoundAdzan(true);
        }
      }

      // Check if adzan countdown has finished (reached 0) and transition to iqomah countdown
      if (countDownAdzan && prayerSchedule) {
        const currentPrayer = getCurrentAdzanPrayerInWindow(minutesSince);
        if (currentPrayer && prayerSchedule[currentPrayer]) {
          const adzanTime = prayerSchedule[currentPrayer];
          const jadwalDate = prayerSchedule.date || moment().format('YYYY-MM-DD');
          const dateForCalculation = moment(jadwalDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
          const adzanDateTime = moment(`${dateForCalculation} ${adzanTime}`, 'MM/DD/YYYY HH:mm');
          const now = moment(); // Use moment() directly for accurate timing
          const elapsedSeconds = Math.floor((now - adzanDateTime) / 1000);
          
          // If 3 minutes (180 seconds) have passed, transition to iqomah countdown
          if (elapsedSeconds >= 180) {
            setCountDownAdzan(false);
            setSoundAdzan(false);
            if (!countDownIqomah) {
              iqomahCountdownRef.current = IQOMAH_COUNTDOWN;
              setIqomahCountdown(IQOMAH_COUNTDOWN);
              setCountDownIqomah(true);
            }
          }
        }
      }

      // Check for iqomah countdown time (at 3 minutes) - fallback check
      if (isIqomahCountdownTime(minutesSince)) {
        if (countDownAdzan) {
          setCountDownAdzan(false);
          setSoundAdzan(false);
        }
        if (!countDownIqomah) {
          iqomahCountdownRef.current = IQOMAH_COUNTDOWN;
          setIqomahCountdown(IQOMAH_COUNTDOWN);
          setCountDownIqomah(true);
        }
      }

      // Update iqomah countdown in range (3-9 minutes)
      // Countdown is now calculated dynamically in getCountdownDisplay()
      // No need to manually decrement here

      if (isIqomahTime(minutesSince)) {
        setCountDownIqomah(false);
        setCountDownAdzan(false);
        setSoundIqomah(true);
      }

      if (isPrayerTime(minutesSince)) {
        setSoundIqomah(false);
        setNotifSholat(true);
      }

      if (isResetTime(minutesSince)) {
        resetAll();
      }
    };

    const interval = setInterval(checkTiming, 1000);
    return () => clearInterval(interval);
  }, [minutesSince, countDownAdzan, countDownIqomah, prayerSchedule]);

  // Play adzan sound
  useEffect(() => {
    if (soundAdzan) {
      playAdzan();
    }
  }, [soundAdzan, playAdzan]);

  // Play iqomah sound
  useEffect(() => {
    if (soundIqomah) {
      playIqomah();
    }
  }, [soundIqomah, playIqomah]);

  // Public function to get adzan countdown display
  const getAdzanCountdownDisplay = () => {
    return adzanCountdownDisplay;
  };

  // Public function to get iqomah countdown display
  const getCountdownDisplay = () => {
    return countdownDisplay;
  };

  const isNotificationActive = soundAdzan || soundIqomah || notifSholat || countDownIqomah || countDownAdzan;

  return {
    soundAdzan,
    soundIqomah,
    notifSholat,
    countDownIqomah,
    countDownAdzan,
    iqomahCountdown,
    adzanCountdown,
    isNotificationActive,
    getCountdownDisplay,
    getAdzanCountdownDisplay,
    resetAll,
  };
};

