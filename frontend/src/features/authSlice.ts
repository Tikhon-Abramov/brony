import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AdminProfile {
    id: string;
    fullName: string;
    login: string;
}

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    profile: AdminProfile | null;
}

const AUTH_STORAGE_KEY = 'conference-room-admin-auth';

const getInitialAuthState = (): AuthState => {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);

        if (!raw) {
            return {
                isAuthenticated: false,
                token: null,
                profile: null,
            };
        }

        const parsed = JSON.parse(raw) as AuthState;

        return {
            isAuthenticated: Boolean(parsed.isAuthenticated && parsed.token),
            token: parsed.token ?? null,
            profile: parsed.profile ?? null,
        };
    } catch {
        return {
            isAuthenticated: false,
            token: null,
            profile: null,
        };
    }
};

const persistAuthState = (state: AuthState) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
};

const initialState: AuthState = getInitialAuthState();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(
            state,
            action: PayloadAction<{ token: string; profile: AdminProfile }>,
        ) {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.profile = action.payload.profile;

            persistAuthState(state);
        },
        logout(state) {
            state.isAuthenticated = false;
            state.token = null;
            state.profile = null;

            persistAuthState(state);
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;