import {
    createSlice,
    createAsyncThunk,
} from '@reduxjs/toolkit';

import { intervalToDuration } from "date-fns";
import MiningFarmLogic from 'game-calc-logic';

import { getAccountDataAction } from '@store/farmingSlice';

import {
  postMiningInit,
  postMiningTap,
  startAutoMining,
  stopAutoMining,
} from '@api/mining';

import {
  upgradeEnergy,
  upgradeLevel,
} from '@api/store';
import { RootState } from '@store/store';

export interface MiningState {
  energy: number;
  level: number;
  hoots: number;
  ton: number;
  temperature: number;
  lastTapCount: number;
  tapCountDelta: number;
  autoMiningEnabled: boolean;
  autoMiningDuration: number | null;
  autoMiningStart: number;
  autoMiningEnd: number | null;
  error: string,
  lastsTime: {
    hours: number | undefined,
    minutes: number | undefined,
    seconds: number | undefined,
    percent: number | undefined,
  } | null;
};

export interface MiningFarmArgs {
  level: number;
  lastTimestamp: number;
  lastTapCount: number;
  energy: number;
  temperature: number;
  hoots: number;
  autoMiningEnabled: boolean;
  autoMiningStart: number;
  autoMiningDuration: number;
  autoMiningEnd: number;
}

let miningFarm: MiningFarmLogic | undefined;

const createFarm = (data: MiningFarmArgs) => {
  miningFarm = new MiningFarmLogic(
    data.level,
    data.lastTimestamp,
    data.lastTapCount,
    data.energy,
    data.temperature,
    data.hoots,
    !!data.autoMiningEnabled,
    // @ts-ignore
    data.autoMiningStart,
    // @ts-ignore
    data.autoMiningEnd,
    // @ts-ignore
    data.autoMiningDuration,
  );

  // console.log(' CREATE FARM (from api) >> ', {
  //   level: data.level,
  //   lastTimestamp: data.lastTimestamp,
  //   lastTapCount: data.lastTapCount,
  //   energy: data.energy,
  //   temperature: data.temperature,
  //   hoots: data.hoots,
  //   autoMiningEnabled: !!data.autoMiningEnabled,
  //   // @ts-ignore
  //   autoMiningStart: data.autoMiningStart,
  //   // @ts-ignore
  //   autoMiningEnd: data.autoMiningEnd,
  //   // @ts-ignore
  //   autoMiningDuration: data.autoMiningDuration,
  // });
  // console.log(' CREATE FARM e>> ', data.energy);

};

const getLastsTime = (autoMiningEnd: number | null, autoMiningDuration: number | null) => {

  const duration = intervalToDuration({ start: new Date(), end: new Date(autoMiningEnd || 0) });
  const secondsDiff = (new Date(autoMiningEnd || 0).valueOf() - new Date().valueOf()) / 1000;
  const durationSeconds = (autoMiningDuration || 0) * 60 * 60;
  const durationPercent = 100 - (secondsDiff / durationSeconds) * 100;
  return {
    hours: duration.hours || 0,
    minutes: duration.minutes || 0,
    seconds: duration.seconds || 0,
    percent: durationPercent,
  }
}

const mutateState = (state: MiningState, payload: MiningFarmArgs) => {
  state.energy = payload.energy;
  state.temperature = payload.temperature;
  state.level = payload.level;
  state.hoots = payload.hoots;
  state.lastTapCount = payload.lastTapCount;
  state.autoMiningEnabled = payload.autoMiningEnabled;
  state.autoMiningStart = payload.autoMiningStart;
  state.autoMiningDuration = payload.autoMiningDuration;

  state.autoMiningEnd = payload.autoMiningEnd;
  state.lastsTime = getLastsTime(payload.autoMiningEnd, payload.autoMiningDuration);
}

export const initMiningAction = createAsyncThunk('mining/init', async (_, thunkAPI) => {
    try {
      const response = await postMiningInit();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
});

export const postMiningTapAction = createAsyncThunk('mining/tap', async (_, thunkAPI) => {
    const { mining: { tapCountDelta } } = thunkAPI.getState() as RootState;
    const response = await postMiningTap(tapCountDelta);
    thunkAPI.dispatch(miningSlice.actions.reduceDeltaTaps(tapCountDelta));
    return response.data;
});

export const startAutoMiningAction = createAsyncThunk('mining/auto:start', async (duration: number, thunkAPI) => {
  const { mining: { tapCountDelta } } = thunkAPI.getState() as RootState;
    if (tapCountDelta) {
      await postMiningTap(tapCountDelta);
      thunkAPI.dispatch(miningSlice.actions.reduceDeltaTaps(tapCountDelta));
    }
    const response = await startAutoMining(duration);
    return response.data;
});

export const stopAutoMiningAction = createAsyncThunk('mining/auto:stop', async (_, thunkAPI) => {
    try {
      const response = await stopAutoMining();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
});

export const upgradeEnergyAction = createAsyncThunk('upgrade/energy', async (amount: number, thunkAPI) => {
  const { mining: { tapCountDelta } } = thunkAPI.getState() as RootState;
  if (tapCountDelta) {
    await postMiningTap(tapCountDelta);
    // console.log(' >> ', tapCountDelta);
    thunkAPI.dispatch(miningSlice.actions.reduceDeltaTaps(tapCountDelta));
  }

  const response = await upgradeEnergy(amount);
  return response.data;
});

export const upgradeLevelAction = createAsyncThunk('upgrade/level', async (_, thunkAPI) => {
  const { mining: { level, tapCountDelta, autoMiningEnabled } } = thunkAPI.getState() as RootState;
  if (autoMiningEnabled) {
    return;
  }
  if (tapCountDelta) {
    await postMiningTap(tapCountDelta);
    thunkAPI.dispatch(miningSlice.actions.reduceDeltaTaps(tapCountDelta));
  }

  const response = await upgradeLevel(level + 1);
  return response.data;
});

const initialState: MiningState = {
    energy: 0,
    level: 0,
    hoots: 0,
    ton: 0,
    temperature: 0,
    lastTapCount: 0,
    tapCountDelta: 0,
    autoMiningEnabled: false,
    autoMiningStart: 0,
    autoMiningDuration: 0,
    autoMiningEnd: null,
    error: '',
    lastsTime: null,
};

const miningSlice = createSlice({
  name: 'mining',
  initialState,
  reducers: {
    setMiningData: (state, action) => {
      state.energy = action.payload.energy;
      state.temperature = action.payload.temperature;
    },
    upTaps: (state) => {
      state.tapCountDelta = state.tapCountDelta + 1;
    },
    superTap: (state) => {
      state.tapCountDelta = state.tapCountDelta + 100;
    },
    clearDeltaTaps: (state) => {
      state.tapCountDelta = 0;
    },
    reduceDeltaTaps: (state, action) => {
      if (!action.payload) {
        return;
      }
      state.tapCountDelta = state.tapCountDelta - action.payload;
    },
    localDataUpdateAction: (state) => {
      if (miningFarm) {
        const calculatedState = miningFarm.getNextState(
          new Date().valueOf(),
          state.tapCountDelta,
        );

        // console.log('run FARM NEXT STATE >> ', {
        //   timestamp: new Date().valueOf(),
        //   delta: state.tapCountDelta,
        // });

        // console.log(' FARM NEXT STATE result >> ', calculatedState);
        // console.log(' FARM NEXT STATE result e >> ', calculatedState.energy);

        state.energy = calculatedState.energy;
        state.temperature = calculatedState.temperature;
        state.hoots = calculatedState.hoots;
        state.autoMiningEnabled = !!calculatedState.autoMining?.isActive;
        state.autoMiningDuration = calculatedState.autoMining?.duration;
      
        const end = calculatedState.autoMining?.endTime;
        state.autoMiningEnd = calculatedState.autoMining.isActive && end
          ? end
          : null;
        state.lastsTime = getLastsTime(end, calculatedState.autoMining?.duration);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initMiningAction.fulfilled, (state, action) => {
        if (!action.payload) {
          return;
        }

        createFarm(action.payload);
        mutateState(state, action.payload);
      })
      .addCase(initMiningAction.rejected, (state, action) => {
        state.error = action.error.message || '';
      })

      .addCase(postMiningTapAction.fulfilled, (state, action) => {
        if (!action.payload) {
          return;
        }
        createFarm(action.payload);
        mutateState(state, action.payload);
      })
      .addCase(postMiningTapAction.rejected, (state, action) => {
        state.error = action.error.message || '';
      })

      .addCase(startAutoMiningAction.fulfilled, (state, action) => {
        if (!action.payload) {
          return;
        }
        createFarm(action.payload);
        mutateState(state, action.payload);
      })
      .addCase(startAutoMiningAction.rejected, (state, action) => {
        state.error = action.error.message || '';
      })

      .addCase(stopAutoMiningAction.fulfilled, (state, action) => {
        if (!action.payload) {
          return;
        }
        createFarm(action.payload);
        mutateState(state, action.payload);
      })
      .addCase(stopAutoMiningAction.rejected, (state, action) => {
        state.error = action.error.message || '';
      })

      .addCase(upgradeEnergyAction.fulfilled, (state, action) => {
        if (!action.payload) {
          return;
        }
        createFarm(action.payload);
        mutateState(state, action.payload);
      })
      .addCase(upgradeEnergyAction.rejected, (state, action) => {
        state.error = action.error.message || '';
      })

      .addCase(upgradeLevelAction.fulfilled, (state, action) => {
        if (!action.payload) {
          return;
        }
        createFarm(action.payload);
        mutateState(state, action.payload);
      })
      .addCase(upgradeLevelAction.rejected, (state, action) => {
        state.error = action.error.message || '';
      })

      .addCase(getAccountDataAction.fulfilled, (state, action) => {
        if (!action.payload || !miningFarm) {
          return;
        }
        state.hoots = action.payload.hoot;
        state.ton = action.payload.ton;

        miningFarm.setHoots(action.payload.hoot);
      });
  },
});

export const getMaxEarnableHootsForAutomining = () => {
  return miningFarm?.maxEarnableHootsForAutomining?.() || {
    3: 0,
    6: 0,
    9: 0,
  };
};
export const { setMiningData, upTaps, superTap, localDataUpdateAction } = miningSlice.actions;
export default miningSlice.reducer;
