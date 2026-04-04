import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UiState {
    authModalOpen: boolean;
    bookingModalOpen: boolean;
    rejectModalOpen: boolean;
    rejectBookingId: string | null;
    historyModalOpen: boolean;
}

const initialState: UiState = {
    authModalOpen: false,
    bookingModalOpen: false,
    rejectModalOpen: false,
    rejectBookingId: null,
    historyModalOpen: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        openAuthModal(state) {
            state.authModalOpen = true;
        },
        closeAuthModal(state) {
            state.authModalOpen = false;
        },

        openBookingModal(state) {
            state.bookingModalOpen = true;
        },
        closeBookingModal(state) {
            state.bookingModalOpen = false;
        },

        openRejectModal(state, action: PayloadAction<string>) {
            state.rejectModalOpen = true;
            state.rejectBookingId = action.payload;
        },
        closeRejectModal(state) {
            state.rejectModalOpen = false;
            state.rejectBookingId = null;
        },

        openHistoryModal(state) {
            state.historyModalOpen = true;
        },
        closeHistoryModal(state) {
            state.historyModalOpen = false;
        },
    },
});

export const {
    openAuthModal,
    closeAuthModal,
    openBookingModal,
    closeBookingModal,
    openRejectModal,
    closeRejectModal,
    openHistoryModal,
    closeHistoryModal,
} = uiSlice.actions;

export default uiSlice.reducer;