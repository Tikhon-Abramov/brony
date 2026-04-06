import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { selectAuth } from '../features/selectors';
import { openAuthModal } from '../features/uiSlice';
import { logout } from '../features/authSlice';
import { glassCard } from '../styles/theme';
import Header from '../components/layout/Header';
import RequestsSection from '../components/admin/RequestsSection';

export default function AdminPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const auth = useAppSelector(selectAuth);

    if (!auth.isAuthenticated) {
        return (
            <Page>
                <Container>
                    <CenteredCard>
                        <Title>Администрирование заявок</Title>
                        <Subtitle>
                            Для просмотра и обработки заявок нужно войти как администратор
                        </Subtitle>

                        <Actions>
                            <PrimaryButton onClick={() => dispatch(openAuthModal())}>
                                Войти
                            </PrimaryButton>
                            <GhostButton onClick={() => navigate('/')}>На главную</GhostButton>
                        </Actions>
                    </CenteredCard>
                </Container>
            </Page>
        );
    }

    return (
        <Page>
            <Container>
                <Header
                    title="Меню администратора"
                    subtitle="Подтверждайте или отклоняйте заявки. Причина отказа обязательна."
                    tertiaryAction={{
                        label: 'Выйти',
                        onClick: () => {
                            dispatch(logout());
                            navigate('/');
                        },
                    }}
                    secondaryAction={{
                        label: 'На главную',
                        onClick: () => navigate('/'),
                    }}
                />

                <RequestsSection />
            </Container>
        </Page>
    );
}

const Page = styled.div`
    min-height: 100vh;
    background: ${({ theme }) => theme.bg};
`;

const Container = styled.div`
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 24px 40px;

    @media (max-width: 700px) {
        padding: 18px 14px 28px;
    }
`;

const CenteredCard = styled.div`
    ${glassCard};
    max-width: 560px;
    margin: 80px auto 0;
    padding: 28px;
`;

const Title = styled.h1`
    margin: 0 0 8px;
    font-size: 28px;
`;

const Subtitle = styled.p`
    margin: 0;
    color: ${({ theme }) => theme.muted};
    line-height: 1.5;
`;

const Actions = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 24px;
    flex-wrap: wrap;
`;

const BaseButton = styled.button`
    border: 1px solid ${({ theme }) => theme.line};
    color: ${({ theme }) =>
            theme.mode === 'dark' ? 'rgba(255,255,255,.84)' : '#24425c'};
    padding: 12px 16px;
    border-radius: 18px;
    cursor: pointer;
    font-size: 14px;
`;

const PrimaryButton = styled(BaseButton)`
    background: ${({ theme }) => theme.cyan};
    color: ${({ theme }) => (theme.mode === 'dark' ? '#c8efff' : '#0f4d73')};
    border-color: rgba(125, 220, 255, 0.28);
    font-weight: 600;
`;

const GhostButton = styled(BaseButton)`
    background: ${({ theme }) => theme.input};
`;