import { createSelector } from '@reduxjs/toolkit';
import { format } from 'date-fns';
import type { RootState } from '../app/store';
import { timeToMinutes } from '../utils/booking';

export const selectThemeMode = (state: RootState) => state.theme.mode;
export const selectAuth = (state: RootState) => state.auth;
export const selectBookings = (state: RootState) => state.bookings.items;
export const selectSelectedDate = (state: RootState) => state.bookings.selectedDate;
export const selectSelectedTime = (state: RootState) => state.bookings.selectedTime;
export const selectBookingFilters = (state: RootState) => state.bookings.filters;
export const selectUi = (state: RootState) => state.ui;

export const selectBookingsForSelectedDate = createSelector(
    [selectBookings],
    (items) => {
        const today = format(new Date(), 'yyyy-MM-dd');

        return items.filter(
            (item) =>
                item.date === today &&
                (item.status === 'approved' || item.status === 'pending'),
        );
    },
);

export const selectFilteredTodayBookings = createSelector(
    [selectBookings, selectBookingFilters],
    (items, filters) => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const normalizedSearch = filters.search.trim().toLowerCase();

        return items.filter((item) => {
            const matchesToday = item.date === today;

            const matchesSearch =
                !normalizedSearch ||
                item.fullName.toLowerCase().includes(normalizedSearch) ||
                (item.department ?? '').toLowerCase().includes(normalizedSearch);

            const matchesStatus =
                filters.status === 'all' || item.status === filters.status;

            return matchesToday && matchesSearch && matchesStatus;
        });
    },
);

export const selectAllBookingsSortedDesc = createSelector([selectBookings], (items) =>
    [...items].sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date);

        if (dateCompare !== 0) {
            return dateCompare;
        }

        return timeToMinutes(b.startTime) - timeToMinutes(a.startTime);
    }),
);

export const selectPendingBookings = createSelector([selectBookings], (items) =>
    items.filter((item) => item.status === 'pending'),
);