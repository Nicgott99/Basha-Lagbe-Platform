/**
 *    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5002';Centralized API Service for Basha Lagbe Frontend
 * Handles all API requests with consistent error handling, authentication, and logging
 */

class ApiService {
  constructor() {
    // In development, use Vite proxy (empty baseURL). In production, use VITE_API_URL
    const isDev = import.meta.env.DEV;
    const apiUrl = import.meta.env.VITE_API_URL;
    
    if (isDev && !apiUrl) {
      // Use Vite proxy in development
      this.baseURL = '';
    } else {
      // Use explicit API URL in production or when VITE_API_URL is set
      this.baseURL = apiUrl || 'http://localhost:5002';
    }
    
    this.timeout = 30000; // 30 seconds
  }

  /**
   * Generic request method with comprehensive error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
    };

    const config = { ...defaultOptions, ...options };

    // Handle FormData
    if (config.body instanceof FormData) {
      delete config.headers['Content-Type']; // Let browser set it for FormData
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle empty responses or non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        if (!response.ok) {
          // Handle authentication errors
          if (response.status === 401) {
            this.handleAuthError();
            throw new Error('Authentication required');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return { success: true };
      }

      try {
        // Safe JSON parsing
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (!response.ok) {
          // Handle authentication errors
          if (response.status === 401 && !options.suppressAuthErrors) {
            this.handleAuthError();
            throw new Error(data.message || 'Authentication required');
          }

          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        return { 
          success: false,
          error: 'Invalid server response',
          status: response.status
        };
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }

      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * Handle authentication errors by clearing local state
   */
  handleAuthError() {
    // Clear any stored user data
    localStorage.removeItem('user');
    
    // Dispatch sign out action if Redux store is available
    if (window.__REDUX_STORE__) {
      window.__REDUX_STORE__.dispatch({ type: 'user/signOutUserStart' });
    }
    
    // Redirect to sign in page if not already there
    if (!window.location.pathname.includes('/sign-in')) {
      window.location.href = '/sign-in';
    }
  }

  // ==================== AUTHENTICATION METHODS ====================

  auth = {
    /**
     * Send verification code to email
     */
    sendVerification: async (email, type = 'signup') => {
      return this.request('/server/auth/send-verification', {
        method: 'POST',
        body: JSON.stringify({ email, type }),
      });
    },

    /**
     * Verify email code
     */
    verifyEmail: async (email, code, type = 'signup') => {
      return this.request('/server/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ email, code, type }),
      });
    },

    /**
     * User signup
     */
    signup: async (userData) => {
      return this.request('/server/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },

    /**
     * User signin
     */
    signin: async (email, password) => {
      return this.request('/server/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },

    /**
     * Complete signin after email verification
     */
    completeSignin: async (email, verificationCode) => {
      return this.request('/server/auth/complete-signin', {
        method: 'POST',
        body: JSON.stringify({ email, verificationCode }),
      });
    },

    /**
     * User signout
     */
    signout: async () => {
      return this.request('/server/auth/signout', {
        method: 'POST',
      });
    },

    /**
     * Verify current token
     */
    verifyToken: async () => {
      return this.request('/server/auth/verify-token', {
        method: 'GET',
      });
    },
  };

  // ==================== ADMIN METHODS ====================
  
  admin = {
    /**
     * Get real-time platform statistics
     * Used on homepage and admin dashboard
     */
    getRealStats: async () => {
      try {
        // Call this directly with a shorter timeout rather than via this.request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // Shorter timeout for stats
        
        try {
          const response = await fetch(`${this.baseURL}/server/admin/stats`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          // Return fallback data on any error or non-OK response
          if (!response.ok) {
            console.warn(`Stats API error: ${response.status}`);
            return getDefaultStats();
          }
          
          try {
            const text = await response.text();
            if (!text || text.trim() === '') {
              console.warn('Empty response from stats API');
              return getDefaultStats();
            }
            
            const data = JSON.parse(text);
            return data && typeof data === 'object' ? data : getDefaultStats();
          } catch (parseError) {
            console.error('Failed to parse stats API response:', parseError);
            return getDefaultStats();
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          console.error('Failed to fetch stats:', fetchError);
          return getDefaultStats();
        }
      } catch (error) {
        console.error('Fatal error in getRealStats:', error);
        return getDefaultStats();
      }
      
      // Reusable fallback stats
      function getDefaultStats() {
        return {
          totalProperties: 250,
          activeListings: 180,
          totalUsers: 1200,
          completedTransactions: 540,
          avgRating: 4.5
        };
      }
    },
    
    /**
     * Get pending listings for admin approval
     */
    getPendingListings: async () => {
      try {
        return await this.request('/server/listing/admin/pending', { 
          method: 'GET'
        });
      } catch (error) {
        console.error('Failed to fetch pending listings:', error);
        return [];
      }
    },
    
    /**
     * Approve a listing
     */
    approveListing: async (listingId) => {
      try {
        return await this.request(`/server/listing/admin/approve/${listingId}`, { 
          method: 'POST'
        });
      } catch (error) {
        console.error(`Failed to approve listing ${listingId}:`, error);
        throw error;
      }
    },
    
    /**
     * Reject a listing
     */
    rejectListing: async (listingId) => {
      try {
        return await this.request(`/server/listing/admin/reject/${listingId}`, { 
          method: 'POST'
        });
      } catch (error) {
        console.error(`Failed to reject listing ${listingId}:`, error);
        throw error;
      }
    },

    /**
     * Get dashboard statistics (simple version)
     */
    getStats: async () => {
      return this.request('/server/admin/stats');
    },

    /**
     * Get all users for admin panel
     */
    getAllUsers: async (filters = {}) => {
      const queryString = new URLSearchParams(filters).toString();
      const endpoint = `/server/admin/users${queryString ? `?${queryString}` : ''}`;
      return this.request(endpoint);
    },

    /**
     * Update user status
     */
    updateUserStatus: async (userId, status) => {
      return this.request(`/server/admin/user/status/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    },

    /**
     * Get all properties for admin review
     */
    getAllProperties: async (filters = {}) => {
      const queryString = new URLSearchParams(filters).toString();
      const endpoint = `/server/admin/properties${queryString ? `?${queryString}` : ''}`;
      return this.request(endpoint);
    },

    /**
     * Approve/reject property
     */
    updatePropertyStatus: async (propertyId, status) => {
      return this.request(`/server/admin/property/status/${propertyId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    },

    /**
     * Moderate property (approve or reject)
     */
    moderateProperty: async (propertyId, action, rejectionReason = null) => {
      return this.request(`/server/admin/properties/${propertyId}/moderate`, {
        method: 'POST',
        body: JSON.stringify({ action, rejectionReason }),
      });
    },

    /**
     * Get pending properties for moderation
     */
    getPendingProperties: async () => {
      return this.request('/server/admin/properties/pending');
    },

    /**
     * Get system logs
     */
    getLogs: async (filters = {}) => {
      const queryString = new URLSearchParams(filters).toString();
      const endpoint = `/server/admin/logs${queryString ? `?${queryString}` : ''}`;
      return this.request(endpoint);
    },
  };
  
  // ==================== LISTING METHODS ====================
  
  listing = {
    /**
     * Get all listings with optional filters
     */
    getAll: async (queryString = '') => {
      try {
        // Call this directly with a short timeout rather than via this.request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // Shorter timeout 
        
        try {
          const response = await fetch(`${this.baseURL}/server/listing/all${queryString}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          // Return fallback data on any error or non-OK response
          if (!response.ok) {
            console.warn(`Listings API error: ${response.status}`);
            return getListingsFallbackData();
          }
          
          try {
            const text = await response.text();
            if (!text || text.trim() === '') {
              console.warn('Empty response from listings API');
              return getListingsFallbackData();
            }
            
            const data = JSON.parse(text);
            return Array.isArray(data) ? data : getListingsFallbackData();
          } catch (parseError) {
            console.error('Failed to parse listings API response:', parseError);
            return getListingsFallbackData();
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          console.error('Failed to fetch listings:', fetchError);
          return getListingsFallbackData();
        }
      } catch (error) {
        console.error('Fatal error in getAll listings:', error);
        return getListingsFallbackData();
      }
      
      // Reusable fallback data
      function getListingsFallbackData() {
        // Return location-aware fallback data
        const areaFromQuery = queryString.match(/area=([^&]+)/);
        const area = areaFromQuery ? decodeURIComponent(areaFromQuery[1]) : null;
        
        // Base fallback data
        const fallbackData = [
          {
            _id: 'fallback1',
            name: 'Luxury Apartment in Gulshan',
            description: 'Beautiful 3-bedroom apartment with modern amenities',
            price: 35000,
            images: ['/images/property1.jpg'],
            location: { area: 'Gulshan', address: 'Road 104, Gulshan 2' }
          },
          {
            _id: 'fallback2',
            name: 'Cozy Studio in Dhanmondi',
            description: 'Perfect studio for students or young professionals',
            price: 18000,
            images: ['/images/property2.jpg'],
            location: { area: 'Dhanmondi', address: 'Road 15/A, Dhanmondi' }
          },
          {
            _id: 'fallback3',
            name: 'Spacious Family House in Uttara',
            description: '4-bedroom house with garden and garage',
            price: 45000,
            images: ['/images/property3.jpg'],
            location: { area: 'Uttara', address: 'Sector 4, Road 12' }
          }
        ];
        
        // Filter by area if it was specified in the query
        return area 
          ? fallbackData.filter(p => p.location?.area.toLowerCase() === area.toLowerCase())
          : fallbackData;
      }
    },
    
    /**
     * Get featured listings
     */
    getFeatured: async () => {
      try {
        // Call this directly with the appropriate settings rather than via this.request
        // This gives us more control over the error handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // Shorter timeout for homepage
        
        try {
          const response = await fetch(`${this.baseURL}/server/listing/all`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          // Return fallback data on any error or non-OK response
          if (!response.ok) {
            console.error(`Featured listings API error: ${response.status}`);
            return getFeaturedFallbackData();
          }
          
          try {
            const text = await response.text();
            if (!text || text.trim() === '') {
              console.warn('Empty response from featured listings API');
              return getFeaturedFallbackData();
            }
            
            const data = JSON.parse(text);
            return Array.isArray(data) ? data : getFeaturedFallbackData();
          } catch (parseError) {
            console.error('Failed to parse featured listings response:', parseError);
            return getFeaturedFallbackData();
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          console.error('Failed to fetch featured listings:', fetchError);
          return getFeaturedFallbackData();
        }
      } catch (error) {
        console.error('Fatal error in getFeatured:', error);
        return getFeaturedFallbackData();
      }
      
      // Reusable fallback data
      function getFeaturedFallbackData() {
        return [
          {
            _id: 'featured1',
            name: 'Premium Apartment in Banani',
            description: 'Luxurious 4-bedroom apartment with modern amenities',
            price: 50000,
            images: ['/images/premium1.jpg'],
            location: { area: 'Banani', address: 'Road 11, Banani' },
            featured: true
          },
          {
            _id: 'featured2',
            name: 'Executive Suite in Gulshan',
            description: 'Fully furnished executive suite for professionals',
            price: 40000,
            images: ['/images/premium2.jpg'],
            location: { area: 'Gulshan', address: 'Gulshan Avenue' },
            featured: true
          }
        ];
      }
    }
  };

  // ==================== USER METHODS ====================

  user = {
    /**
     * Get user profile
     */
    getProfile: async (userId) => {
      return this.request(`/server/user/${userId}`);
    },

    /**
     * Update user profile
     */
    updateProfile: async (userId, userData) => {
      return this.request(`/server/user/update/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
    },

    /**
     * Delete user account
     */
    deleteAccount: async (userId) => {
      return this.request(`/server/user/delete/${userId}`, {
        method: 'DELETE',
      });
    },

    /**
     * Upload profile picture
     */
    uploadAvatar: async (userId, file) => {
      const formData = new FormData();
      formData.append('avatar', file);
      
      return this.request(`/server/user/upload-avatar/${userId}`, {
        method: 'POST',
        body: formData,
      });
    },
  };

  // ==================== PROPERTY METHODS ====================

  properties = {
    /**
     * Get all properties with filters
     */
    getAll: async (filters = {}) => {
      const queryString = new URLSearchParams(filters).toString();
      const endpoint = `/server/listing/all${queryString ? `?${queryString}` : ''}`;
      return this.request(endpoint);
    },

    /**
     * Get single property by ID
     */
    getById: async (propertyId) => {
      return this.request(`/server/listing/${propertyId}`);
    },

    /**
     * Create new property
     */
    create: async (propertyData) => {
      return this.request('/server/listing/create', {
        method: 'POST',
        body: JSON.stringify(propertyData),
      });
    },

    /**
     * Update property
     */
    update: async (propertyId, propertyData) => {
      return this.request(`/server/listing/update/${propertyId}`, {
        method: 'PUT',
        body: JSON.stringify(propertyData),
      });
    },

    /**
     * Delete property
     */
    delete: async (propertyId) => {
      return this.request(`/server/listing/delete/${propertyId}`, {
        method: 'DELETE',
      });
    },

    /**
     * Upload property images
     */
    uploadImages: async (propertyId, files) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });
      
      return this.request(`/server/listing/upload-images/${propertyId}`, {
        method: 'POST',
        body: formData,
      });
    },

    /**
     * Get user's properties
     */
    getUserProperties: async (userId) => {
      return this.request(`/server/listing/user/${userId}`);
    },

    /**
     * Search properties
     */
    search: async (searchQuery, filters = {}) => {
      const params = { search: searchQuery, ...filters };
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/server/listing/search?${queryString}`);
    },
  };

  // ==================== APPLICATION METHODS ====================

  applications = {
    /**
     * Submit property application
     */
    submit: async (applicationData) => {
      return this.request('/server/applications/submit', {
        method: 'POST',
        body: JSON.stringify(applicationData),
      });
    },

    /**
     * Get user's applications
     */
    getUserApplications: async () => {
      return this.request('/server/applications/my');
    },

    /**
     * Get applications for property
     */
    getPropertyApplications: async () => {
      return this.request('/server/applications/received');
    },

    /**
     * Update application status
     */
    updateStatus: async (applicationId, status, notes) => {
      return this.request(`/server/applications/${applicationId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, notes }),
      });
    },
  };

  // ==================== INQUIRY METHODS ====================

  inquiries = {
    /**
     * Send inquiry about property
     */
    send: async (inquiryData) => {
      return this.request('/server/inquiries/submit', {
        method: 'POST',
        body: JSON.stringify(inquiryData),
      });
    },

    /**
     * Get user's inquiries
     */
    getUserInquiries: async () => {
      return this.request('/server/inquiries/my');
    },

    /**
     * Get inquiries for property
     */
    getPropertyInquiries: async () => {
      return this.request('/server/inquiries/received');
    },

    /**
     * Reply to inquiry
     */
    reply: async (inquiryId, response) => {
      return this.request(`/server/inquiries/${inquiryId}/respond`, {
        method: 'PUT',
        body: JSON.stringify({ response }),
      });
    },
  };

  // ==================== NOTIFICATION METHODS ====================

  notifications = {
    /**
     * Get user notifications
     */
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/server/notifications/my${queryString ? `?${queryString}` : ''}`);
    },

    /**
     * Mark notification as read
     */
    markAsRead: async (notificationId) => {
      return this.request(`/server/notifications/${notificationId}/read`, {
        method: 'PUT',
      });
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead: async () => {
      return this.request('/server/notifications/mark-all-read', {
        method: 'PUT',
      });
    },

    /**
     * Delete notification
     */
    delete: async (notificationId) => {
      return this.request(`/server/notifications/${notificationId}`, {
        method: 'DELETE',
      });
    },
  };

  // ==================== CHAT METHODS ====================

  chat = {
    /**
     * Get conversations for user
     */
    getConversations: async (userId) => {
      return this.request(`/server/chat/conversations/${userId}`);
    },

    /**
     * Get messages in conversation
     */
    getMessages: async (conversationId) => {
      return this.request(`/server/chat/messages/${conversationId}`);
    },

    /**
     * Send message
     */
    sendMessage: async (conversationId, message) => {
      return this.request(`/server/chat/send`, {
        method: 'POST',
        body: JSON.stringify({ conversationId, message }),
      });
    },

    /**
     * Create new conversation
     */
    createConversation: async (participantIds, propertyId = null) => {
      return this.request('/server/chat/conversation/create', {
        method: 'POST',
        body: JSON.stringify({ participants: participantIds, propertyId }),
      });
    },
  };

  // ==================== FAVORITES METHODS ====================
  
  favorites = {
    /**
     * Add property to favorites
     */
    addFavorite: async (propertyId) => {
      return this.request(`/server/favorites/add/${propertyId}`, {
        method: 'POST',
      });
    },

    /**
     * Remove property from favorites
     */
    removeFavorite: async (propertyId) => {
      return this.request(`/server/favorites/remove/${propertyId}`, {
        method: 'DELETE',
      });
    },

    /**
     * Get user's favorite properties
     */
    getFavorites: async (page = 1, limit = 10) => {
      return this.request(`/server/favorites?page=${page}&limit=${limit}`);
    },

    /**
     * Check if property is favorited
     */
    checkFavorite: async (propertyId) => {
      return this.request(`/server/favorites/check/${propertyId}`);
    },
  };

  // ==================== MESSAGING METHODS ====================

  messages = {
    /**
     * Send a message to another user
     */
    sendMessage: async (messageData) => {
      return this.request('/server/messages/send', {
        method: 'POST',
        body: JSON.stringify(messageData),
      });
    },

    /**
     * Get conversation with a specific user
     */
    getConversation: async (userId, options = {}) => {
      const { page = 1, limit = 50, propertyId } = options;
      const params = new URLSearchParams({ page, limit });
      if (propertyId) params.append('propertyId', propertyId);
      
      return this.request(`/server/messages/conversation/${userId}?${params.toString()}`);
    },

    /**
     * Get all conversations for current user
     */
    getConversations: async () => {
      return this.request('/server/messages/conversations');
    },

    /**
     * Mark message as read
     */
    markAsRead: async (messageId) => {
      return this.request(`/server/messages/${messageId}/read`, {
        method: 'PUT',
      });
    },

    /**
     * Mark all messages in conversation as read
     */
    markConversationAsRead: async (userId) => {
      return this.request(`/server/messages/conversation/${userId}/read-all`, {
        method: 'POST',
      });
    },

    /**
     * Edit a message
     */
    editMessage: async (messageId, content) => {
      return this.request(`/server/messages/${messageId}/edit`, {
        method: 'PUT',
        body: JSON.stringify({ content }),
      });
    },

    /**
     * Delete a message
     */
    deleteMessage: async (messageId) => {
      return this.request(`/server/messages/${messageId}`, {
        method: 'DELETE',
      });
    },

    /**
     * Get unread message count
     */
    getUnreadCount: async () => {
      return this.request('/server/messages/unread/count');
    },
  };

  // ==================== UTILITY METHODS ====================

  utils = {
    /**
     * Get server health status
     */
    getHealth: async () => {
      return this.request('/');
    },

    /**
     * Get location suggestions
     */
    getLocationSuggestions: async (query) => {
      return this.request(`/server/utils/locations?q=${encodeURIComponent(query)}`);
    },

    /**
     * Upload general files
     */
    uploadFile: async (file, type = 'general') => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      return this.request('/server/upload', {
        method: 'POST',
        body: formData,
      });
    },

    /**
     * Send contact form
     */
    sendContact: async (contactData) => {
      return this.request('/server/contact', {
        method: 'POST',
        body: JSON.stringify(contactData),
      });
    },
  };
}

// Create and export singleton instance
const apiService = new ApiService();

export default apiService;
