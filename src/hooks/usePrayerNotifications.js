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
} from '../utils/prayerTimeUtils';
import { IQOMAH_COUNTDOWN } from '../constants';
import soundUrl from '../assets/call-to-attention-123107.mp3';

export const usePrayerNotifications = (minutesSince) => {
  const [soundAdzan, setSoundAdzan] = useState(false);
  const [soundIqomah, setSoundIqomah] = useState(false);
  const [notifSholat, setNotifSholat] = useState(false);
  const [countDownIqomah, setCountDownIqomah] = useState(false);
  const [iqomahCountdown, setIqomahCountdown] = useState(IQOMAH_COUNTDOWN);
  
  const [playAdzan] = useSound(soundUrl);
  const [playIqomah] = useSound(soundUrl);
  const iqomahCountdownRef = useRef(IQOMAH_COUNTDOWN);

  // Reset all notifications
  const resetAll = () => {
    setSoundAdzan(false);
    setSoundIqomah(false);
    setNotifSholat(false);
    setCountDownIqomah(false);
    iqomahCountdownRef.current = IQOMAH_COUNTDOWN;
    setIqomahCountdown(IQOMAH_COUNTDOWN);
  };

  // Check prayer timing states every second
  useEffect(() => {
    const checkTiming = () => {
      const seconds = moment().format('ss');
      
      // Only check at :03 seconds to avoid multiple triggers
      if (seconds !== '03') return;

      if (isAdzanTime(minutesSince)) {
        setSoundIqomah(false);
        setSoundAdzan(true);
      }

      if (isIqomahCountdownTime(minutesSince)) {
        iqomahCountdownRef.current = IQOMAH_COUNTDOWN;
        setIqomahCountdown(IQOMAH_COUNTDOWN);
        setSoundAdzan(false);
        setCountDownIqomah(true);
      }

      if (isInIqomahCountdownRange(minutesSince)) {
        if (iqomahCountdownRef.current > 0) {
          iqomahCountdownRef.current -= 1;
          setIqomahCountdown(iqomahCountdownRef.current);
        } else {
          iqomahCountdownRef.current = IQOMAH_COUNTDOWN;
          setIqomahCountdown(IQOMAH_COUNTDOWN);
        }
      }

      if (isIqomahTime(minutesSince)) {
        setCountDownIqomah(false);
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
  }, [minutesSince]);

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

  // Calculate countdown display
  const getCountdownDisplay = () => {
    if (!countDownIqomah) return null;
    
    const seconds = parseInt(moment().format('ss'));
    const remainingSeconds = 60 - seconds + 3;
    const displaySeconds = remainingSeconds >= 60 ? 3 - seconds : remainingSeconds;
    
    return `${iqomahCountdown}:${displaySeconds.toString().padStart(2, '0')}`;
  };

  const isNotificationActive = soundAdzan || soundIqomah || notifSholat || countDownIqomah;

  return {
    soundAdzan,
    soundIqomah,
    notifSholat,
    countDownIqomah,
    iqomahCountdown,
    isNotificationActive,
    getCountdownDisplay,
    resetAll,
  };
};

