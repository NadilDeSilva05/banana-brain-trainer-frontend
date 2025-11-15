/**
 * Leaderboard Service
 * Handles all leaderboard-related API calls
 */

import { httpGet, ApiResponse } from '@/utils/httpRequest';
import { API_URL } from '@/config/apiUrl';
import { LeaderboardEntry } from '@/types/api';

export const leaderboardService = {
  /**
   * Get leaderboard
   */
  getLeaderboard: async (
    limit: number = 10,
    gameType?: string
  ): Promise<ApiResponse<{ leaderboard: LeaderboardEntry[] }>> => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (gameType) {
      params.append('gameType', gameType);
    }
    return httpGet<{ leaderboard: LeaderboardEntry[] }>(
      `${API_URL.LEADERBOARD.BASE}?${params.toString()}`
    );
  },

  /**
   * Get user's position on leaderboard
   */
  getUserPosition: async (
    userId: string,
    gameType?: string
  ): Promise<ApiResponse<{ position: number | null; score: number }>> => {
    const params = new URLSearchParams();
    if (gameType) {
      params.append('gameType', gameType);
    }
    return httpGet<{ position: number | null; score: number }>(
      `${API_URL.LEADERBOARD.USER(userId)}?${params.toString()}`
    );
  },
};

