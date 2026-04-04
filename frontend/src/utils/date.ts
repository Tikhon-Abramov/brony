const pad = (value: number) => String(value).padStart(2, '0');

export function formatDateToInputValue(date: Date) {
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    return `${year}-${month}-${day}`;
}

export function formatDateLabel(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(date);
}

export function formatDateTimeLabel(date: string, startTime: string, endTime: string) {
    return `${formatDateLabel(date)} · ${startTime} — ${endTime}`;
}

export function isToday(value: string) {
    return formatDateToInputValue(new Date()) === value;
}