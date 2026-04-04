import styled, { css } from 'styled-components';
import { useAppSelector } from '../../hooks/redux';
import type { BookingItem } from '../../services/mocks';
import { TIME_SLOTS, sortBookingsByTime, timeToMinutes } from '../../utils/booking';

interface ScheduleGridProps {
    bookings: BookingItem[];
}

function getApproxStartIndex(startTime: string) {
    const startMinutes = timeToMinutes(startTime);

    let index = 0;

    for (let i = 0; i < TIME_SLOTS.length; i += 1) {
        const current = timeToMinutes(TIME_SLOTS[i]);
        const next =
            i < TIME_SLOTS.length - 1
                ? timeToMinutes(TIME_SLOTS[i + 1])
                : current + 30;

        if (startMinutes >= current && startMinutes < next) {
            index = i;
            break;
        }

        if (startMinutes >= current) {
            index = i;
        }
    }

    return index;
}

function getApproxEndIndexExclusive(endTime: string) {
    const endMinutes = timeToMinutes(endTime);

    for (let i = 0; i < TIME_SLOTS.length; i += 1) {
        const current = timeToMinutes(TIME_SLOTS[i]);

        if (endMinutes <= current) {
            return i;
        }
    }

    return TIME_SLOTS.length;
}

function getApproxSpan(startTime: string, endTime: string) {
    const startIndex = getApproxStartIndex(startTime);
    const endIndexExclusive = getApproxEndIndexExclusive(endTime);

    return Math.max(1, endIndexExclusive - startIndex);
}

export default function ScheduleGrid({ bookings }: ScheduleGridProps) {
    const selectedDate = useAppSelector((state) => state.bookings.selectedDate);
    const sorted = sortBookingsByTime(bookings);

    const bookingStartsBySlot = new Map<number, BookingItem>();
    const coveredSlots = new Set<number>();

    sorted.forEach((booking) => {
        const startIndex = getApproxStartIndex(booking.startTime);
        const span = getApproxSpan(booking.startTime, booking.endTime);

        if (!bookingStartsBySlot.has(startIndex)) {
            bookingStartsBySlot.set(startIndex, booking);
        }

        for (let i = 1; i < span; i += 1) {
            coveredSlots.add(startIndex + i);
        }
    });

    return (
        <Wrap>
            <Grid $columns={TIME_SLOTS.length}>
                {TIME_SLOTS.map((slot) => (
                    <HeaderCell key={`header-${slot}`}>{slot}</HeaderCell>
                ))}

                {TIME_SLOTS.map((slot, index) => {
                    if (coveredSlots.has(index)) {
                        return null;
                    }

                    const booking = bookingStartsBySlot.get(index);

                    if (booking) {
                        const span = getApproxSpan(booking.startTime, booking.endTime);

                        return (
                            <BookingCell
                                key={`booking-${booking.id}`}
                                style={{ gridColumn: `span ${span}` }}
                            >
                                <BookingPill $status={booking.status}>
                                    <BookingContent>
                                        <BookingTitle>{booking.purpose}</BookingTitle>
                                        <BookingMeta>
                                            {booking.startTime} — {booking.endTime}
                                        </BookingMeta>
                                    </BookingContent>

                                    <Tooltip>
                                        <TooltipTitle>{booking.fullName}</TooltipTitle>
                                        <TooltipText>Дата: {selectedDate}</TooltipText>
                                        <TooltipText>Начало: {booking.startTime}</TooltipText>
                                        <TooltipText>Окончание: {booking.endTime}</TooltipText>
                                    </Tooltip>
                                </BookingPill>
                            </BookingCell>
                        );
                    }

                    return <FreeCell key={`free-${slot}-${index}`} />;
                })}
            </Grid>
        </Wrap>
    );
}

const Wrap = styled.div`
    border: 1px solid ${({ theme }) => theme.line};
    border-radius: 24px;
    overflow-x: auto;
    overflow-y: visible;
    background: ${({ theme }) => theme.panel2};
`;

const Grid = styled.div<{ $columns: number }>`
    display: grid;
    grid-template-columns: repeat(${({ $columns }) => $columns}, minmax(72px, 1fr));
    min-width: max-content;
`;

const baseCell = css`
    border-right: 1px solid ${({ theme }) => theme.line};
    border-bottom: 1px solid ${({ theme }) => theme.line};
    padding: 12px;
    min-height: 122px;
`;

const HeaderCell = styled.div`
    ${baseCell};
    min-height: auto;
    background: ${({ theme }) => theme.input};
    font-size: 12px;
    color: ${({ theme }) => theme.muted};
    text-align: center;
    padding: 14px 10px;
`;

const BookingCell = styled.div`
    ${baseCell};
    background: transparent;
`;

const FreeCell = styled.div`
    ${baseCell};
    background: transparent;
`;

const BookingPill = styled.div<{ $status: 'pending' | 'approved' | 'rejected' }>`
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    min-height: 86px;
    border-radius: 18px;
    padding: 12px 14px;
    overflow: visible;
    background: ${({ theme, $status }) => {
        if ($status === 'pending') {
            return 'linear-gradient(90deg, rgba(245,158,11,.25), rgba(250,204,21,.18))';
        }

        if ($status === 'rejected') {
            return 'linear-gradient(90deg, rgba(251,113,133,.18), rgba(244,114,182,.14))';
        }

        return theme.bookingGradient;
    }};
    border: 1px solid
    ${({ $status }) => {
        if ($status === 'pending') return 'rgba(250,204,21,.16)';
        if ($status === 'rejected') return 'rgba(251,113,133,.18)';
        return 'rgba(253,186,255,.15)';
    }};
    box-shadow: 0 8px 18px rgba(34, 158, 217, 0.09);

    &:hover > div:last-child {
        opacity: 1;
        visibility: visible;
        transform: translateY(-50%) translateX(0);
    }
`;

const BookingContent = styled.div`
    min-width: 0;
`;

const BookingTitle = styled.div`
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const BookingMeta = styled.div`
    margin-top: 4px;
    font-size: 12px;
    color: ${({ theme }) => theme.muted};
`;

const Tooltip = styled.div`
    position: absolute;
    left: calc(100% + 10px);
    top: 50%;
    z-index: 20;
    min-width: 220px;
    max-width: 260px;
    padding: 12px 14px;
    border-radius: 14px;
    border: 1px solid ${({ theme }) => theme.line};
    background: ${({ theme }) => theme.panel};
    box-shadow: ${({ theme }) => theme.shadow};
    opacity: 0;
    visibility: hidden;
    transform: translateY(-50%) translateX(6px);
    transition:
            opacity 0.18s ease,
            transform 0.18s ease,
            visibility 0.18s ease;
    pointer-events: none;
    white-space: normal;
`;

const TooltipTitle = styled.div`
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 8px;
    line-height: 1.35;
`;

const TooltipText = styled.div`
    font-size: 12px;
    color: ${({ theme }) => theme.muted};
    line-height: 1.45;

    & + & {
        margin-top: 4px;
    }
`;