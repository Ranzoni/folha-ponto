import type BaseResponse from "./base.response.js"
import type DepartmentResponse from "./department.response.js"
import type { RoleResponse } from "./role.response.js"

interface EmployeeRequest {
    name: string
    workSchedule: WorkScheduleRequestOrResponse,
    departmentId: number,
    roleId: number
}

interface EmployeeResponse extends BaseResponse {
    name: string
    workSchedule: WorkScheduleRequestOrResponse,
    department: DepartmentResponse,
    role: RoleResponse
}

interface WorkScheduleRequestOrResponse {
    firstPeriodStart: number
    firstPeriodEnd: number
    lunchPeriodStart?: number
    lunchPeriodEnd?: number
    secondPeriodStart?: number
    secondPeriodEnd?: number
}

export type { EmployeeRequest, EmployeeResponse, WorkScheduleRequestOrResponse }