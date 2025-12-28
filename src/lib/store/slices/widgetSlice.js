import { createSlice } from "@reduxjs/toolkit";

const widgetSlice = createSlice({
  name: "widgets",
  initialState: [],
  reducers: {
    addWidget(state, action) {
      state.push({
        id: crypto.randomUUID(),
        ...action.payload,
      });
    },

    updateWidget(state, action) {
      const index = state.findIndex((w) => w.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },

    removeWidget(state, action) {
      return state.filter((w) => w.id !== action.payload);
    },

    reorderWidgets(state, action) {
      return action.payload;
    },

    // ✅ FIXED
    replaceDashboard(state, action) {
      return action.payload.widgets; // replace entire array
    },

    // ✅ FIXED
    mergeDashboard(state, action) {
      state.push(...action.payload.widgets);
    },
  },
});

export const {
  addWidget,
  updateWidget,
  removeWidget,
  reorderWidgets,
  replaceDashboard,
  mergeDashboard,
} = widgetSlice.actions;

export default widgetSlice.reducer;