const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

type BookingsChangedPayload = {
    type: 'booking_created' | 'booking_updated';
    bookingId: string;
};

type RealtimeCallbacks = {
    onConnected?: () => void;
    onBookingsChanged?: (payload: BookingsChangedPayload) => void;
    onError?: () => void;
};

export function connectBookingsEvents(callbacks: RealtimeCallbacks) {
    const eventSource = new EventSource(`${API_URL}/events`, {
        withCredentials: false,
    });

    eventSource.addEventListener('connected', () => {
        callbacks.onConnected?.();
    });

    eventSource.addEventListener('bookings_changed', (event) => {
        try {
            const payload = JSON.parse((event as MessageEvent).data) as BookingsChangedPayload;
            callbacks.onBookingsChanged?.(payload);
        } catch (error) {
            console.error('Failed to parse bookings_changed event:', error);
        }
    });

    eventSource.onerror = () => {
        callbacks.onError?.();
    };

    return () => {
        eventSource.close();
    };
}