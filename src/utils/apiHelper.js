import axios from 'axios';

/**
 * CORS proxy services (fallback options)
 * Using reliable public CORS proxies
 */
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest=',
];

/**
 * Make an API request with CORS fallback
 * @param {string} url - The API URL
 * @param {Object} options - Axios request options
 * @param {number} proxyIndex - Current proxy index to try
 * @returns {Promise} Axios response
 */
export const fetchWithCorsFallback = async (url, options = {}, proxyIndex = -1) => {
  try {
    // First, try direct request
    const response = await axios.get(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...options.headers,
      },
    });
    return response;
  } catch (error) {
    // Check if it's a CORS error
    const isCorsError =
      error.message?.includes('CORS') ||
      error.code === 'ERR_NETWORK' ||
      error.response?.status === 0 ||
      (error.response === undefined && error.request !== undefined);

    if (isCorsError && proxyIndex < CORS_PROXIES.length - 1) {
      // Try next proxy
      const nextProxyIndex = proxyIndex + 1;
      const proxyUrl = `${CORS_PROXIES[nextProxyIndex]}${encodeURIComponent(url)}`;
      
      console.warn(`CORS error detected, trying proxy ${nextProxyIndex + 1}...`);
      
      try {
        const response = await axios.get(proxyUrl, {
          ...options,
          timeout: 15000, // 15 second timeout for proxy
          headers: {
            'Accept': 'application/json',
            ...options.headers,
          },
        });
        
        // Some proxies might return the data in a different format
        // If the response is a string that looks like JSON, try to parse it
        if (typeof response.data === 'string') {
          try {
            const parsed = JSON.parse(response.data);
            return { ...response, data: parsed };
          } catch {
            // If parsing fails, return as is
            return response;
          }
        }
        
        return response;
      } catch (proxyError) {
        // If this proxy fails, try next one
        if (nextProxyIndex < CORS_PROXIES.length - 1) {
          return fetchWithCorsFallback(url, options, nextProxyIndex);
        }
        throw proxyError;
      }
    }
    
    throw error;
  }
};

