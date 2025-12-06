/**
 * API Types
 * Type definitions for API responses and data structures
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GameSession {
  _id: string;
  user: string;
  score: number;
  level: number;
  timeSpent: number;
  gameType: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GameStats {
  totalGames: number;
  totalScore: number;
  averageScore: number;
  highestScore: number;
  highestLevel: number;
  totalTimeSpent: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  highestScore: number;
  highestLevel: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  pagination: PaginationInfo;
}

export interface UserPosition {
  userId: string;
  username: string;
  score: number;
  level: number;
  rank: number;
}

