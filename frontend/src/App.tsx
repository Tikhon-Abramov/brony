import { AppRouter } from './routes/AppRouter';
import AuthModal from './components/modals/AuthModal';
import BookingModal from './components/modals/BookingModal';
import RejectReasonModal from './components/modals/RejectReasonModal';
import HistoryModal from './components/modals/HistoryModal';

export default function App() {
    return (
        <>
            <AppRouter />
            <AuthModal />
            <BookingModal />
            <RejectReasonModal />
            <HistoryModal />
        </>
    );
}