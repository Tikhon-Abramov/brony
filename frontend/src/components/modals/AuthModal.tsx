import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { closeAuthModal } from '../../features/uiSlice';
import { loginSuccess } from '../../features/authSlice';
import { api } from '../../services/api';

export default function AuthModal() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isOpen = useAppSelector((state) => state.ui.authModalOpen);

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleClose = () => {
        dispatch(closeAuthModal());
        setLogin('');
        setPassword('');
        setError('');
        setIsSubmitting(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            setIsSubmitting(true);
            const result = await api.loginAdmin({ login, password });
            dispatch(loginSuccess(result));
            handleClose();
            navigate('/admin');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка входа');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Overlay onClick={handleClose}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
                <Top>
                    <Title>Вход администратора</Title>
                    <CloseButton type="button" onClick={handleClose}>
                        ✕
                    </CloseButton>
                </Top>

                <Form onSubmit={handleSubmit}>
                    <Field>
                        <Label htmlFor="admin-login">Логин</Label>
                        <Input
                            id="admin-login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            placeholder="Введи логин"
                        />
                    </Field>

                    <Field>
                        <Label htmlFor="admin-password">Пароль</Label>
                        <Input
                            id="admin-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введи пароль"
                        />
                    </Field>

                    {error && <ErrorText>{error}</ErrorText>}

                    <Actions>
                        <GhostButton type="button" onClick={handleClose} disabled={isSubmitting}>
                            Отмена
                        </GhostButton>

                        <PrimaryButton type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Вход...' : 'Войти'}
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
    max-width: 460px;
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
    margin-bottom: 18px;
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

const Input = styled.input`
    width: 100%;
    min-height: 48px;
    padding: 12px 14px;
    border-radius: 16px;
    border: 1px solid ${({ theme }) => theme.line};
    background: ${({ theme }) => theme.input};
    color: ${({ theme }) => theme.text};
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