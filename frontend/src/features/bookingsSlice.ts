import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';
import { mockBookings, type BookingItem, type BookingStatus } from '../services/mocks';

interface BookingFilters {
    search: string;
    status: 'all' | BookingStatus;
}

interface CreateBookingPayload {
    fullName: string;
    purpose: string;
    department?: string;
    roomId: string;
    roomName: string;
    date: string;
    startTime: string;
    endTime: string;
}

interface BookingsState {
    items: BookingItem[];
    selectedDate: string;
    selectedTime: string;
    filters: BookingFilters;
}

const initialState: BookingsState = {
    items: mockBookings,
    selectedDate: format(new Date(), 'yyyy-MM-dd'),
    selectedTime: '10:00',
    filters: {
        search: '',
        status: 'all',
    },
};

const bookingsSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        setSelectedDate(state, action: PayloadAction<string>) {
            state.selectedDate = action.payload;
        },

        setSelectedTime(state, action: PayloadAction<string>) {
            state.selectedTime = action.payload;
        },

        setSearch(state, action: PayloadAction<string>) {
            state.filters.search = action.payload;
        },

        setStatusFilter(state, action: PayloadAction<'all' | BookingStatus>) {
            state.filters.status = action.payload;
        },

        createBooking(state, action: PayloadAction<CreateBookingPayload>) {
            const now = new Date().toISOString();

            state.items.unshift({
                ...action.payload,
                id: nanoid(),
                status: 'pending',
                createdAt: now,
                updatedAt: now,
            });
        },

        approveBooking(state, action: PayloadAction<string>) {
            const booking = state.items.find((item) => item.id === action.payload);

            if (!booking) return;

            booking.status = 'approved';
            booking.rejectionReason = undefined;
            booking.updatedAt = new Date().toISOString();
        },

        rejectBooking(state, action: PayloadAction<{ id: string; reason: string }>) {
            const booking = state.items.find((item) => item.id === action.payload.id);

            if (!booking) return;

            booking.status = 'rejected';
            booking.rejectionReason = action.payload.reason;
            booking.updatedAt = new Date().toISOString();
        },
    },
});

export const {
    setSelectedDate,
    setSelectedTime,
    setSearch,
    setStatusFilter,
    createBooking,
    approveBooking,
    rejectBooking,
} = bookingsSlice.actions;

export default bookingsSlice.reducer;
export type { CreateBookingPayload };