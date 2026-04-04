export function formatDurationInput(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4);

    if (digits.length <= 2) {
        return digits;
    }

    return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

export function normalizeDuration(value: string) {
    if (!value.includes(':')) return value;

    const [h, m] = value.split(':');

    const hours = String(Number(h || 0)).padStart(2, '0');
    const minutes = String(Number(m || 0)).padStart(2, '0');

    return `${hours}:${minutes}`;
}