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

    if (!isOpen) return null;

    const handleClose = () => {
        dispatch(closeAuthModal());
        setLogin('');
        setPassword('');
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError('');

        try {
            const result = await api.loginAdmin({ login, password });
            dispatch(loginSuccess(result));
            handleClose();
            navigate('/admin');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка входа');
        }
    };

    return (
        <Overlay onClick={handleClose}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
                <Top>
                    <Title>Вход для администратора</Title>
                    <CloseButton onClick={handleClose}>✕</CloseButton>
                </Top>


                <Form onSubmit={handleSubmit}>
                    <Field>
                        <Label>Логин</Label>
                        <Input
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            placeholder="Введите логин"
                        />
                    </Field>

                    <Field>
                        <Label>Пароль</Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль"
                        />
                    </Field>

                    {error && <ErrorText>{error}</ErrorText>}

                    <Actions>
                        <GhostButton type="button" onClick={handleClose}>
                            Отмена
                        </GhostButton>
                        <PrimaryButton type="submit">Войти</PrimaryButton>
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
  max-width: 460px;
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

const Subtitle = styled.p`
  margin: 0 0 20px;
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

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid ${({ theme }) => theme.line};
  background: ${({ theme }) => theme.input};
  color: ${({ theme }) => theme.text};

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

const PrimaryButton = styled(BaseButton)`
  background: ${({ theme }) => theme.cyan};
  color: ${({ theme }) => (theme.mode === 'dark' ? '#c8efff' : '#0f4d73')};
  border-color: rgba(125, 220, 255, 0.28);
  font-weight: 600;
`;