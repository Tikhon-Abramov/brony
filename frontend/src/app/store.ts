// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../features/themeSlice';
import authReducer from '../features/authSlice';
import bookingsReducer from '../features/bookingsSlice';
import uiReducer from '../features/uiSlice';

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        auth: authReducer,
        bookings: bookingsReducer,
        ui: uiReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;