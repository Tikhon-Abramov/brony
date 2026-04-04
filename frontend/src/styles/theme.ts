import { css } from 'styled-components';

export const lightTheme = {
    mode: 'light',
    bg: '#f4f7fb',
    panel: 'rgba(255,255,255,0.82)',
    panel2: 'rgba(244,247,251,0.88)',
    text: '#17212b',
    muted: 'rgba(23,33,43,.62)',
    line: 'rgba(23,33,43,.09)',
    telegram: '#229ED9',
    cyan: 'rgba(34,158,217,.14)',
    success: '#34d399',
    danger: '#fb7185',
    warning: '#f59e0b',
    input: 'rgba(255,255,255,.7)',
    bookingGradient:
        'linear-gradient(90deg, rgba(34,158,217,.20), rgba(80,190,255,.18), rgba(168,85,247,.18))',
    shadow: '0 18px 50px rgba(15, 23, 42, 0.12)',
    glow1: 'rgba(94,92,230,.16)',
    glow2: 'rgba(255,111,145,.14)',
    glow3: 'rgba(0,209,178,.10)',
    blob1: 'rgba(217,70,239,.18)',
    blob2: 'rgba(139,92,246,.14)',
};

export const darkTheme = {
    mode: 'dark',
    bg: '#0e0f14',
    panel: 'rgba(21,24,33,.88)',
    panel2: 'rgba(17,20,28,.78)',
    text: '#ffffff',
    muted: 'rgba(255,255,255,.58)',
    line: 'rgba(255,255,255,.09)',
    telegram: '#229ED9',
    cyan: 'rgba(34,158,217,.18)',
    success: '#34d399',
    danger: '#fb7185',
    warning: '#f59e0b',
    input: 'rgba(255,255,255,.05)',
    bookingGradient:
        'linear-gradient(90deg, rgba(217,70,239,.30), rgba(139,92,246,.24), rgba(34,158,217,.22))',
    shadow: '0 18px 50px rgba(0,0,0,.28)',
    glow1: 'rgba(94,92,230,.35)',
    glow2: 'rgba(255,111,145,.28)',
    glow3: 'rgba(0,209,178,.16)',
    blob1: 'rgba(217,70,239,.28)',
    blob2: 'rgba(139,92,246,.20)',
};

export const glassCard = css`
  background: ${({ theme }) => theme.panel};
  border: 1px solid ${({ theme }) => theme.line};
  border-radius: 28px;
  box-shadow: ${({ theme }) => theme.shadow};
  backdrop-filter: blur(18px);
`;

export type AppTheme = typeof darkTheme;