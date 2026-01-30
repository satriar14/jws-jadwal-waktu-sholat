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
 * Iqomah delay = menit dari adzan sampai iqomah (patokan tetap):
 * - Subuh, Dzuhur: 3 menit adzan + 12 menit iqomah = 15 menit
 * - Ashar, Maghrib, Isya: 3 menit adzan + 7 menit iqomah = 10 menit
 */
const IQOMAH_DELAY_SUBUH_DZUHUR = 15; // 3 + 12
const IQOMAH_DELAY_DEFAULT = 10;      // 3 + 7

/**
 * Get iqomah delay in minutes after adzan for a prayer.
 * Subuh & Dzuhur: 15 min (3 adzan + 12 iqomah); Ashar/Maghrib/Isya: 10 min (3 adzan + 7 iqomah).
 * @param {string} prayer - Prayer key (subuh, dzuhur, ashar, maghrib, isya)
 * @returns {number}
 */
export const getIqomahDelayMinutes = (prayer) => {
  return prayer === 'subuh' || prayer === 'dzuhur' ? IQOMAH_DELAY_SUBUH_DZUHUR : IQOMAH_DELAY_DEFAULT;
};

/**
 * Check if it's in iqomah countdown range (menit 3 sampai sebelum iqomah).
 * Subuh/Dzuhur: 3–14 min; Ashar/Maghrib/Isya: 3–9 min
 * @param {Object} minutesSince - Object with minutes since each prayer
 * @returns {boolean}
 */
export const isInIqomahCountdownRange = (minutesSince) => {
  const checkRange = (minutes, delay) => minutes > 2 && minutes < delay;
  return (
    checkRange(minutesSince.subuh, IQOMAH_DELAY_SUBUH_DZUHUR) ||
    checkRange(minutesSince.dzuhur, IQOMAH_DELAY_SUBUH_DZUHUR) ||
    checkRange(minutesSince.ashar, IQOMAH_DELAY_DEFAULT) ||
    checkRange(minutesSince.maghrib, IQOMAH_DELAY_DEFAULT) ||
    checkRange(minutesSince.isya, IQOMAH_DELAY_DEFAULT)
  );
};

/**
 * Check if it's time for iqomah (countdown sudah 0).
 * Subuh/Dzuhur: menit ke-15; Ashar/Maghrib/Isya: menit ke-10
 * @param {Object} minutesSince - Object with minutes since each prayer
 * @returns {boolean}
 */
export const isIqomahTime = (minutesSince) => {
  return (
    minutesSince.subuh === IQOMAH_DELAY_SUBUH_DZUHUR ||
    minutesSince.dzuhur === IQOMAH_DELAY_SUBUH_DZUHUR ||
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
 * Get the prayer name that is currently in adzan (exactly minute 0)
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

/**
 * Get the prayer that is in adzan countdown window (0–3 minutes after adzan).
 * Used so countdown display doesn’t disappear when minutesSince is 1 or 2.
 * @param {Object} minutesSince - Object with minutes since each prayer
 * @returns {string|null} Prayer name or null
 */
export const getCurrentAdzanPrayerInWindow = (minutesSince) => {
  const order = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
  let best = null;
  let bestMin = 3;
  for (const prayer of order) {
    const m = minutesSince[prayer];
    if (typeof m === 'number' && m >= 0 && m < 3 && m < bestMin) {
      bestMin = m;
      best = prayer;
    }
  }
  return best;
};


