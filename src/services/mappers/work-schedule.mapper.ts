import type { WorkScheduleRequestOrResponse } from "../../api/models/employee.response.js"
import type { IWorkSchedule } from "../../domain/shared/interfaces/work-schedule.interface.js"
import { WorkSchedule, WorkScheduleItem } from "../../domain/shared/work-schedule.model.js"

function mapToWorkSchedule(workSchedule: WorkScheduleRequestOrResponse): WorkSchedule {
    const firstPeriod = new WorkScheduleItem(
        workSchedule.firstPeriodStart,
        workSchedule.firstPeriodEnd
    )

    let lunch: WorkScheduleItem | undefined
    if (workSchedule.lunchPeriodStart && workSchedule.lunchPeriodEnd)
        lunch = new WorkScheduleItem(
            workSchedule.lunchPeriodStart,
            workSchedule.lunchPeriodEnd
        )

    let secondPeriod: WorkScheduleItem | undefined
    if (workSchedule.secondPeriodStart && workSchedule.secondPeriodEnd)
        secondPeriod = new WorkScheduleItem(
            workSchedule.secondPeriodStart,
            workSchedule.secondPeriodEnd
        )

    return new WorkSchedule(firstPeriod, lunch, secondPeriod)
}

function mapToWorkScheduleResponse(workSchedule: IWorkSchedule): WorkScheduleRequestOrResponse {
    return {
        firstPeriodStart: workSchedule.firstPeriod.start,
        firstPeriodEnd: workSchedule.firstPeriod.end,
        lunchPeriodStart: workSchedule.lunch?.start,
        lunchPeriodEnd: workSchedule.lunch?.end,
        secondPeriodStart: workSchedule.secondPeriod?.start,
        secondPeriodEnd: workSchedule.secondPeriod?.end
    } as WorkScheduleRequestOrResponse
}

export { mapToWorkSchedule, mapToWorkScheduleResponse }