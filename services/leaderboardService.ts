/**
 * Leaderboard Service
 * Handles all leaderboard-related API calls
 */

import { httpGet, ApiResponse } from '@/utils/httpRequest';
import { API_URL } from '@/config/apiUrl';
import { LeaderboardResponse, UserPosition, PaginationInfo } from '@/types/api';

export const leaderboardService = {
  /**
   * Get leaderboard with pagination
   */
  getLeaderboard: async (
    limit: number = 10,
    page: number = 1
  ): Promise<ApiResponse<LeaderboardResponse>> => {
    return httpGet<LeaderboardResponse>(
      `${API_URL.LEADERBOARD.BASE}?limit=${limit}&page=${page}`
    );
  },

  /**
   * Get user's position in leaderboard
   */
  getUserPosition: async (
    userId: string,
    gameType?: string
  ): Promise<ApiResponse<UserPosition>> => {
    const url = gameType
      ? `${API_URL.LEADERBOARD.USER(userId)}?gameType=${gameType}`
      : API_URL.LEADERBOARD.USER(userId);
    return httpGet<UserPosition>(url);
  },
};

