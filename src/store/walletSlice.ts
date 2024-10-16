import {
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';
import { Wallet } from '@tonconnect/sdk';

export interface WalletSlice {
  walletInstance: Wallet | null;
}

const initialState: WalletSlice = {
    walletInstance: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (state, action: PayloadAction<Wallet | null>) => {
      state.walletInstance = action.payload;
    },
  },
});

export const { setWallet } = walletSlice.actions;
export default walletSlice.reducer;
