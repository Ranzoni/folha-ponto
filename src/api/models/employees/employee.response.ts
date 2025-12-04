import type BaseResponse from "../base.response.js"
import type DepartmentResponse from "../departments/department.response.js"
import type { RoleResponse } from "../roles/role.response.js"
import type { IWorkSchedule } from "../work-schedule.interface.js"

export interface EmployeeResponse extends BaseResponse {
    name: string
    workSchedule: IWorkSchedule
    department: DepartmentResponse
    role: RoleResponse
}