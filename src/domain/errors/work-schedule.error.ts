import DomainError from "./domain.error.js"

export default class WorkScheduleError extends DomainError {
    static invalidStartHour(): void {
        throw new WorkScheduleError('O horário de início deve conter um valor de 0 a 23.')
    }

    static invalidEndHour(): void {
        throw new WorkScheduleError('O horário de fim deve conter um valor de 0 a 23.')
    }

    static invalidInterval(): void {
        throw new WorkScheduleError('O horário de início do período não pode ser igual ou superior ao horário final.')
    }

    static firstPeriodNotInformed(): void {
        throw new WorkScheduleError('O primeiro período não foi informado.')
    }

    static lunchNotInformed(): void {
        throw new WorkScheduleError('O horário de almoço não foi informado.')
    }

    static secondPeriodNotInformed(): void {
        throw new WorkScheduleError('O segundo período não foi informado.')
    }

    static firstPeriodConflictWithLunch(): void {
        throw new WorkScheduleError('O primeiro período está em conflito com o horário de almoço.')
    }

    static firstPeriodAfterLunch(): void {
        throw new WorkScheduleError('O horário do primeiro período deve ser anterior ao horário de almoço.')
    }

    static firstPeriodAfterSecondPeriod(): void {
        throw new WorkScheduleError('O horário do primeiro período deve ser anterior ao segundo período.')
    }

    static firstPeriodConflictWithSecondPeriod(): void {
        throw new WorkScheduleError('O primeiro período está em conflito com o horário do segundo período.')
    }

    static lunchPeriodConflictWithSecondPeriod(): void {
        throw new WorkScheduleError('O horário de almoço está em conflito com o horário do segundo período.')
    }

    static secondPeriodBeforeLunch(): void {
        throw new WorkScheduleError('O horário do segundo período deve ser após ao horário de almoço.')
    }
}