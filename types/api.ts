/**
 * API Type Definitions
 * Centralized type definitions for API responses and data structures
 */

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface GameSession {
  _id?: string;
  user: string;
  score: number;
  level: number;
  timeSpent: number;
  gameType: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  highestScore: number;
  totalGames: number;
  averageScore: number;
  lastPlayed: string;
  rank?: number;
  level?: number;
  score?: number;
}

export interface GameStats {
  totalGames: number;
  totalScore: number;
  averageScore: number;
  highestScore: number;
  totalTimeSpent: number;
  highestLevel: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

