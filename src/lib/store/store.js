import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import widgetReducer from "./slices/widgetSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    widgets: widgetReducer,
  },
});