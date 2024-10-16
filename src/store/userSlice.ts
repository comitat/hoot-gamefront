import {
    createSlice,
    createAsyncThunk,
} from '@reduxjs/toolkit';

import {
  getUserProfile,
  registerUser,
} from '@api/user';

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
    const response = await getUserProfile();
    return response.data;
});

export const registerUserAction = createAsyncThunk('user/register', async () => {
    const response = await registerUser();
    console.log(' response >', response);
    return response;
});

const initialState = {
    user: null,
    status: 'idle',
    error: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || '';
      })
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
