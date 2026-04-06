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
