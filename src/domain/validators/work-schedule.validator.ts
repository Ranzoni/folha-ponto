function workScheduleHourIsValid(hour: number): boolean {
    return hour >= 0 && hour <= 23
}

function workScheduleIntervalIsValid(start: number, end: number): boolean {
    return start < end
}

export { workScheduleHourIsValid, workScheduleIntervalIsValid }