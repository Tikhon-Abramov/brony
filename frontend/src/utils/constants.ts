export const APP_TITLE = 'Бронирование кабинетов';

export const DEFAULT_ROOM = {
    id: 'room-main',
    name: 'Конференц-зал',
};

export const ADMIN_AUTH_STORAGE_KEY = 'conference-room-admin-auth';
export const THEME_STORAGE_KEY = 'theme-mode';

export const BOOKING_STATUSES = {
    pending: 'На согласовании',
    approved: 'Подтверждена',
    rejected: 'Отклонена',
} as const;

export const WORKING_HOURS = {
    start: '09:00',
    end: '18:00',
    stepMinutes: 30,
};