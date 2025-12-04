import type { IWorkSchedule } from "../work-schedule.interface.js"

export interface EmployeeRequest {
    name: string
    workSchedule: IWorkSchedule,
    departmentId: number,
    roleId: number
}