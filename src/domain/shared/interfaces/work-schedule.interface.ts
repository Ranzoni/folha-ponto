import type { WorkScheduleItem } from "../work-schedule.model.js"

interface IWorkSchedule {
    get firstPeriod(): IWorkScheduleItem
    get lunch(): IWorkScheduleItem | undefined
    get secondPeriod(): IWorkScheduleItem | undefined
}

interface IWorkScheduleItem {
    get start(): number
    get end(): number
}

export type { IWorkSchedule, IWorkScheduleItem }