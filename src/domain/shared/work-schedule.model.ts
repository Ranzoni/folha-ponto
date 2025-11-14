import WorkScheduleError from "../errors/work-schedule.error.js"
import { workScheduleHourIsValid, workScheduleIntervalIsValid } from "../validators/work-schedule.validator.js"
import type { IWorkSchedule, IWorkScheduleItem } from "./interfaces/work-schedule.interface.js"

class WorkSchedule implements IWorkSchedule {
    private _firstPeriod: WorkScheduleItem
    private _lunch: WorkScheduleItem | undefined
    private _secondPeriod: WorkScheduleItem | undefined

    constructor(
        firstPeriod: WorkScheduleItem,
        lunch?: WorkScheduleItem,
        secondPeriod?: WorkScheduleItem
    ) {
        this._firstPeriod = firstPeriod
        this._lunch = lunch
        this._secondPeriod = secondPeriod

        this.validateFirstPeriod()
    }

    get firstPeriod(): WorkScheduleItem {
        return this._firstPeriod
    }

    get lunch(): WorkScheduleItem | undefined {
        return this._lunch
    }

    get secondPeriod(): WorkScheduleItem | undefined {
        return this._secondPeriod
    }

    updateFirstPeriod(firstPeriod: WorkScheduleItem): void {
        this._firstPeriod = firstPeriod
        this.validateFirstPeriod()
    }

    updateLunch(lunch: WorkScheduleItem): void {
        this._lunch = lunch
        this.validateLunchPeriod()
    }

    updateSecondPeriod(secondPeriod: WorkScheduleItem): void {
        this._secondPeriod = secondPeriod
        this.validateSecondPeriod()
    }

    removeLunch(): void {
        this._lunch = undefined
    }

    removeSecondPeriod(): void {
        this._secondPeriod = undefined
    }

    private validateFirstPeriod(): void {
        if (!this._firstPeriod)
            WorkScheduleError.firstPeriodNotInformed()
    }
    
    private validateLunchPeriod(): void {
        if (!this._lunch)
            WorkScheduleError.lunchNotInformed()
    }

    private validateSecondPeriod(): void {
        if (!this._secondPeriod)
            WorkScheduleError.secondPeriodNotInformed()
    }
}

class WorkScheduleItem implements IWorkScheduleItem {
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
    
    isEqual(workScheduleItem?: IWorkScheduleItem): boolean {
        if (!workScheduleItem)
            return false
        
        return this._start == workScheduleItem.start && this._end == workScheduleItem.end
    }

    private validate(): void {
        if (!workScheduleHourIsValid(this._start))
            WorkScheduleError.invalidStartHour()

        if (!workScheduleIntervalIsValid(this._start, this._end))
            WorkScheduleError.invalidInterval()
    }
}

export { WorkSchedule, WorkScheduleItem }