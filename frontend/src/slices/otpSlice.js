import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  otpInfo: localStorage.getItem('otpInfo') ? JSON.parse(localStorage.getItem('otpInfo')) : null,
};

const otpSlice = createSlice({
  name: 'otpInfo',
  initialState,
  reducers: {
    setOtpVerified: (state, action) => {
      state.otpInfo = action.payload;
      localStorage.setItem('otpInfo', JSON.stringify(action.payload));
    },
    clearOtpVerified: (state, action) => {
      localStorage.removeItem('otpInfo');
    },
  },
});

export const { setOtpVerified, clearOtpVerified } = otpSlice.actions;

export default otpSlice.reducer;
