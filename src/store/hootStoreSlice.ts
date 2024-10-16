import {
    createSlice,
    createAsyncThunk,
} from '@reduxjs/toolkit';

import {
    getItems,
    getServices,
} from '@api/store';

export const fetchItems = createAsyncThunk('store/fetchItems', async () => {
    const response = await getItems();
    return response.data;
});

export const fetchServices = createAsyncThunk('market/fetchServices', async () => {
    const response = await getServices();
    return response.data;
});

const initialState = {
  items: [],
  services: [],
  status: 'idle',
  error: ''
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    setServices: (state, action) => {
      state.services = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || '';
      })
      .addCase(fetchServices.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || '';
      });
  },
});

export const { setItems, setServices } = marketSlice.actions;
export default marketSlice.reducer;
