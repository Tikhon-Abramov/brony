// src/routes/AppRouter.tsx
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AdminPage from '../pages/AdminPage';

export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
        </Routes>
    );
};