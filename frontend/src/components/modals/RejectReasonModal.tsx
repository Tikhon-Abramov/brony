import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { closeRejectModal } from '../../features/uiSlice';
import { replaceBooking } from '../../features/bookingsSlice';
import { api } from '../../services/api';

export default function RejectReasonModal() {
    const dispatch = useAppDispatch();
    const { rejectModalOpen, rejectBookingId } = useAppSelector((state) => state.ui);
    const bookings = useAppSelector((state) => state.bookings.items);
    const auth = useAppSelector((state) => state.auth);

    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const booking = useMemo(
        () => bookings.find((item) => item.id === rejectBookingId) || null,
        [bookings, rejectBookingId],
    );

    if (!rejectModalOpen || !rejectBookingId || !booking) return null;

    const handleClose = () => {
        dispatch(closeRejectModal());
        setReason('');
        setError('');
        setIsSubmitting(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!reason.trim()) {
            setError('Укажи причину отклонения');
            return;
        }

        if (!auth.token) {
            setError('Требуется авторизация администратора');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');

            const updated = await api.rejectBooking(
                rejectBookingId,
                reason.trim(),
                auth.token,
            );

            dispatch(replaceBooking(updated));
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка отклонения');
        } finally {
            setIsSubmitting(false);
        }
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
                            onChange={(e) => {
                                setReason(e.target.value);
                                setError('');
                            }}
                            placeholder="Укажи причину"
                        />
                    </Field>

                    {error && <ErrorText>{error}</ErrorText>}

                    <Actions>
                        <GhostButton type="button" onClick={handleClose} disabled={isSubmitting}>
                            Отмена
                        </GhostButton>

                        <PrimaryButton type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Сохраняю...' : 'Отклонить'}
                        </PrimaryButton>
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
    z-index: 1100;
`;

const ModalCard = styled.div`
    width: 100%;
    max-width: 560px;
    border-radius: 28px;
    border: 1px solid ${({ theme }) => theme.line};
    background: ${({ theme }) => theme.panel};
    box-shadow: ${({ theme }) => theme.shadow};
    padding: 22px;
`;

const Top = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
    margin-bottom: 14px;
`;

const Title = styled.h2`
    margin: 0;
    font-size: 24px;
`;

const CloseButton = styled.button`
    width: 36px;
    height: 36px;
    border-radius: 12px;
    background: ${({ theme }) => theme.input};
    color: ${({ theme }) => theme.text};
    cursor: pointer;
`;

const Meta = styled.p`
    margin: 0 0 16px;
    color: ${({ theme }) => theme.muted};
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
    font-size: 13px;
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
`;

const ErrorText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.danger};
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

const BaseButton = styled.button`
  min-height: 46px;
  padding: 12px 16px;
  border-radius: 16px;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.line};
  font-size: 14px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const GhostButton = styled(BaseButton)`
  background: ${({ theme }) => theme.input};
  color: ${({ theme }) => theme.text};
`;

const PrimaryButton = styled(BaseButton)`
  background: ${({ theme }) => theme.cyan};
  color: ${({ theme }) => (theme.mode === 'dark' ? '#c8efff' : '#0f4d73')};
  border-color: rgba(125, 220, 255, 0.28);
  font-weight: 600;
`;