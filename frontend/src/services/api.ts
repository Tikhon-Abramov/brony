import type { BookingItem } from './mocks';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export interface LoginAdminPayload {
    login: string;
    password: string;
}

export interface CreateBookingApiPayload {
    fullName: string;
    purpose: string;
    department?: string;
    roomName: string;
    date: string;
    startTime: string;
    endTime: string;
}

export interface AdminProfileResponse {
    id: number | string;
    name: string;
    login: string;
    role: string;
}

export interface LoginAdminResponse {
    token: string;
    user: AdminProfileResponse;
}

export interface ReferenceOption {
    value: string;
    label: string;
}

export interface EmployeeReferenceOption extends ReferenceOption {
    id: number;
    fullName: string;
    departmentId: number;
    department: string;
}

type RequestOptions = RequestInit & {
    token?: string | null;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { token, headers, ...rest } = options;

    const response = await fetch(`${API_URL}${path}`, {
        ...rest,
        headers: {
            'Content-Type': 'application/json',
            ...(headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
        const message =
            data && typeof data === 'object' && 'message' in data
                ? String(data.message)
                : 'Ошибка запроса';

        throw new Error(message);
    }

    return data as T;
}

function normalizeBooking(booking: BookingItem): BookingItem {
    return {
        ...booking,
        id: String(booking.id),
        processedBy: booking.processedBy
            ? {
                ...booking.processedBy,
                id: String(booking.processedBy.id),
            }
            : null,
    } as BookingItem;
}

export const api = {
    async getBookings() {
        const items = await request<BookingItem[]>('/bookings', {
            method: 'GET',
        });

        return items.map(normalizeBooking);
    },

    async createBooking(payload: CreateBookingApiPayload) {
        const created = await request<BookingItem>('/bookings', {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        return normalizeBooking(created);
    },

    async approveBooking(id: string, token: string) {
        const updated = await request<BookingItem>(`/bookings/${id}/approve`, {
            method: 'PATCH',
            token,
        });

        return normalizeBooking(updated);
    },

    async rejectBooking(id: string, reason: string, token: string) {
        const updated = await request<BookingItem>(`/bookings/${id}/reject`, {
            method: 'PATCH',
            token,
            body: JSON.stringify({ reason }),
        });

        return normalizeBooking(updated);
    },

    async loginAdmin(payload: LoginAdminPayload) {
        const result = await request<LoginAdminResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        return {
            token: result.token,
            profile: {
                id: String(result.user.id),
                fullName: result.user.name,
                login: result.user.login,
            },
        };
    },

    async getMe(token: string) {
        const result = await request<{ user: AdminProfileResponse }>('/auth/me', {
            method: 'GET',
            token,
        });

        return {
            id: String(result.user.id),
            fullName: result.user.name,
            login: result.user.login,
            role: result.user.role,
        };
    },

    async getDepartments() {
        return request<ReferenceOption[]>('/reference/departments', {
            method: 'GET',
        });
    },

    async getEmployees() {
        return request<EmployeeReferenceOption[]>('/reference/employees', {
            method: 'GET',
        });
    },
};