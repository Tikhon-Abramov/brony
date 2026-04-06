import { useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { selectAuth, selectPendingBookings } from '../../features/selectors';
import { replaceBooking } from '../../features/bookingsSlice';
import { openRejectModal } from '../../features/uiSlice';
import { glassCard } from '../../styles/theme';
import { api } from '../../services/api';
import RequestCard from './RequestCard';

export default function RequestsSection() {
    const dispatch = useAppDispatch();
    const pendingBookings = useAppSelector(selectPendingBookings);
    const auth = useAppSelector(selectAuth);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleApprove = async (id: string) => {
        if (!auth.token) return;

        try {
            setLoadingId(id);
            const updated = await api.approveBooking(id, auth.token);
            dispatch(replaceBooking(updated));
        } catch (error) {
            console.error('Failed to approve booking:', error);
        } finally {
            setLoadingId(null);
        }
    };

    if (pendingBookings.length === 0) {
        return <EmptyState>Заявок на согласовании сейчас нет</EmptyState>;
    }

    return (
        <Section>
            {pendingBookings.map((item) => (
                <DisabledWrap key={item.id} $disabled={loadingId === item.id}>
                    <RequestCard
                        booking={item}
                        onApprove={handleApprove}
                        onReject={(id) => dispatch(openRejectModal(id))}
                    />
                </DisabledWrap>
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

const DisabledWrap = styled.div<{ $disabled: boolean }>`
    opacity: ${({ $disabled }) => ($disabled ? 0.65 : 1)};
    pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};
`;