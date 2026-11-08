import { createSlice } from '@reduxjs/toolkit';
const challengeSlice = createSlice({ name: 'challenge', initialState: { challenges: [], isLoading: false, error: null }, reducers: {} });
export default challengeSlice.reducer;
