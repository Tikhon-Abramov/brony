import { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { openAuthModal } from '../features/uiSlice';
import { logout } from '../features/authSlice';
import { setBookings } from '../features/bookingsSlice';
import { glassCard } from '../styles/theme';
import Header from '../components/layout/Header';
import RequestsSection from '../components/admin/RequestsSection';
import { api } from '../services/api';

export default function AdminPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const auth = useAppSelector((state) => state.auth);

    useEffect(() => {
        let cancelled = false;

        const loadBookings = async () => {
            try {
                const items = await api.getBookings();

                if (!cancelled) {
                    dispatch(setBookings(items));
                }
            } catch (error) {
                console.error('Failed to load bookings:', error);
            }
        };

        loadBookings();

        return () => {
            cancelled = true;
        };
    }, [dispatch]);

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
                            <PrimaryButton type="button" onClick={() => dispatch(openAuthModal())}>
                                Войти
                            </PrimaryButton>

                            <GhostButton type="button" onClick={() => navigate('/')}>
                                На главную
                            </GhostButton>
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
                    title="Администрирование"
                    subtitle="обработка заявок на бронирование переговорной"
                    tertiaryAction={{
                        label: 'На главную',
                        onClick: () => navigate('/'),
                    }}
                    primaryAction={{
                        label: 'Выйти',
                        onClick: () => {
                            dispatch(logout());
                            navigate('/');
                        },
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
    max-width: 1180px;
    margin: 0 auto;
    padding: 18px 20px 20px;
`;

const CenteredCard = styled.section`
    ${glassCard};
    max-width: 560px;
    margin: 80px auto 0;
    padding: 24px;
    text-align: center;
`;

const Title = styled.h1`
    margin: 0 0 12px;
    font-size: 28px;
`;

const Subtitle = styled.p`
    margin: 0;
    color: ${({ theme }) => theme.muted};
    line-height: 1.55;
`;

const Actions = styled.div`
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 20px;
    flex-wrap: wrap;
`;

const BaseButton = styled.button`
    min-height: 46px;
    padding: 12px 16px;
    border-radius: 16px;
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.line};
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
    color: ${({ theme }) => theme.text};
`;