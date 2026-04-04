import styled from 'styled-components';
import { useAppSelector } from '../../hooks/redux';
import { selectFilteredHistory } from '../../features/selectors';
import { glassCard } from '../../styles/theme';

export default function HistorySection() {
    const history = useAppSelector(selectFilteredHistory);

    return (
        <SectionCard>
            <SectionTitle>История заявок</SectionTitle>

            {history.length === 0 ? (
                <EmptyState>По текущим фильтрам ничего не найдено</EmptyState>
            ) : (
                <HistoryGrid>
                    {history.map((item) => (
                        <HistoryCard key={item.id}>
                            <CardTop>
                                <CardName>{item.fullName}</CardName>
                                <StatusBadge $status={item.status}>
                                    {item.status === 'pending'
                                        ? 'На согласовании'
                                        : item.status === 'approved'
                                            ? 'Подтверждена'
                                            : 'Отклонена'}
                                </StatusBadge>
                            </CardTop>

                            <CardText>{item.purpose}</CardText>
                            <CardMeta>
                                {item.date} · {item.startTime} — {item.endTime}
                            </CardMeta>

                            {item.rejectionReason && (
                                <RejectReason>Причина: {item.rejectionReason}</RejectReason>
                            )}
                        </HistoryCard>
                    ))}
                </HistoryGrid>
            )}
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

const HistoryGrid = styled.div`
  display: grid;
  gap: 12px;
`;

const HistoryCard = styled.article`
  padding: 16px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.line};
  background: ${({ theme }) => theme.input};
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
  font-size: 16px;
`;

const CardText = styled.p`
  margin: 0 0 8px;
  color: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(255,255,255,.88)' : '#24425c'};
`;

const CardMeta = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.muted};
`;

const EmptyState = styled.div`
  padding: 18px;
  border-radius: 18px;
  border: 1px dashed ${({ theme }) => theme.line};
  color: ${({ theme }) => theme.muted};
  text-align: center;
`;

const RejectReason = styled.p`
  margin: 10px 0 0;
  font-size: 13px;
  color: ${({ theme }) => theme.danger};
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