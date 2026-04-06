import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { openBookingModal } from '../../features/uiSlice';
import { setSearch, setSelectedTime } from '../../features/bookingsSlice';
import { selectBookingsForSelectedDate } from '../../features/selectors';
import { getFreeSlots } from '../../utils/booking';
import { glassCard } from '../../styles/theme';

export default function QuickActions() {
    const dispatch = useAppDispatch();
    const bookingsForSelectedDate = useAppSelector(selectBookingsForSelectedDate);
    const freeSlots = getFreeSlots(bookingsForSelectedDate);

    const nearestFreeSlot = freeSlots[0] ?? null;

    const handleNearestSlot = () => {
        if (!nearestFreeSlot) return;
        dispatch(setSelectedTime(nearestFreeSlot));
    };

    const handleFindMyBookings = () => {
        const value = window.prompt('Введите ФИО, чтобы найти свои заявки');

        if (!value) return;

        dispatch(setSearch(value.trim()));
    };

    const handleClearSearch = () => {
        dispatch(setSearch(''));
    };

    return (
        <SectionCard>
            <SectionTitle>Быстрые действия</SectionTitle>

            <QuickList>
                <QuickItem onClick={() => dispatch(openBookingModal())}>
                    Забронировать на 30 минут
                </QuickItem>

                <QuickItem
                    onClick={handleNearestSlot}
                    disabled={!nearestFreeSlot}
                    title={nearestFreeSlot ? `Выбрать ${nearestFreeSlot}` : 'Нет свободных слотов'}
                >
                    {nearestFreeSlot
                        ? `Ближайшее свободное время — ${nearestFreeSlot}`
                        : 'Свободных слотов нет'}
                </QuickItem>

                <QuickItem onClick={handleFindMyBookings}>
                    Найти мои заявки по ФИО
                </QuickItem>

                <QuickItem onClick={handleClearSearch}>Очистить поиск по истории</QuickItem>
            </QuickList>
        </SectionCard>
    );
}

const SectionCard = styled.section`
    ${glassCard};
    padding: 20px;
`;

const SectionTitle = styled.h2`
    margin: 0 0 16px;
    font-size: 22px;
    font-weight: 700;

    @media (max-width: 700px) {
        font-size: 18px;
    }
`;

const QuickList = styled.div`
    display: grid;
    gap: 12px;
`;

const QuickItem = styled.button`
    padding: 16px;
    border-radius: 18px;
    border: 1px solid ${({ theme }) => theme.line};
    background: ${({ theme }) => theme.input};
    color: ${({ theme }) =>
            theme.mode === 'dark' ? 'rgba(255,255,255,.82)' : '#24425c'};
    text-align: left;
    cursor: pointer;
    transition:
            opacity 0.2s ease,
            transform 0.2s ease;

    &:hover:not(:disabled) {
        transform: translateY(-1px);
    }

    &:disabled {
        opacity: 0.55;
        cursor: not-allowed;
    }
`;