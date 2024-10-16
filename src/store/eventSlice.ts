import {
    createSlice,
    createAsyncThunk,
} from '@reduxjs/toolkit';

import {
  getEventsStatuses,
  getDailyBonusEval,
  postDailyBonusClaim,
} from '@api/events';
import { initMiningAction } from '@store/miningSlice';

export type EventStatus = {
  createdAt: string;
  event: {
    bonusDescription: string;
    createdAt: string;
    description: string;
    repeat: string;
    repeatParam1: string | null;
    repeatParam2: string | null;
    slug: string;
    title: string;
    updatedAt: string;
    status: string;
  },
  id: number;
  lastVisitedAt: string | null;
  status: string;
  updatedAt: string;
  user: number;
}

export const fetchEventStatuses = createAsyncThunk('event/statuses', async () => {
  const response = await getEventsStatuses();
  return response.data;
});

export const fetchDailyBonusEval = createAsyncThunk('event/daily/eval', async () => {
  const response = await getDailyBonusEval();
  return response.data;
});

export const fetchDailyBonusClaim = createAsyncThunk('event/daily/claim', async (_, thunkAPI) => {
  const response = await postDailyBonusClaim();
  thunkAPI.dispatch(initMiningAction());
  return response.data;
});

interface EventsState {
  eventsStatuses: EventStatus[] | null,
  dailyBonusEnergy: number | null;
  dailyBonusAvailable: boolean;
  status: string,
  error: string,
}

const initialState: EventsState = {
  eventsStatuses: null,
  dailyBonusEnergy: null,
  dailyBonusAvailable: false,
  status: 'idle',
  error: '',
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEventStatuses: (state, action) => {
      state.eventsStatuses = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventStatuses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEventStatuses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.eventsStatuses = action.payload;
      })
      .addCase(fetchEventStatuses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || '';
      })

      .addCase(fetchDailyBonusEval.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDailyBonusEval.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // state.eventsStatuses = action.payload;
        state.dailyBonusEnergy = action.payload.bonusEnergyValue
        state.dailyBonusAvailable = action.payload.status === "1";
      })
      .addCase(fetchDailyBonusEval.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || '';
      })

      .addCase(fetchDailyBonusClaim.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDailyBonusClaim.fulfilled, (state) => {
        state.status = 'succeeded';
        state.dailyBonusAvailable = false;
      })
      .addCase(fetchDailyBonusClaim.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || '';
      })
  },
});

export const { setEventStatuses } = eventsSlice.actions;
export default eventsSlice.reducer;
