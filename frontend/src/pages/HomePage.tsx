import styled from 'styled-components';
import { useAppDispatch } from '../hooks/redux';
import { openAuthModal, openBookingModal } from '../features/uiSlice';
import Header from '../components/layout/Header';
import BookingSidebar from '../components/home/BookingSidebar';
import ScheduleSection from '../components/home/ScheduleSection';

export default function HomePage() {
    const dispatch = useAppDispatch();

    return (
        <Page>
            <AmbientGlow />
            <BlobLeft />
            <BlobRight />

            <Container>
                <Header
                    title="Бронирование"
                    subtitle="Бронирование конференц-зала и быстрый просмотр текущей занятости"
                    tertiaryAction={{
                        label: 'Войти как админ',
                        onClick: () => dispatch(openAuthModal()),
                    }}
                    primaryAction={{
                        label: 'Забронировать',
                        onClick: () => dispatch(openBookingModal()),
                    }}
                />

                <Layout>
                    <BookingSidebar />

                    <Main>
                        <ScheduleSection />
                    </Main>
                </Layout>
            </Container>
        </Page>
    );
}

const Page = styled.div`
    position: relative;
    min-height: 100vh;
    background: ${({ theme }) => theme.bg};
`;

const AmbientGlow = styled.div`
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background:
            radial-gradient(circle at top left, ${({ theme }) => theme.glow1}, transparent 22%),
            radial-gradient(circle at bottom right, ${({ theme }) => theme.glow2}, transparent 24%),
            radial-gradient(circle at 75% 20%, ${({ theme }) => theme.glow3}, transparent 16%);
`;

const BlobLeft = styled.div`
    position: fixed;
    width: 180px;
    height: 180px;
    left: -20px;
    top: -10px;
    border-radius: 50%;
    filter: blur(70px);
    background: ${({ theme }) => theme.blob1};
    pointer-events: none;
    z-index: 0;
`;

const BlobRight = styled.div`
    position: fixed;
    width: 260px;
    height: 260px;
    right: 10px;
    bottom: 10px;
    border-radius: 50%;
    filter: blur(70px);
    background: ${({ theme }) => theme.blob2};
    pointer-events: none;
    z-index: 0;
`;

const Container = styled.div`
    position: relative;
    z-index: 1;
    max-width: 1380px;
    margin: 0 auto;
    padding: 18px 20px 20px;

    @media (max-width: 700px) {
        padding: 14px 12px 18px;
    }
`;

const Layout = styled.div`
    display: grid;
    grid-template-columns: 270px minmax(0, 1fr);
    gap: 16px;
    align-items: start;

    @media (max-width: 980px) {
        grid-template-columns: 1fr;
    }
`;

const Main = styled.main`
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;