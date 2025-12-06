/**
 * Game Service
 * Handles all game-related API calls
 */

import { httpPost, httpGet, ApiResponse } from '@/utils/httpRequest';
import { API_URL } from '@/config/apiUrl';
import { GameSession, GameStats, PaginationInfo } from '@/types/api';

export interface PuzzleResponse {
  image: string;
  solution: number;
}

export const gameService = {
  /**
   * Get a new puzzle from Banana API
   */
  getPuzzle: async (base64: boolean = true): Promise<ApiResponse<PuzzleResponse>> => {
    return httpGet<PuzzleResponse>(
      `${API_URL.GAME.PUZZLE}?base64=${base64 ? 'yes' : 'no'}`
    );
  },

  /**
   * Create a new game session
   */
  createSession: async (
    session: Omit<GameSession, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<{ gameSession: GameSession }>> => {
    return httpPost<{ gameSession: GameSession }>(
      API_URL.GAME.SESSION,
      session
    );
  },

  /**
   * Get user's game sessions with pagination
   */
  getSessions: async (
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<{ sessions: GameSession[]; pagination: PaginationInfo }>> => {
    return httpGet<{ sessions: GameSession[]; pagination: PaginationInfo }>(
      `${API_URL.GAME.SESSIONS}?page=${page}&limit=${limit}`
    );
  },

  /**
   * Get user's game statistics
   */
  getStats: async (): Promise<ApiResponse<GameStats>> => {
    return httpGet<GameStats>(API_URL.GAME.STATS);
  },
};

