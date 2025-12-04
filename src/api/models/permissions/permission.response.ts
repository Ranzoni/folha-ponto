import type BaseResponse from "../base.response.js"
import type DepartmentResponse from "../departments/department.response.js"
import type { EmployeeResponse } from "../employees/employee.response.js"
import type { GroupResponse } from "../groups/group.response.js"
import type { RoleResponse } from "../roles/role.response.js"
import type { PermissionEntity } from "../../../domain/enums/permission-entity.enum.js"
import type { PermissionType } from "../../../domain/enums/permission-type.enum.js"

interface PermissionResponse extends BaseResponse {
    permissions: PermissionItemResponse[]
    employee?: EmployeeResponse
    role?: RoleResponse
    department?: DepartmentResponse
    group?: GroupResponse
}

interface PermissionItemResponse extends BaseResponse {
    entity: PermissionEntity
    type: PermissionType
}

export type { PermissionResponse, PermissionItemResponse }