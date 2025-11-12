import DomainError from "./domain.error.js"

export default class WorkScheduleError extends DomainError {
    static invalidWorkScheduleInterval(): void {
        throw new WorkScheduleError('The start time of the period cannot be earlier than or equal to the end time.')
    }
}