/**
 * Game Redux Slice
 * Manages game state, sessions, stats, and puzzles
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { gameService, PuzzleResponse } from '@/services/gameService';
import { GameSession, GameStats, PaginationInfo } from '@/types/api';

interface GameState {
  // Puzzle state
  currentPuzzle: PuzzleResponse | null;
  puzzleLoading: boolean;
  puzzleError: string | null;

  // Sessions state
  sessions: GameSession[];
  sessionsLoading: boolean;
  sessionsError: string | null;
  pagination: PaginationInfo | null;

  // Stats state
  stats: GameStats | null;
  statsLoading: boolean;
  statsError: string | null;

  // Session creation state
  sessionCreating: boolean;
  sessionError: string | null;
}

const initialState: GameState = {
  currentPuzzle: null,
  puzzleLoading: false,
  puzzleError: null,
  sessions: [],
  sessionsLoading: false,
  sessionsError: null,
  pagination: null,
  stats: null,
  statsLoading: false,
  statsError: null,
  sessionCreating: false,
  sessionError: null,
};

// Async thunks
export const fetchPuzzle = createAsyncThunk(
  'game/fetchPuzzle',
  async (base64: boolean = true, { rejectWithValue }) => {
    try {
      const response = await gameService.getPuzzle(base64);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || 'Failed to fetch puzzle');
    } catch (error) {
      return rejectWithValue('An error occurred while fetching puzzle');
    }
  }
);

export const createGameSession = createAsyncThunk(
  'game/createSession',
  async (
    session: Omit<GameSession, '_id' | 'createdAt' | 'updatedAt'>,
    { rejectWithValue }
  ) => {
    try {
      const response = await gameService.createSession(session);
      if (response.success && response.data) {
        return response.data.gameSession;
      }
      return rejectWithValue(response.error || 'Failed to create game session');
    } catch (error) {
      return rejectWithValue('An error occurred while creating game session');
    }
  }
);

export const fetchGameSessions = createAsyncThunk(
  'game/fetchSessions',
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await gameService.getSessions(page, limit);
      if (response.success && response.data) {
        return {
          sessions: response.data.sessions,
          pagination: response.data.pagination,
        };
      }
      return rejectWithValue(response.error || 'Failed to fetch game sessions');
    } catch (error) {
      return rejectWithValue('An error occurred while fetching game sessions');
    }
  }
);

export const fetchGameStats = createAsyncThunk(
  'game/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await gameService.getStats();
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || 'Failed to fetch game stats');
    } catch (error) {
      return rejectWithValue('An error occurred while fetching game stats');
    }
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    clearPuzzle: (state) => {
      state.currentPuzzle = null;
      state.puzzleError = null;
    },
    clearSessions: (state) => {
      state.sessions = [];
      state.pagination = null;
      state.sessionsError = null;
    },
    clearStats: (state) => {
      state.stats = null;
      state.statsError = null;
    },
    clearGameErrors: (state) => {
      state.puzzleError = null;
      state.sessionsError = null;
      state.statsError = null;
      state.sessionError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch puzzle
    builder
      .addCase(fetchPuzzle.pending, (state) => {
        state.puzzleLoading = true;
        state.puzzleError = null;
      })
      .addCase(fetchPuzzle.fulfilled, (state, action: PayloadAction<PuzzleResponse>) => {
        state.puzzleLoading = false;
        state.currentPuzzle = action.payload;
        state.puzzleError = null;
      })
      .addCase(fetchPuzzle.rejected, (state, action) => {
        state.puzzleLoading = false;
        state.puzzleError = action.payload as string;
      });

    // Create game session
    builder
      .addCase(createGameSession.pending, (state) => {
        state.sessionCreating = true;
        state.sessionError = null;
      })
      .addCase(createGameSession.fulfilled, (state, action: PayloadAction<GameSession>) => {
        state.sessionCreating = false;
        state.sessions.unshift(action.payload); // Add to beginning of array
        state.sessionError = null;
        // Update stats if available
        if (state.stats) {
          state.stats.totalGames += 1;
          state.stats.totalScore += action.payload.score;
          state.stats.averageScore = Math.round(
            state.stats.totalScore / state.stats.totalGames
          );
          if (action.payload.score > state.stats.highestScore) {
            state.stats.highestScore = action.payload.score;
          }
          if (action.payload.level > state.stats.highestLevel) {
            state.stats.highestLevel = action.payload.level;
          }
          state.stats.totalTimeSpent += action.payload.timeSpent;
        }
      })
      .addCase(createGameSession.rejected, (state, action) => {
        state.sessionCreating = false;
        state.sessionError = action.payload as string;
      });

    // Fetch game sessions
    builder
      .addCase(fetchGameSessions.pending, (state) => {
        state.sessionsLoading = true;
        state.sessionsError = null;
      })
      .addCase(
        fetchGameSessions.fulfilled,
        (
          state,
          action: PayloadAction<{ sessions: GameSession[]; pagination: PaginationInfo }>
        ) => {
          state.sessionsLoading = false;
          state.sessions = action.payload.sessions;
          state.pagination = action.payload.pagination;
          state.sessionsError = null;
        }
      )
      .addCase(fetchGameSessions.rejected, (state, action) => {
        state.sessionsLoading = false;
        state.sessionsError = action.payload as string;
      });

    // Fetch game stats
    builder
      .addCase(fetchGameStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchGameStats.fulfilled, (state, action: PayloadAction<GameStats>) => {
        state.statsLoading = false;
        state.stats = action.payload;
        state.statsError = null;
      })
      .addCase(fetchGameStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload as string;
      });
  },
});

export const { clearPuzzle, clearSessions, clearStats, clearGameErrors } =
  gameSlice.actions;
export default gameSlice.reducer;

