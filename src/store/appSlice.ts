import { ReactNode, FC } from 'react';
import {
    createSlice,
} from '@reduxjs/toolkit';

let itemsCounter = 0;

export interface Message {
  title?: string;
  code?: number;
  message?: string;
  contentNode?: ReactNode,
  idNum: number;
  actionTitle?: string;
  actionFunc?: () => void;
  ContentComponent?: FC;
  hideButton?: boolean;
}

export interface AppSlice {
  errors: Array<Message> | null;
  messages: Array<Message> | null;
}

const initialState: AppSlice = {
  errors: null,
  messages: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    addError: (state, action) => {
      state.errors = [
        ...(state.errors || []),
        {
          ...action.payload,
          idNum: ++itemsCounter,
        },
      ];
    },
    addMessage: (state, action) => {
      state.messages = [
        ...(state.messages || []),
        {
          ...action.payload,
          idNum: ++itemsCounter,
        },
      ];
    },
    clearErrors: (state) => {
        state.errors = null;
    },
    deleteItem: (state, action) => {
      state.errors = state.errors?.filter((item: Message) => item.idNum !== action.payload) || null;
      state.messages = state.messages?.filter((item: Message) => item.idNum !== action.payload) || null;
    },
  },
});

export const { addError, addMessage, clearErrors, deleteItem } = appSlice.actions;
export default appSlice.reducer;
