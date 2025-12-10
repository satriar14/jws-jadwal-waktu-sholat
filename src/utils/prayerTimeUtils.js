import moment from 'moment';
import { PRAYER_ORDER, TIMING_STATES } from '../constants';

/**
 * Calculate minutes since prayer time
 * @param {string} prayerTime - Prayer time in HH:mm format
 * @param {string} date - Date in MM/DD/YYYY format
 * @returns {number} Minutes since prayer time (negative if future)
 */
export const calculateMinutesSince = (prayerTime, date) => {
  const prayerDateTime = `${date} ${prayerTime}`;
  const now = new Date();
  const prayerDate = new Date(prayerDateTime);
  return Math.floor((now - prayerDate) / 60000);
};

/**
 * Get next prayer time
 * @param {Object} prayerTimes - Object with prayer times
 * @param {Object} minutesSince - Object with minutes since each prayer
 * @returns {Object|null} Next prayer info or null
 */
export const getNextPrayer = (prayerTimes, minutesSince) => {
  for (const prayer of PRAYER_ORDER) {
    const minutes = minutesSince[prayer];
    if (minutes < 0 && minutes > -30) {
      return {
        name: prayer,
        minutesUntil: Math.abs(minutes),
      };
    }
  }
  return null;
};

/**
 * Check if it's time for adzan
 * @param {Object} minutesSince - Object with minutes since each prayer
 * @returns {boolean}
 */
export const isAdzanTime = (minutesSince) => {
  return (
    minutesSince.subuh === TIMING_STATES.ADZAN ||
    minutesSince.dzuhur === TIMING_STATES.ADZAN ||
    minutesSince.ashar === TIMING_STATES.ADZAN ||
    minutesSince.maghrib === TIMING_STATES.ADZAN ||
    minutesSince.isya === TIMING_STATES.ADZAN
  );
};

/**
 * Check if it's time for iqomah countdown
 * @param {Object} minutesSince - Object with minutes since each prayer
 * @returns {boolean}
 */
export const isIqomahCountdownTime = (minutesSince) => {
  return (
    minutesSince.subuh === TIMING_STATES.COUNTDOWN_3 ||
    minutesSince.dzuhur === TIMING_STATES.COUNTDOWN_3 ||
    minutesSince.ashar === TIMING_STATES.COUNTDOWN_3 ||
    minutesSince.maghrib === TIMING_STATES.COUNTDOWN_3 ||
    minutesSince.isya === TIMING_STATES.COUNTDOWN_3
  );
};

/**
 * Check if it's in iqomah countdown range (4-9 minutes)
 * @param {Object} minutesSince - Object with minutes since each prayer
 * @returns {boolean}
 */
export const isInIqomahCountdownRange = (minutesSince) => {
  const checkRange = (minutes) => minutes > 2 && minutes < 10;
  return (
    checkRange(minutesSince.subuh) ||
    checkRange(minutesSince.dzuhur) ||
    checkRange(minutesSince.ashar) ||
    checkRange(minutesSince.maghrib) ||
    checkRange(minutesSince.isya)
  );
};

/**
 * Check if it's time for iqomah
 * @param {Object} minutesSince - Object with minutes since each prayer
 * @returns {boolean}
 */
export const isIqomahTime = (minutesSince) => {
  return (
    minutesSince.subuh === TIMING_STATES.IQOMAH ||
    minutesSince.dzuhur === TIMING_STATES.IQOMAH ||
    minutesSince.ashar === TIMING_STATES.IQOMAH ||
    minutesSince.maghrib === TIMING_STATES.IQOMAH ||
    minutesSince.isya === TIMING_STATES.IQOMAH
  );
};

/**
 * Check if it's time for prayer
 * @param {Object} minutesSince - Object with minutes since each prayer
 * @returns {boolean}
 */
export const isPrayerTime = (minutesSince) => {
  return (
    minutesSince.subuh === TIMING_STATES.SHOLAT ||
    minutesSince.dzuhur === TIMING_STATES.SHOLAT ||
    minutesSince.ashar === TIMING_STATES.SHOLAT ||
    minutesSince.maghrib === TIMING_STATES.SHOLAT ||
    minutesSince.isya === TIMING_STATES.SHOLAT
  );
};

/**
 * Check if it's time to reset
 * @param {Object} minutesSince - Object with minutes since each prayer
 * @returns {boolean}
 */
export const isResetTime = (minutesSince) => {
  return (
    minutesSince.subuh === TIMING_STATES.RESET ||
    minutesSince.dzuhur === TIMING_STATES.RESET ||
    minutesSince.ashar === TIMING_STATES.RESET ||
    minutesSince.maghrib === TIMING_STATES.RESET ||
    minutesSince.isya === TIMING_STATES.RESET
  );
};

/**
 * Get the prayer name that is currently in adzan
 * @param {Object} minutesSince - Object with minutes since each prayer
 * @returns {string|null} Prayer name or null
 */
export const getCurrentAdzanPrayer = (minutesSince) => {
  if (minutesSince.subuh === TIMING_STATES.ADZAN) return 'subuh';
  if (minutesSince.dzuhur === TIMING_STATES.ADZAN) return 'dzuhur';
  if (minutesSince.ashar === TIMING_STATES.ADZAN) return 'ashar';
  if (minutesSince.maghrib === TIMING_STATES.ADZAN) return 'maghrib';
  if (minutesSince.isya === TIMING_STATES.ADZAN) return 'isya';
  return null;
};

