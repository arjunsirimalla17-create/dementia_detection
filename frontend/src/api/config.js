const API_CONFIG = {
  // Use local IP so other devices on the same Wi-Fi can connect
  BASE_URL: import.meta.env.VITE_API_URL || 'http://192.168.0.112:5000/api',
  ENDPOINTS: {
    USERS: '/users',
    ASSESSMENT: '/assessment',
  }
};

export default API_CONFIG;
