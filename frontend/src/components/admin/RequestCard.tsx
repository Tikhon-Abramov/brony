import styled from 'styled-components';
import type { BookingItem } from '../../services/mocks';
import { BOOKING_STATUSES } from '../../utils/constants';
import { formatDateTimeLabel } from '../../utils/date';
import { glassCard } from '../../styles/theme';

interface RequestCardProps {
    booking: BookingItem;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

export default function RequestCard({
                                        booking,
                                        onApprove,
                                        onReject,
                                    }: RequestCardProps) {
    return (
        <Card>
            <Top>
                <Name>{booking.fullName}</Name>
                <PendingBadge>{BOOKING_STATUSES[booking.status]}</PendingBadge>
            </Top>

            <Purpose>{booking.purpose}</Purpose>

            <Meta>{formatDateTimeLabel(booking.date, booking.startTime, booking.endTime)}</Meta>

            {booking.department && <Meta>Отдел: {booking.department}</Meta>}
            <Meta>Помещение: {booking.roomName}</Meta>

            <Actions>
                <ApproveButton onClick={() => onApprove(booking.id)}>Подтвердить</ApproveButton>
                <RejectButton onClick={() => onReject(booking.id)}>Отклонить</RejectButton>
            </Actions>
        </Card>
    );
}

const Card = styled.article`
  ${glassCard};
  padding: 18px;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 10px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const Name = styled.h3`
  margin: 0;
  font-size: 18px;
`;

const PendingBadge = styled.span`
  font-size: 12px;
  border-radius: 999px;
  padding: 6px 10px;
  white-space: nowrap;
  background: rgba(245, 158, 11, 0.16);
  color: #fcd34d;
`;

const Purpose = styled.p`
  margin: 0 0 8px;
  font-size: 15px;
`;

const Meta = styled.p`
  margin: 0 0 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.muted};
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;
`;

const ApproveButton = styled.button`
  padding: 10px 14px;
  border-radius: 14px;
  cursor: pointer;
  background: rgba(52, 211, 153, 0.14);
  color: #86efac;
  border: 1px solid rgba(52, 211, 153, 0.2);
`;

const RejectButton = styled.button`
  padding: 10px 14px;
  border-radius: 14px;
  cursor: pointer;
  background: rgba(251, 113, 133, 0.12);
  color: #fda4af;
  border: 1px solid rgba(251, 113, 133, 0.18);
`;