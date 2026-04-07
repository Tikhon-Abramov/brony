import styled from 'styled-components';
import type { BookingItem } from '../../services/mocks';

interface RequestCardProps {
    booking: BookingItem;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

const BOOKING_STATUSES: Record<BookingItem['status'], string> = {
    pending: 'На согласовании',
    approved: 'Подтверждена',
    rejected: 'Отклонена',
    unreviewed: 'Не рассмотрено',
};

export default function RequestCard({
                                        booking,
                                        onApprove,
                                        onReject,
                                    }: RequestCardProps) {
    return (
        <Card>
            <TopRow>
                <TitleBlock>
                    <Name>{booking.fullName}</Name>
                    <PendingBadge $status={booking.status}>
                        {BOOKING_STATUSES[booking.status]}
                    </PendingBadge>
                </TitleBlock>

                <Actions>
                    <ApproveButton type="button" onClick={() => onApprove(booking.id)}>
                        Подтвердить
                    </ApproveButton>

                    <RejectButton type="button" onClick={() => onReject(booking.id)}>
                        Отклонить
                    </RejectButton>
                </Actions>
            </TopRow>

            <MetaList>
                <Meta>Помещение: {booking.roomName}</Meta>
                <Meta>Отдел: {booking.department || '—'}</Meta>
                <Meta>Дата: {booking.date}</Meta>
                <Meta>
                    Время: {booking.startTime} — {booking.endTime}
                </Meta>
            </MetaList>

            <Purpose>{booking.purpose}</Purpose>
        </Card>
    );
}

const Card = styled.article`
  padding: 18px;
  border-radius: 22px;
  border: 1px solid ${({ theme }) => theme.line};
  background: ${({ theme }) => theme.panel};
  box-shadow: ${({ theme }) => theme.shadow};
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 14px;

  @media (max-width: 760px) {
    flex-direction: column;
  }
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Name = styled.h3`
    margin: 0;
    font-size: 18px;
`;

const PendingBadge = styled.span<{ $status: BookingItem['status'] }>`
    width: fit-content;
    border-radius: 999px;
    padding: 6px 10px;
    font-size: 12px;
    background: ${({ $status }) => {
        if ($status === 'approved') return 'rgba(52,211,153,.15)';
        if ($status === 'rejected') return 'rgba(251,113,133,.14)';
        if ($status === 'unreviewed') return 'rgba(148,163,184,.18)';
        return 'rgba(245,158,11,.16)';
    }};
    color: ${({ $status }) => {
        if ($status === 'approved') return '#5da577';
        if ($status === 'rejected') return '#ae7078';
        if ($status === 'unreviewed') return '#848a91';
        return '#9a812f';
    }};
`;

const Actions = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
`;

const BaseButton = styled.button`
    min-height: 42px;
    padding: 10px 14px;
    border-radius: 14px;
    border: 1px solid ${({ theme }) => theme.line};
    cursor: pointer;
    font-size: 14px;
`;

const ApproveButton = styled(BaseButton)`
    background: rgba(52, 211, 153, 0.14);
    color: #86efac;
`;

const RejectButton = styled(BaseButton)`
    background: rgba(251, 113, 133, 0.14);
    color: #fda4af;
`;

const MetaList = styled.div`
    display: grid;
    gap: 6px;
    margin-bottom: 12px;
`;

const Meta = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme.muted};
`;

const Purpose = styled.p`
    margin: 0;
    font-size: 15px;
    line-height: 1.5;
`;