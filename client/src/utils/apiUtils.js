/**
 * Safely parse JSON response and handle API errors
 * @param {Response} response - Fetch API Response object
 * @returns {Promise<any>} - Parsed JSON data or error object
 */
export const safeJsonParse = async (response) => {
  if (!response.ok) {
    return {
      success: false,
      message: `Server error: ${response.status} ${response.statusText}`
    };
  }

  try {
    // Check if response is empty
    const text = await response.text();
    if (!text) {
      return {
        success: false,
        message: 'Empty response from server'
      };
    }
    
    // Parse the JSON
    return JSON.parse(text);
  } catch (error) {
    console.error('Error parsing JSON response:', error);
    return {
      success: false,
      message: 'Failed to parse server response'
    };
  }
};

/**
 * Generic API request handler with error handling
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - Parsed response or error object
 */
export const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    return await safeJsonParse(response);
  } catch (error) {
    console.error(`API request error for ${url}:`, error);
    return {
      success: false,
      message: 'Network error. Please check your connection.'
    };
  }
};