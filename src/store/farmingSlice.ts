import {
    createSlice,
    createAsyncThunk,
} from '@reduxjs/toolkit';

import {
  postCreateFarming,
  getFarmingAll,
  stopFarming,
  getAccountData,
} from '@api/farming';

import {
  fetchEventStatuses,
} from '@store/eventSlice';

import { Currency, PricePair } from "@models/common";

interface Farming {
  amount: string;
  amountOriginal: string
  totalAmount: number;
  totalAmountUsdt: number;
  createdAt: string;
  endedAt: string;
  farmId: string;
  id: number;
  slug: string;
  isActive: boolean;
  percentage: number;
  startedAt: string;
  token: Currency;
  updatedAt: string;
  user: number;
}

export interface FarmingState {
  farmings: Farming[];
  farmToCreate: Partial<Farming> | null;
  farmToStopId: string | null;
  error?: string,
  pairPrices: PricePair[];
  createFarmingToken: Currency;
};

export const getFarmingAction = createAsyncThunk('farming/get', async () => {
  const response = await getFarmingAll();
  return response.data;
});

export const createFarmingAction = createAsyncThunk('farming/create', async ({
  amount,
  token,
  eventSlug,
}: {
  amount: number;
  token?: Currency;
  eventSlug?: string;
}, thunkAPI) => {
  if (!token) {
    return;
  }

  const response = await postCreateFarming(amount, token, eventSlug);
  thunkAPI.dispatch(getFarmingAction());
  thunkAPI.dispatch(getAccountDataAction());
  thunkAPI.dispatch(fetchEventStatuses());
  return response.data;
});

export const stopFarmingAction = createAsyncThunk('farming/stop', async (id: string, thunkAPI) => {
  const response = await stopFarming(id);
  thunkAPI.dispatch(getFarmingAction());
  thunkAPI.dispatch(getAccountDataAction());
  return response.data;
});

export const getAccountDataAction = createAsyncThunk('account/me', async () => {
  const response = await getAccountData();
  return response.data;
});

const initialState: FarmingState = {
  farmings: [],
  farmToCreate: null,
  farmToStopId: null,
  pairPrices: [],
  createFarmingToken: Currency.HOOT,
};

const farmingSlice = createSlice({
  name: 'mining',
  initialState,
  reducers: {
    setFarmToCreate: (state, action) => {
      state.farmToCreate = action.payload;
    },
    setStopFarmingId: (state, action) => {
      state.farmToStopId = action.payload;
    },
    setCreateFarmingToken: (state, action) => {
      state.createFarmingToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFarmingAction.fulfilled, (state, action) => {
        if (!action.payload) {
          return;
        }

        // console.log(' farm from api >> ', action.payload);

        state.farmings = action.payload;
      })
 

      .addCase(getAccountDataAction.fulfilled, (state, action) => {
        if (!action.payload) {
          return;
        }

        state.pairPrices = action.payload.pairPrices;
      });
  },
});

export const { setFarmToCreate, setCreateFarmingToken, setStopFarmingId } = farmingSlice.actions;
export default farmingSlice.reducer;
