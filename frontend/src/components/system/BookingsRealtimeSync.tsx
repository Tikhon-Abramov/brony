import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { setBookings } from '../../features/bookingsSlice';
import { api } from '../../services/api';
import { connectBookingsEvents } from '../../services/events';

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

        const disconnect = connectBookingsEvents({
            onBookingsChanged: () => {
                refreshBookings();
            },
            onError: () => {
                console.error('SSE connection error');
            },
        });

        return () => {
            disposed = true;
            disconnect();
        };
    }, [dispatch]);

    return null;
}