import { mockAdmin, mockBookings } from './mocks';

export interface LoginAdminPayload {
    login: string;
    password: string;
}

export interface CreateBookingApiPayload {
    fullName: string;
    purpose: string;
    department?: string;
    roomId: string;
    roomName: string;
    date: string;
    startTime: string;
    endTime: string;
}

export const api = {
    async getBookings() {
        // return fetch('/api/bookings').then((res) => res.json());
        return Promise.resolve(mockBookings);
    },

    async createBooking(payload: CreateBookingApiPayload) {
        // return fetch('/api/bookings', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(payload),
        // }).then((res) => res.json());

        return Promise.resolve(payload);
    },

    async approveBooking(id: string) {
        // return fetch(`/api/bookings/${id}/approve`, {
        //   method: 'PATCH',
        // }).then((res) => res.json());

        return Promise.resolve({ id });
    },

    async rejectBooking(id: string, reason: string) {
        // return fetch(`/api/bookings/${id}/reject`, {
        //   method: 'PATCH',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ reason }),
        // }).then((res) => res.json());

        return Promise.resolve({ id, reason });
    },

    async loginAdmin(payload: LoginAdminPayload) {
        // return fetch('/api/admin/login', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(payload),
        // }).then((res) => res.json());

        const isValid =
            payload.login === mockAdmin.login && payload.password === mockAdmin.password;

        if (!isValid) {
            throw new Error('Неверный логин или пароль');
        }

        return Promise.resolve({
            token: 'mock-admin-token',
            profile: mockAdmin.profile,
        });
    },
};