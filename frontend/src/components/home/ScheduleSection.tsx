import styled from 'styled-components';
import { useAppSelector } from '../../hooks/redux';
import {
    selectBookingsForSelectedDate,
    selectFilteredTodayBookings,
} from '../../features/selectors';
import { glassCard } from '../../styles/theme';
import ScheduleGrid from './ScheduleGrid';
import { getBookingStatusLabel } from '../../utils/booking';

export default function ScheduleSection() {
    const bookingsForSelectedDate = useAppSelector(selectBookingsForSelectedDate);
    const todayBookings = useAppSelector(selectFilteredTodayBookings);

    return (
        <SectionCard>
            <SectionHeader>
                <div>
                    <SectionTitle>Расписание и выбор времени</SectionTitle>
                    <Subtitle>
                        Наведи на занятую бронь, чтобы увидеть точное время начала и окончания
                    </Subtitle>
                </div>
            </SectionHeader>

            <GridScroller>
                <ScheduleGrid bookings={bookingsForSelectedDate} />
            </GridScroller>

            <BottomBlock>
                <BookingsCard>
                    <InfoTitle>Брони на текущий день</InfoTitle>

                    {todayBookings.length === 0 ? (
                        <InfoText>На текущий день заявок пока нет</InfoText>
                    ) : (
                        <TodayGrid>
                            {todayBookings.map((item) => (
                                <HistoryCard key={item.id}>
                                    <CardTop>
                                        <CardName>{item.fullName}</CardName>
                                        <StatusBadge $status={item.status}>
                                            {getBookingStatusLabel(item.status)}
                                        </StatusBadge>
                                    </CardTop>

                                    <CardText>{item.purpose}</CardText>

                                    <CardMeta>
                                        {item.department ? `${item.department} · ` : ''}
                                        {item.startTime} — {item.endTime}
                                    </CardMeta>
                                </HistoryCard>
                            ))}
                        </TodayGrid>
                    )}
                </BookingsCard>
            </BottomBlock>
        </SectionCard>
    );
}

const SectionCard = styled.section`
    ${glassCard};
    padding: 16px;
    min-width: 0;
    overflow: visible;
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
    margin-bottom: 14px;
    flex-wrap: wrap;
`;

const SectionTitle = styled.h2`
    margin: 0 0 8px;
    font-size: 20px;
    font-weight: 700;
`;

const Subtitle = styled.p`
    margin: 0;
    font-size: 13px;
    color: ${({ theme }) => theme.muted};
`;

const GridScroller = styled.div`
    width: 100%;
    min-width: 0;
    overflow-x: auto;
    overflow-y: visible;
`;

const BottomBlock = styled.div`
    margin-top: 16px;
`;

const BookingsCard = styled.div`
    padding: 16px;
    border-radius: 20px;
    border: 1px solid ${({ theme }) => theme.line};
    background: ${({ theme }) => theme.input};
`;

const InfoTitle = styled.h3`
    margin: 0 0 12px;
    font-size: 16px;
`;

const InfoText = styled.p`
    margin: 0;
    color: ${({ theme }) => theme.muted};
`;

const TodayGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;

    @media (max-width: 820px) {
        grid-template-columns: 1fr;
    }
`;

const HistoryCard = styled.article`
    padding: 14px;
    border-radius: 18px;
    border: 1px solid ${({ theme }) => theme.line};
    background: ${({ theme }) => theme.panel2};
`;

const CardTop = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 10px;

    @media (max-width: 640px) {
        flex-direction: column;
    }
`;

const CardName = styled.h3`
    margin: 0;
    font-size: 15px;
`;

const CardText = styled.p`
    margin: 0 0 8px;
    color: ${({ theme }) => (theme.mode === 'dark' ? 'rgba(255,255,255,.88)' : '#24425c')};
`;

const CardMeta = styled.p`
    margin: 0;
    font-size: 13px;
    color: ${({ theme }) => theme.muted};
`;

const StatusBadge = styled.span<{ $status: 'pending' | 'approved' | 'rejected' }>`
    font-size: 12px;
    border-radius: 999px;
    padding: 6px 10px;
    white-space: nowrap;
    background: ${({ $status }) => {
        if ($status === 'approved') return 'rgba(52,211,153,.15)';
        if ($status === 'rejected') return 'rgba(251,113,133,.14)';
        return 'rgba(245,158,11,.16)';
    }};
    color: ${({ $status }) => {
        if ($status === 'approved') return '#86efac';
        if ($status === 'rejected') return '#fda4af';
        return '#fcd34d';
    }};
`;