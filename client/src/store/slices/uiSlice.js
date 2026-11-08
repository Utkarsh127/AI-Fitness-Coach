import { createSlice } from '@reduxjs/toolkit';
const uiSlice = createSlice({
  name: 'ui',
  initialState: { sidebarOpen: false, theme: 'dark', activeModal: null },
  reducers: {
    toggleSidebar(state) { state.sidebarOpen = !state.sidebarOpen; },
    setSidebarOpen(state, action) { state.sidebarOpen = action.payload; },
    setActiveModal(state, action) { state.activeModal = action.payload; },
  },
});
export const { toggleSidebar, setSidebarOpen, setActiveModal } = uiSlice.actions;
export default uiSlice.reducer;
