export function timeToMinutes(value) {
    const [hours, minutes] = value.split(':').map(Number);
    return hours * 60 + minutes;
}

export function isTimeRangeValid(startTime, endTime) {
    return timeToMinutes(endTime) > timeToMinutes(startTime);
}

export function isDateTimeInPast(date, time) {
    const target = new Date(`${date}T${time}:00`);
    return target.getTime() < Date.now();
}