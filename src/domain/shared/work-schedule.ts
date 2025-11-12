import WorkScheduleError from "../errors/work-schedule.error.js"

class WorkSchedule {
    private _firstPeriod: WorkScheduleItem
    private _lunch: WorkScheduleItem
    private _secondPeriod: WorkScheduleItem

    constructor(
        firstPeriod: WorkScheduleItem,
        lunch: WorkScheduleItem,
        secondPeriod: WorkScheduleItem
    ) {
        this._firstPeriod = firstPeriod
        this._lunch = lunch
        this._secondPeriod = secondPeriod
    }

    get firstPeriod(): WorkScheduleItem {
        return this._firstPeriod
    }

    get lunch(): WorkScheduleItem {
        return this._lunch
    }

    get secondPeriod(): WorkScheduleItem {
        return this._secondPeriod
    }

    updateFirstPeriod(firstPeriod: WorkScheduleItem): void {
        this._secondPeriod = firstPeriod
    }

    updateLunch(lunch: WorkScheduleItem): void {
        this._lunch = lunch
    }

    updateSecondPeriod(secondPeriod: WorkScheduleItem): void {
        this._secondPeriod = secondPeriod
    }
}

class WorkScheduleItem {
    private _start: number
    private _end: number

    constructor(start: number, end: number) {
        this._start = start
        this._end = end

        this.validate()
    }

    get start(): number {
        return this._start
    }

    get end(): number {
        return this._end
    }

    update(start: number, end: number): void {
        this._start = start
        this._end = end
        
        this.validate()
    }

    private validate(): void {
        if (this._start <= this._end)
            WorkScheduleError.invalidWorkScheduleInterval()
    }
}

export type { WorkSchedule, WorkScheduleItem }