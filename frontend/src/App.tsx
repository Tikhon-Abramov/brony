import styled from 'styled-components';
import AuthModal from './components/modals/AuthModal';
import BookingModal from './components/modals/BookingModal';
import RejectReasonModal from './components/modals/RejectReasonModal';
import HistoryModal from './components/modals/HistoryModal';
import BookingsRealtimeSync from './components/system/BookingsRealtimeSync';
import { AppRouter } from './routes/AppRouter';

export default function App() {
    return (
        <Shell>
            <BookingsRealtimeSync />
            <AppRouter />
            <AuthModal />
            <BookingModal />
            <RejectReasonModal />
            <HistoryModal />
        </Shell>
    );
}

const Shell = styled.div`
    min-height: 100vh;
`;