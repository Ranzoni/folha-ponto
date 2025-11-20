import type BaseResponse from "./base.response.js"
import type { EmployeeResponse } from "./employee.response.js"
import type { RoleResponse } from "./role.response.js"

interface GroupResponse extends BaseResponse {
    name: string
    employees: EmployeeResponse[],
    roles: RoleResponse[]
}

interface GroupRequest {
    name: string
    employeesIds: number[]
    rolesIds: number[]
}

export type { GroupResponse, GroupRequest }