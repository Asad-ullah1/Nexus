const API_CONFIG = {
  development: 'http://localhost:3000',
  production: 'https://nexus-database-8wgh.onrender.com',
};

export const API_BASE_URL = API_CONFIG[process.env.NODE_ENV] || API_CONFIG.development;

export default API_BASE_URL;
