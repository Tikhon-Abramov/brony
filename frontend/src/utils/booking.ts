import type { BookingItem } from '../services/mocks';

export const DAY_START_TIME = '09:00';
export const DAY_END_TIME = '23:00';

function generateTimeSlots(start: string, endExclusive: string, stepMinutes = 30) {
    const slots: string[] = [];
    let current = timeToMinutes(start);
    const end = timeToMinutes(endExclusive);

    while (current < end) {
        slots.push(minutesToTime(current));
        current += stepMinutes;
    }

    return slots;
}

export const TIME_SLOTS = generateTimeSlots(DAY_START_TIME, DAY_END_TIME, 30);

export function timeToMinutes(value: string) {
    const [hours, minutes] = value.split(':').map(Number);
    return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number) {
    const normalized = Math.max(0, totalMinutes);
    const hours = Math.floor(normalized / 60);
    const minutes = normalized % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function addMinutesToTime(value: string, minutesToAdd: number) {
    return minutesToTime(timeToMinutes(value) + minutesToAdd);
}

export function getBookingSpan(startTime: string, endTime: string) {
    return (timeToMinutes(endTime) - timeToMinutes(startTime)) / 30;
}

export function sortBookingsByTime(bookings: BookingItem[]) {
    return [...bookings].sort(
        (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
    );
}

export function getBookingStatusLabel(status: BookingItem['status'] | 'unreviewed') {
    if (status === 'approved') return 'Подтверждена';
    if (status === 'rejected') return 'Отклонена';
    if (status === 'unreviewed') return 'Не рассмотрено';

    return 'На согласовании';
}

export function isTimeRangeValid(startTime: string, endTime: string) {
    return timeToMinutes(endTime) > timeToMinutes(startTime);
}

export function isBookingOverlap(
    startA: string,
    endA: string,
    startB: string,
    endB: string,
) {
    const aStart = timeToMinutes(startA);
    const aEnd = timeToMinutes(endA);
    const bStart = timeToMinutes(startB);
    const bEnd = timeToMinutes(endB);

    return aStart < bEnd && aEnd > bStart;
}

export function findBookingConflict(
    bookings: BookingItem[],
    payload: {
        date: string;
        roomId: string;
        startTime: string;
        endTime: string;
    },
) {
    return bookings.find((booking) => {
        const sameDate = booking.date === payload.date;
        const sameRoom =
            booking.roomId === payload.roomId ||
            booking.roomName === payload.roomId ||
            booking.roomName === 'Конференц-зал';

        const activeStatus =
            booking.status === 'approved' || booking.status === 'pending';

        if (!sameDate || !sameRoom || !activeStatus) {
            return false;
        }

        return isBookingOverlap(
            payload.startTime,
            payload.endTime,
            booking.startTime,
            booking.endTime,
        );
    });
}

export function isDateTimeInPast(date: string, time: string) {
    const bookingDateTime = new Date(`${date}T${time}:00`);
    return bookingDateTime.getTime() < Date.now();
}

export function isDurationValid(value: string) {
    if (!/^\d{2}:\d{2}$/.test(value)) {
        return false;
    }

    const [hours, minutes] = value.split(':').map(Number);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return false;
    }

    if (minutes < 0 || minutes > 59) {
        return false;
    }

    return hours > 0 || minutes > 0;
}

export function durationToMinutes(value: string) {
    const [hours, minutes] = value.split(':').map(Number);
    return hours * 60 + minutes;
}

export function getCurrentTimeString() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

export function getMinStartTimeForDate(date: string) {
    const today = new Date().toISOString().slice(0, 10);

    if (date !== today) {
        return DAY_START_TIME;
    }

    const nowTime = getCurrentTimeString();

    return timeToMinutes(nowTime) > timeToMinutes(DAY_START_TIME)
        ? nowTime
        : DAY_START_TIME;
}

export function clampStartTimeToAllowed(date: string, time: string) {
    const minTime = getMinStartTimeForDate(date);
    return timeToMinutes(time) < timeToMinutes(minTime) ? minTime : time;
}

export function isEndTimeWithinDay(endTime: string) {
    return timeToMinutes(endTime) <= timeToMinutes(DAY_END_TIME);
}