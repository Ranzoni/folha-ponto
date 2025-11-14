interface IWorkSchedule {
    get firstPeriod(): IWorkScheduleItem
    get lunch(): IWorkScheduleItem | undefined
    get secondPeriod(): IWorkScheduleItem | undefined
}

interface IWorkScheduleItem {
    get start(): number
    get end(): number

    isEqual(workScheduleItem?: IWorkScheduleItem): boolean
}

export type { IWorkSchedule, IWorkScheduleItem }