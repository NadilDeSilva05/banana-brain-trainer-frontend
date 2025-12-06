/**
 * Leaderboard Redux Slice
 * Manages leaderboard state
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { leaderboardService } from '@/services/leaderboardService';
import { LeaderboardEntry } from '@/types/api';

interface LeaderboardState {
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  userPosition: number | null;
  userScore: number;
  userPositionLoading: boolean;
  userPositionError: string | null;
}

const initialState: LeaderboardState = {
  leaderboard: [],
  loading: false,
  error: null,
  userPosition: null,
  userScore: 0,
  userPositionLoading: false,
  userPositionError: null,
};

// Async thunks
export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async (
    { limit = 10, gameType }: { limit?: number; gameType?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await leaderboardService.getLeaderboard(limit, gameType);
      if (response.success && response.data) {
        // Transform and add rank to each entry
        const leaderboardWithRanks = response.data.leaderboard.map((entry, index) => ({
          ...entry,
          rank: index + 1,
          level: Math.floor(entry.highestScore / 250) + 1, // Calculate level from score
          score: entry.highestScore,
        }));
        return leaderboardWithRanks;
      }
      return rejectWithValue(response.error || 'Failed to fetch leaderboard');
    } catch (error) {
      return rejectWithValue('An error occurred while fetching leaderboard');
    }
  }
);

export const fetchUserPosition = createAsyncThunk(
  'leaderboard/fetchUserPosition',
  async (
    { userId, gameType }: { userId: string; gameType?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await leaderboardService.getUserPosition(userId, gameType);
      if (response.success && response.data) {
        return {
          position: response.data.position,
          score: response.data.score,
        };
      }
      return rejectWithValue(response.error || 'Failed to fetch user position');
    } catch (error) {
      return rejectWithValue('An error occurred while fetching user position');
    }
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    clearLeaderboard: (state) => {
      state.leaderboard = [];
      state.error = null;
    },
    clearUserPosition: (state) => {
      state.userPosition = null;
      state.userScore = 0;
      state.userPositionError = null;
    },
    clearLeaderboardErrors: (state) => {
      state.error = null;
      state.userPositionError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch leaderboard
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchLeaderboard.fulfilled,
        (state, action: PayloadAction<LeaderboardEntry[]>) => {
          state.loading = false;
          state.leaderboard = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch user position
    builder
      .addCase(fetchUserPosition.pending, (state) => {
        state.userPositionLoading = true;
        state.userPositionError = null;
      })
      .addCase(
        fetchUserPosition.fulfilled,
        (state, action: PayloadAction<{ position: number | null; score: number }>) => {
          state.userPositionLoading = false;
          state.userPosition = action.payload.position;
          state.userScore = action.payload.score;
          state.userPositionError = null;
        }
      )
      .addCase(fetchUserPosition.rejected, (state, action) => {
        state.userPositionLoading = false;
        state.userPositionError = action.payload as string;
      });
  },
});

export const { clearLeaderboard, clearUserPosition, clearLeaderboardErrors } =
  leaderboardSlice.actions;
export default leaderboardSlice.reducer;

