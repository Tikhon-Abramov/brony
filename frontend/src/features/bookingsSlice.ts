import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';
import type { BookingItem, BookingStatus } from '../services/mocks';

interface BookingFilters {
    search: string;
    status: 'all' | BookingStatus;
}

interface CreateBookingPayload {
    fullName: string;
    purpose: string;
    department?: string;
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
    items: [],
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
        setBookings(state, action: PayloadAction<BookingItem[]>) {
            state.items = action.payload;
        },

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

        addBooking(state, action: PayloadAction<BookingItem>) {
            state.items.unshift(action.payload);
        },

        replaceBooking(state, action: PayloadAction<BookingItem>) {
            const index = state.items.findIndex((item) => item.id === action.payload.id);

            if (index === -1) {
                state.items.unshift(action.payload);
                return;
            }

            state.items[index] = action.payload;
        },
    },
});

export const {
    setBookings,
    setSelectedDate,
    setSelectedTime,
    setSearch,
    setStatusFilter,
    addBooking,
    replaceBooking,
} = bookingsSlice.actions;

export default bookingsSlice.reducer;
export type { CreateBookingPayload };