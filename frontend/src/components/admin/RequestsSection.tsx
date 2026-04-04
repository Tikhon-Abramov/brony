import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { selectPendingBookings } from '../../features/selectors';
import { approveBooking } from '../../features/bookingsSlice';
import { openRejectModal } from '../../features/uiSlice';
import { glassCard } from '../../styles/theme';
import RequestCard from './RequestCard';

export default function RequestsSection() {
    const dispatch = useAppDispatch();
    const pendingBookings = useAppSelector(selectPendingBookings);

    if (pendingBookings.length === 0) {
        return <EmptyState>Заявок на согласовании сейчас нет</EmptyState>;
    }

    return (
        <Section>
            {pendingBookings.map((item) => (
                <RequestCard
                    key={item.id}
                    booking={item}
                    onApprove={(id) => dispatch(approveBooking(id))}
                    onReject={(id) => dispatch(openRejectModal(id))}
                />
            ))}
        </Section>
    );
}

const Section = styled.section`
    display: grid;
    gap: 14px;
`;

const EmptyState = styled.div`
    ${glassCard};
    padding: 20px;
    text-align: center;
    color: ${({ theme }) => theme.muted};
`;