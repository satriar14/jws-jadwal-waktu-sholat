import axios from 'axios';

const API_BASE_URL = {
  JADWAL: 'https://api.myquran.com/v2/sholat/jadwal',
  HIJRIYAH: 'https://api.aladhan.com/v1',
  HADITH: 'https://api.hadith.gading.dev/books/',
};

export const prayerService = {
  /**
   * Get prayer schedule for a specific date
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {number} cityId - City ID (default: 1225 for Depok)
   * @returns {Promise} API response
   */
  getPrayerSchedule: async (date, cityId = 1225) => {
    try {
      const url = `${API_BASE_URL.JADWAL}/${cityId}/${date}`;
      const response = await axios.get(url);
      
      // Validate response structure
      if (response.data && response.data.status === true && response.data.data) {
        return response.data;
      }
      
      throw new Error('Invalid API response structure');
    } catch (error) {
      console.error('Error fetching prayer schedule:', error);
      throw error;
    }
  },

  /**
   * Convert Gregorian date to Hijri date
   * @param {string} date - Date in DD-MM-YYYY format
   * @returns {Promise} API response
   */
  convertToHijri: async (date) => {
    try {
      const url = `${API_BASE_URL.HIJRIYAH}/gToH/${date}`;
      const response = await axios.request({
        method: 'GET',
        url,
      });
      return response.data;
    } catch (error) {
      console.error('Error converting to Hijri:', error);
      throw error;
    }
  },

  /**
   * Get list of available hadith sources
   * @returns {Promise} Array of hadith books
   */
  getHadithSources: async () => {
    try {
      const response = await axios.get(API_BASE_URL.HADITH);
      if (response.data && response.data.code === 200 && response.data.data) {
        return response.data.data; // Return array of books
      }
      throw new Error('Invalid API response structure');
    } catch (error) {
      console.error('Error fetching hadith sources:', error);
      throw error;
    }
  },

  /**
   * Get hadith from a specific source
   * @param {string} bookId - Hadith book ID (e.g., 'bukhari', 'muslim')
   * @param {number} number - Hadith number
   * @returns {Promise} Hadith object with {arab, id, name, number}
   */
  getHadith: async (bookId, number) => {
    try {
      const url = `${API_BASE_URL.HADITH}${bookId}/${number}`;
      const response = await axios.get(url);
      
      if (response.data && response.data.code === 200 && response.data.data && response.data.data.contents) {
        const contents = response.data.data.contents;
        return {
          arab: contents.arab,
          id: contents.id,
          name: response.data.data.name,
          number: contents.number,
        };
      }
      throw new Error('Invalid API response structure');
    } catch (error) {
      console.error('Error fetching hadith:', error);
      throw error;
    }
  },
};
