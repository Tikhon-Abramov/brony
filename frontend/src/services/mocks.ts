export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'unreviewed';

export interface ProcessedByUser {
    id: string;
    name: string;
    login: string;
}

export interface BookingItem {
    id: string;
    fullName: string;
    purpose: string;
    department?: string;
    roomId?: string;
    roomName: string;
    date: string;
    startTime: string;
    endTime: string;
    status: BookingStatus;
    rejectionReason?: string | null;
    processedBy?: ProcessedByUser | null;
}