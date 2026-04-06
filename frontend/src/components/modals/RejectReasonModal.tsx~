import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { closeRejectModal } from '../../features/uiSlice';
import { rejectBooking } from '../../features/bookingsSlice';

export default function RejectReasonModal() {
    const dispatch = useAppDispatch();
    const { rejectModalOpen, rejectBookingId } = useAppSelector((state) => state.ui);
    const bookings = useAppSelector((state) => state.bookings.items);

    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const booking = useMemo(
        () => bookings.find((item) => item.id === rejectBookingId) || null,
        [bookings, rejectBookingId],
    );

    if (!rejectModalOpen || !rejectBookingId || !booking) return null;

    const handleClose = () => {
        dispatch(closeRejectModal());
        setReason('');
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!reason.trim()) {
            setError('Укажи причину отклонения');
            return;
        }

        dispatch(
            rejectBooking({
                id: rejectBookingId,
                reason: reason.trim(),
            }),
        );

        handleClose();
    };

    return (
        <Overlay onClick={handleClose}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
                <Top>
                    <Title>Отклонить заявку</Title>
                    <CloseButton onClick={handleClose}>✕</CloseButton>
                </Top>

                <Meta>
                    {booking.fullName} · {booking.date} · {booking.startTime} — {booking.endTime}
                </Meta>

                <Form onSubmit={handleSubmit}>
                    <Field>
                        <Label>Причина отклонения</Label>
                        <Textarea
                            rows={5}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Например, это время уже зарезервировано для другого внутреннего совещания"
                        />
                    </Field>

                    {error && <ErrorText>{error}</ErrorText>}

                    <Actions>
                        <GhostButton type="button" onClick={handleClose}>
                            Отмена
                        </GhostButton>
                        <DangerButton type="submit">Отклонить заявку</DangerButton>
                    </Actions>
                </Form>
            </ModalCard>
        </Overlay>
    );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(8, 10, 16, 0.68);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 560px;
  border-radius: 28px;
  border: 1px solid ${({ theme }) => theme.line};
  background: ${({ theme }) => theme.panel};
  box-shadow: ${({ theme }) => theme.shadow};
  backdrop-filter: blur(18px);
  padding: 22px;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
`;

const Meta = styled.p`
  margin: 0 0 18px;
  color: ${({ theme }) => theme.muted};
  line-height: 1.5;
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: ${({ theme }) => theme.input};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Field = styled.div``;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.muted};
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid ${({ theme }) => theme.line};
  background: ${({ theme }) => theme.input};
  color: ${({ theme }) => theme.text};
  resize: vertical;
  min-height: 120px;

  &::placeholder {
    color: ${({ theme }) => theme.muted};
  }
`;

const ErrorText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.danger};
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 6px;
  flex-wrap: wrap;
`;

const BaseButton = styled.button`
  padding: 12px 16px;
  border-radius: 18px;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.line};
  font-size: 14px;
`;

const GhostButton = styled(BaseButton)`
  background: ${({ theme }) => theme.input};
  color: ${({ theme }) => theme.text};
`;

const DangerButton = styled(BaseButton)`
  background: rgba(251, 113, 133, 0.12);
  color: #fda4af;
  border-color: rgba(251, 113, 133, 0.18);
  font-weight: 600;
`;