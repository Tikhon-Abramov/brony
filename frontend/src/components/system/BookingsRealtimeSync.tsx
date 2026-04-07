import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { setBookings } from '../../features/bookingsSlice';
import { api } from '../../services/api';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function BookingsRealtimeSync() {
    const dispatch = useAppDispatch();
    const isFetchingRef = useRef(false);

    useEffect(() => {
        let disposed = false;

        const refreshBookings = async () => {
            if (isFetchingRef.current) return;

            try {
                isFetchingRef.current = true;
                const items = await api.getBookings();

                if (!disposed) {
                    dispatch(setBookings(items));
                }
            } catch (error) {
                console.error('Failed to refresh bookings from realtime event:', error);
            } finally {
                isFetchingRef.current = false;
            }
        };

        const eventSource = new EventSource(`${API_URL}/events`);

        eventSource.addEventListener('bookings_changed', () => {
            refreshBookings();
        });

        eventSource.onerror = () => {
            console.error('SSE connection error');
        };

        return () => {
            disposed = true;
            eventSource.close();
        };
    }, [dispatch]);

    return null;
}