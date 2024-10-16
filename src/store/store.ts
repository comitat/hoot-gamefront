import { useSelector, TypedUseSelectorHook, useDispatch } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';
import userSliceReducer from './userSlice';
import hootStoreSliceReducer from './hootStoreSlice';
import appSliceReducer from './appSlice';
import miningSliceReducer from './miningSlice';
import farmingSliceReducer from './farmingSlice';
import walletSliceReducer from './walletSlice';
import eventSliceReducer from './eventSlice';

import { errorHandlingMiddleware } from './errorHandlingMiddleware';
import { successHandlingMiddleware } from './successHandlingMiddleware';

const store = configureStore({
  reducer: {
    user: userSliceReducer,
    hootStore: hootStoreSliceReducer,
    app: appSliceReducer,
    mining: miningSliceReducer,
    events: eventSliceReducer,
    wallet: walletSliceReducer,
    farming: farmingSliceReducer,
  },
  // @ts-ignore
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(errorHandlingMiddleware, successHandlingMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

export default store;