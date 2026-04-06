export type BookingStatus = 'pending' | 'approved' | 'rejected';

export interface BookingItem {
    id: string;
    fullName: string;
    purpose: string;
    department?: string;
    date: string;
    startTime: string;
    endTime: string;
    status: BookingStatus;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
}

export const mockAdmin = {
    login: 'admin',
    password: 'admin123',
    profile: {
        id: 'admin-1',
        fullName: 'Администратор',
        login: 'admin',
    },
};

export const mockBookings: BookingItem[] = [
    {
        id: 'bk-1',
        fullName: 'Алексей Смирнов',
        purpose: 'Планёрка команды',
        department: 'Разработка',
        date: '2026-04-06',
        startTime: '10:00',
        endTime: '11:30',
        status: 'approved',
        createdAt: '2026-04-02T12:00:00.000Z',
        updatedAt: '2026-04-02T12:10:00.000Z',
    },
    {
        id: 'bk-2',
        fullName: 'Екатерина Орлова',
        purpose: 'Интервью кандидата',
        department: 'HR',
        date: '2026-04-06',
        startTime: '12:00',
        endTime: '13:00',
        status: 'pending',
        createdAt: '2026-04-02T13:00:00.000Z',
        updatedAt: '2026-04-02T13:00:00.000Z',
    },
    {
        id: 'bk-3',
        fullName: 'Игорь Васильев',
        purpose: 'Демо продукта',
        department: 'Продукт',
        date: '2026-04-06',
        startTime: '14:30',
        endTime: '15:30',
        status: 'approved',
        createdAt: '2026-04-02T14:00:00.000Z',
        updatedAt: '2026-04-02T14:20:00.000Z',
    },
];