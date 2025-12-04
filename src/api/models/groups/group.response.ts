import type BaseResponse from "../base.response.js"
import type { EmployeeResponse } from "../employees/employee.response.js"
import type { RoleResponse } from "../roles/role.response.js"

export interface GroupResponse extends BaseResponse {
    name: string
    employees: EmployeeResponse[],
    roles: RoleResponse[]
}