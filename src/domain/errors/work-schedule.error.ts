import DomainError from "./domain.error.js"

export default class WorkScheduleError extends DomainError {
    static invalidStartHour(): void {
        throw new WorkScheduleError('The start hour must be between 0 and 23.')
    }

    static invalidEndtHour(): void {
        throw new WorkScheduleError('The end hour must be between 0 and 23.')
    }

    static invalidInterval(): void {
        throw new WorkScheduleError('The start time of the period cannot be earlier than or equal to the end time.')
    }

    static firstPeriodNotInformed(): void {
        throw new WorkScheduleError('The first period interval was not informed.')
    }

    static lunchNotInformed(): void {
        throw new WorkScheduleError('The lunch interval was not informed.')
    }

    static secondPeriodNotInformed(): void {
        throw new WorkScheduleError('The second period interval was not informed.')
    }
}