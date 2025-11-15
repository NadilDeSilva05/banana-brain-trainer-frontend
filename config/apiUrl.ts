/**
 * API URL Configuration
 * Centralized configuration for backend API endpoints
 */

export const API_URL = {
  BASE: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  
  // Game endpoints
  GAME: {
    SESSION: '/game/session',
    SESSIONS: '/game/sessions',
    STATS: '/game/stats',
  },
  
  // Leaderboard endpoints
  LEADERBOARD: {
    BASE: '/leaderboard',
    USER: (userId: string) => `/leaderboard/user/${userId}`,
  },
};

export default API_URL;

