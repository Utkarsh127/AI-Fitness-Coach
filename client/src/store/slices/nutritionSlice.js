import { createSlice } from '@reduxjs/toolkit';
const nutritionSlice = createSlice({ name: 'nutrition', initialState: { plans: [], isLoading: false, error: null }, reducers: {} });
export default nutritionSlice.reducer;
